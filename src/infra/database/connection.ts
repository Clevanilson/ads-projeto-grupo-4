import { DatabaseSync, SQLInputValue } from "node:sqlite";
import path from "node:path";
const dbPath = path.join(process.cwd(), "src/infra/database/dev.sqlite");

export abstract class DB {
  static executar(sql: string, args: SQLInputValue[] = []) {
    const db = new DatabaseSync(dbPath);

    try {
      return db.prepare(sql).run(...args);
    } finally {
      db.close();
    }
  }

  //  eslint-disable-next-line
  static obter<T = any>(sql: string, args: SQLInputValue[] = []): T[] {
    const db = new DatabaseSync(dbPath);

    try {
      return db.prepare(sql).all(...args) as T[];
    } finally {
      db.close();
    }
  }
}
