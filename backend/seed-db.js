import mysql from 'mysql2/promise';
import fs from 'fs';
import { seedAdminAndFoods } from './src/utils/bootstrapData.js';

async function seedDatabase() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'nutrifit_db',
      multipleStatements: true
    });

    const conn = await pool.getConnection();
    try {
      // Read and execute seed data
      const seed = fs.readFileSync('./sql/seed.sql', 'utf8');
      await conn.query(seed);
      console.log('✅ Seed data inserted successfully!');
    } finally {
      conn.release();
    }

    await seedAdminAndFoods();
    console.log('✅ Admin and Indian foods synchronized!');

    await pool.end();
    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
