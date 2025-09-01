import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

class Database {
  private static instance: NodePgDatabase | null = null;

  constructor() {
    throw new Error("Use Database.getInstance() instead of new.");
  }

  static getInstance(): NodePgDatabase {
    if (!Database.instance) {
      // if (!Bun.env.DATABASE_URL) {
      //   throw new Error("DATABASE_URL environment variable is not set");
      // }
      const pool = new Pool({
        connectionString:
          "postgresql://dbadmin:Welcome123@localhost:6543/plyseradb?schema=public",
      });
      Database.instance = drizzle({
        client: pool,
        casing: "snake_case",
      });
    }
    return Database.instance;
  }
}

export const db = Database.getInstance();
export type TNodePgDatabase = NodePgDatabase;
export * from "drizzle-orm";
