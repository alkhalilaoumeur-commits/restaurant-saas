import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function q<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]> {
  const res = await pool.query(sql, params);
  return res.rows as T[];
}

export async function q1<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null> {
  const res = await pool.query(sql, params);
  return (res.rows[0] as T) ?? null;
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
