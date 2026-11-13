import { neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import "server-only";
import { WebSocket } from "ws";
import { keys } from "./keys";
import { account, page, session, user, verification } from "./schema";

export const schema = {
  user,
  session,
  account,
  verification,
  page,
};

// Use a real WebSocket implementation (from `ws`) for the serverless driver's
// WebSocket transport, matching how the old Prisma client configured Neon.
neonConfig.webSocketConstructor = WebSocket;

const createDatabase = () => drizzle(keys().DATABASE_URL ?? "", { schema });

type Database = ReturnType<typeof createDatabase>;

const globalForDb = global as unknown as { database?: Database };

export const database = globalForDb.database ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDb.database = database;
}
