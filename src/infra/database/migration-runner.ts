
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

export function runMigrations() {
  const dbPath = path.join(process.cwd(), "src/infra/database/dev.sqlite");
  const migrationsDir = path.join(process.cwd(), "src/infra/migration");

  const db = new DatabaseSync(dbPath);

  const applied: string[] = [];

  try {
    db.exec("PRAGMA foreign_keys = ON");

    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrations = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const getMigration = db.prepare(`
      SELECT name FROM migrations WHERE name = ?
    `);

    const recordMigration = db.prepare(`
      INSERT INTO migrations (name) VALUES (?)
    `);

    for (const migration of migrations) {
      if (getMigration.get(migration)) {
        continue;
      }

      const sql = fs.readFileSync(
        path.join(migrationsDir, migration),
        "utf8"
      );

      db.exec("BEGIN TRANSACTION");

      try {
        db.exec(sql);
        recordMigration.run(migration);
        db.exec("COMMIT");

        applied.push(migration);
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    }

    return applied;
  } finally {
    db.close();
  }
}
