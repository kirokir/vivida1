import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to use WebSocket in Node.js
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Initialize Neon Postgres pool with connection string from .env
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Export Drizzle instance bound to Neon + your schema
export const db = drizzle(pool, { schema });
