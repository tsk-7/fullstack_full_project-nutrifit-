import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'JWT_SECRET'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mysqlHost: process.env.MYSQL_HOST,
  mysqlPort: Number(process.env.MYSQL_PORT || 3306),
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5176']
};
