import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, specialty, experience_years AS experienceYears,
              rating, total_ratings AS totalRatings, avatar, available
       FROM doctors
       ORDER BY rating DESC, total_ratings DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:doctorId/availability', requireAuth, requireRole('doctor'), async (req, res, next) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const { available } = req.body;

    if (req.auth.id !== doctorId) {
      return res.status(403).json({ message: 'You can update only your own availability.' });
    }

    await pool.query('UPDATE doctors SET available = ? WHERE id = ?', [available ? 1 : 0, doctorId]);
    return res.json({ message: 'Availability updated successfully.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
