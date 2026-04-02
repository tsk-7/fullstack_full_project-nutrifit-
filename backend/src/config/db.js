import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  host: env.mysqlHost,
  port: env.mysqlPort,
  user: env.mysqlUser,
  password: env.mysqlPassword,
  database: env.mysqlDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

export async function testDbConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}
