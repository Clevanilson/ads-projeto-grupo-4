import { DatabaseSync } from "node:sqlite";
import path from "node:path";
const dbPath = path.join(process.cwd(), "src/infra/database/dev.sqlite");

export abstract class DB {
  static executar(sql: string, args: unknown[] = []) {
    const db = new DatabaseSync(dbPath);

    try {
      return db.prepare(sql).run(...args);
    } finally {
      db.close();
    }
  }

  static obter<T = any>(sql: string, args: unknown[] = []): T[] {
    const db = new DatabaseSync(dbPath);

    try {
      return db.prepare(sql).all(...args) as T[];
    } finally {
      db.close();
    }
  }
}
