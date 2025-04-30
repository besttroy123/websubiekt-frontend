import { Pool } from 'pg';

// Create a new pool using environment variables
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
});

// Function to query the database
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

// Export the pool for direct use if needed
export { pool };