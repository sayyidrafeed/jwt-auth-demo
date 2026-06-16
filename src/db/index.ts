import { drizzle as nodeDrizzle } from "drizzle-orm/node-postgres";
import { Pool as NodePool } from "pg";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { Pool as NeonPool } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5433/jwtauth";

const isNeon = connectionString.includes("neon.tech");

export const db = isNeon
  ? neonDrizzle(new NeonPool({ connectionString }), { schema })
  : nodeDrizzle(new NodePool({ connectionString }), { schema });
