import { Pool, PoolClient, types } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// date-Felder (OID 1082) als plain String zurückgeben, nicht als JS Date-Objekt.
// Ohne diesen Parser gibt pg ein Date-Objekt zurück das durch Timezone-Offset
// das Datum um einen Tag verschiebt (z.B. 2026-04-09 → 2026-04-08T22:00:00.000Z).
types.setTypeParser(1082, (val: string) => val);

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
