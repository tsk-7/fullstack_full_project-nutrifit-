import mysql from 'mysql2/promise';
import fs from 'fs';

async function setupDatabase() {
  try {
    // First connection to create database
    const adminPool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      multipleStatements: true
    });

    const adminConn = await adminPool.getConnection();
    try {
      // Read and execute schema
      const schema = fs.readFileSync('./sql/schema.sql', 'utf8');
      await adminConn.query(schema);
      console.log('✅ Database schema created successfully!');
    } finally {
      adminConn.release();
    }

    await adminPool.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
