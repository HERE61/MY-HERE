import { Pool, neon } from '@neondatabase/serverless';
import { drizzle as neonHttpDrizzle } from 'drizzle-orm/neon-http';
import { drizzle as neonServerlessDrizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

export const sql = neon(process.env.NEON_DATABASE_URL!);
export const db = neonHttpDrizzle(sql, { schema });

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL! });
export const dbPool = neonServerlessDrizzle(pool, { schema });
