import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/stats', async (_req, res, next) => {
  try {
    const [[userCount]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [[doctorCount]] = await pool.query('SELECT COUNT(*) AS totalDoctors FROM doctors');
    const [[mealCount]] = await pool.query('SELECT COUNT(*) AS totalMeals FROM meals');
    const [[messageCount]] = await pool.query('SELECT COUNT(*) AS totalMessages FROM messages');

    return res.json({
      totalUsers: userCount.totalUsers,
      totalDoctors: doctorCount.totalDoctors,
      totalMeals: mealCount.totalMeals,
      totalMessages: messageCount.totalMessages
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/users/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [userRows] = await connection.query('SELECT id FROM users WHERE id = ? AND role = \'user\'', [userId]);
      if (userRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'User not found.' });
      }

      await connection.query('DELETE FROM meals WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM conversations WHERE user_id = ?', [userId]);
      await connection.query('UPDATE messages SET sender_user_id = NULL WHERE sender_user_id = ?', [userId]);
      await connection.query('DELETE FROM users WHERE id = ? AND role = \'user\'', [userId]);

      await connection.commit();
      return res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return next(error);
  }
});

export default router;
