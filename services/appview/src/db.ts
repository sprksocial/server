import {
  Kysely,
  Migrator,
  Migration,
  MigrationProvider,
  PostgresDialect,
} from "kysely";
import { env } from "./env";
import { Pool } from "pg";

export type DatabaseSchema = {
  auth_session: AuthSession;
  auth_state: AuthState;
};

export type AuthSession = {
  key: string;
  session: AuthSessionJson;
};

export type AuthState = {
  key: string;
  state: AuthStateJson;
};

type AuthStateJson = string;

type AuthSessionJson = string;

// Migrations

const migrations: Record<string, Migration> = {};

const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations;
  },
};

migrations["001"] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable("auth_session")
      .addColumn("key", "varchar", (col) => col.primaryKey())
      .addColumn("session", "varchar", (col) => col.notNull())
      .execute();
    await db.schema
      .createTable("auth_state")
      .addColumn("key", "varchar", (col) => col.primaryKey())
      .addColumn("state", "varchar", (col) => col.notNull())
      .execute();
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropTable("music").execute();
    await db.schema.dropTable("auth_state").execute();
    await db.schema.dropTable("auth_session").execute();
    await db.schema.dropTable("status").execute();
  },
};

// APIs

export const createDb = (): Database => {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      pool: new Pool({
        database: env.DB_NAME,
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
      }),
    }),
  });
};

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider });
  const { error } = await migrator.migrateToLatest();
  if (error) throw error;
};

export type Database = Kysely<DatabaseSchema>;
