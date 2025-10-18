import { drizzle } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.env.DATABASE_URL,
});

export const db = drizzle(pool);

