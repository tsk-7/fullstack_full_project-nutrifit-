import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import doctorsRoutes from './routes/doctors.routes.js';
import foodsRoutes from './routes/foods.routes.js';
import mealsRoutes from './routes/meals.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(cors({ 
  origin: env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

export default app;
