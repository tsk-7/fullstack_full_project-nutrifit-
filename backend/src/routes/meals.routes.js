import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function safeDateOrToday(value) {
  return isValidDate(value) ? value : new Date().toISOString().split('T')[0];
}

router.get('/today', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, meal_time AS mealTime, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              consumed_on AS consumedOn, created_at AS createdAt
       FROM meals
       WHERE user_id = ? AND consumed_on = CURDATE()
       ORDER BY created_at DESC`,
      [req.auth.id]
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/totals/today', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         COALESCE(SUM(calories), 0) AS calories,
         COALESCE(SUM(protein), 0) AS protein,
         COALESCE(SUM(carbs), 0) AS carbs,
         COALESCE(SUM(fat), 0) AS fat,
         COALESCE(SUM(iron), 0) AS iron,
         COALESCE(SUM(calcium), 0) AS calcium,
         COALESCE(SUM(vit_c), 0) AS vitC,
         COALESCE(SUM(vit_d), 0) AS vitD,
         COALESCE(SUM(fiber), 0) AS fiber,
         COALESCE(SUM(vit_b12), 0) AS vitB12
       FROM meals
       WHERE user_id = ? AND consumed_on = CURDATE()`,
      [req.auth.id]
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.get('/water/today', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT glasses
       FROM water_logs
       WHERE user_id = ? AND consumed_on = CURDATE()
       LIMIT 1`,
      [req.auth.id]
    );

    return res.json({ glasses: rows[0]?.glasses || 0 });
  } catch (error) {
    return next(error);
  }
});

router.put('/water', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const date = safeDateOrToday(req.body?.consumedOn);
    const glasses = Number(req.body?.glasses || 0);

    if (!Number.isFinite(glasses) || glasses < 0) {
      return res.status(400).json({ message: 'glasses must be a non-negative number.' });
    }

    const safeGlasses = Math.min(Math.round(glasses), 30);

    await pool.query(
      `INSERT INTO water_logs (user_id, consumed_on, glasses)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE glasses = VALUES(glasses), updated_at = CURRENT_TIMESTAMP`,
      [req.auth.id, date, safeGlasses]
    );

    return res.json({ glasses: safeGlasses, consumedOn: date });
  } catch (error) {
    return next(error);
  }
});

router.get('/report/daily', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const date = safeDateOrToday(req.query?.date);

    const [mealRows] = await pool.query(
      `SELECT id, name, meal_time AS mealTime, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              consumed_on AS consumedOn, created_at AS createdAt
       FROM meals
       WHERE user_id = ? AND consumed_on = ?
       ORDER BY created_at ASC`,
      [req.auth.id, date]
    );

    const [totalsRows] = await pool.query(
      `SELECT
         COALESCE(SUM(calories), 0) AS calories,
         COALESCE(SUM(protein), 0) AS protein,
         COALESCE(SUM(carbs), 0) AS carbs,
         COALESCE(SUM(fat), 0) AS fat,
         COALESCE(SUM(iron), 0) AS iron,
         COALESCE(SUM(calcium), 0) AS calcium,
         COALESCE(SUM(vit_c), 0) AS vitC,
         COALESCE(SUM(vit_d), 0) AS vitD,
         COALESCE(SUM(fiber), 0) AS fiber,
         COALESCE(SUM(vit_b12), 0) AS vitB12
       FROM meals
       WHERE user_id = ? AND consumed_on = ?`,
      [req.auth.id, date]
    );

    const [waterRows] = await pool.query(
      `SELECT glasses
       FROM water_logs
       WHERE user_id = ? AND consumed_on = ?
       LIMIT 1`,
      [req.auth.id, date]
    );

    const fruits = mealRows.filter((meal) => /fruit|apple|banana|orange|papaya|mango|berry|grape|melon|kiwi/i.test(String(meal.name || '')));
    const liquids = mealRows.filter((meal) => /juice|smoothie|milk|water|lassi|buttermilk|tea|coffee|shake|drink|coconut/i.test(String(meal.name || '')));

    return res.json({
      date,
      meals: mealRows,
      totals: totalsRows[0],
      waterGlasses: waterRows[0]?.glasses || 0,
      fruits,
      liquids
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/report/daywise', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const from = isValidDate(req.query?.from) ? req.query.from : null;
    const to = isValidDate(req.query?.to) ? req.query.to : null;

    const [rows] = await pool.query(
      `SELECT d.date,
              COUNT(m.id) AS mealsCount,
              COALESCE(SUM(m.calories), 0) AS calories,
              COALESCE(SUM(m.protein), 0) AS protein,
              COALESCE(SUM(m.carbs), 0) AS carbs,
              COALESCE(SUM(m.fat), 0) AS fat,
              COALESCE(SUM(m.fiber), 0) AS fiber,
              COALESCE(MAX(w.glasses), 0) AS waterGlasses
       FROM (
         SELECT consumed_on AS date FROM meals WHERE user_id = ?
         UNION
         SELECT consumed_on AS date FROM water_logs WHERE user_id = ?
       ) d
       LEFT JOIN meals m ON m.user_id = ? AND m.consumed_on = d.date
       LEFT JOIN water_logs w ON w.user_id = ? AND w.consumed_on = d.date
       ${from && to ? 'WHERE d.date BETWEEN ? AND ?' : ''}
       GROUP BY d.date
       ORDER BY d.date DESC`,
      from && to ? [req.auth.id, req.auth.id, req.auth.id, req.auth.id, from, to] : [req.auth.id, req.auth.id, req.auth.id, req.auth.id]
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const {
      name,
      mealTime,
      calories,
      protein,
      carbs,
      fat,
      iron,
      calcium,
      vitC,
      vitD,
      fiber,
      vitB12,
      consumedOn,
      foodId
    } = req.body;

    if (!name || calories == null) {
      return res.status(400).json({ message: 'name and calories are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO meals
       (user_id, food_id, name, meal_time, calories, protein, carbs, fat, iron, calcium, vit_c, vit_d, fiber, vit_b12, consumed_on, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.auth.id,
        foodId || null,
        name,
        mealTime || null,
        calories,
        protein || 0,
        carbs || 0,
        fat || 0,
        iron || 0,
        calcium || 0,
        vitC || 0,
        vitD || 0,
        fiber || 0,
        vitB12 || 0,
        consumedOn || new Date().toISOString().split('T')[0]
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, meal_time AS mealTime, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              consumed_on AS consumedOn, created_at AS createdAt
       FROM meals
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:mealId', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const mealId = Number(req.params.mealId);
    const [result] = await pool.query('DELETE FROM meals WHERE id = ? AND user_id = ?', [mealId, req.auth.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Meal not found.' });
    }

    return res.json({ message: 'Meal removed successfully.' });
  } catch (error) {
    return next(error);
  }
});

router.get('/doctor/user/:userId/daywise', requireRole('doctor'), async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }

    const from = isValidDate(req.query?.from) ? req.query.from : null;
    const to = isValidDate(req.query?.to) ? req.query.to : null;

    const [rows] = await pool.query(
      `SELECT d.date,
              COUNT(m.id) AS mealsCount,
              COALESCE(SUM(m.calories), 0) AS calories,
              COALESCE(SUM(m.protein), 0) AS protein,
              COALESCE(SUM(m.carbs), 0) AS carbs,
              COALESCE(SUM(m.fat), 0) AS fat,
              COALESCE(SUM(m.fiber), 0) AS fiber,
              COALESCE(MAX(w.glasses), 0) AS waterGlasses
       FROM (
         SELECT consumed_on AS date FROM meals WHERE user_id = ?
         UNION
         SELECT consumed_on AS date FROM water_logs WHERE user_id = ?
       ) d
       LEFT JOIN meals m ON m.user_id = ? AND m.consumed_on = d.date
       LEFT JOIN water_logs w ON w.user_id = ? AND w.consumed_on = d.date
       ${from && to ? 'WHERE d.date BETWEEN ? AND ?' : ''}
       GROUP BY d.date
       ORDER BY d.date DESC`,
      from && to ? [userId, userId, userId, userId, from, to] : [userId, userId, userId, userId]
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

export default router;
