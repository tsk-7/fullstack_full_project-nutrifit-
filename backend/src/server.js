import app from './app.js';
import { env } from './config/env.js';
import { testDbConnection } from './config/db.js';
import { seedAdminAndFoods } from './utils/bootstrapData.js';

async function startServer() {
  try {
    await testDbConnection();
    await seedAdminAndFoods();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
