import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { normalizeDietType } from '../utils/foodClassification.js';

const router = express.Router();

function formatFoodRow(row) {
  return {
    ...row,
    dietType: row.dietType || row.diet_type || 'veg'
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, category, diet_type AS dietType, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              created_at AS createdAt, updated_at AS updatedAt
       FROM foods
       ORDER BY name ASC`
    );
    return res.json(rows.map(formatFoodRow));
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const {
      name,
      category,
      dietType,
      calories,
      protein,
      carbs,
      fat,
      iron,
      calcium,
      vitC,
      vitD,
      fiber,
      vitB12
    } = req.body;

    if (!name || calories == null) {
      return res.status(400).json({ message: 'name and calories are required.' });
    }

    const resolvedDietType = normalizeDietType(dietType, name, category);

    const [result] = await pool.query(
      `INSERT INTO foods
       (name, category, diet_type, calories, protein, carbs, fat, iron, calcium, vit_c, vit_d, fiber, vit_b12)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category || null,
        resolvedDietType,
        calories,
        protein || 0,
        carbs || 0,
        fat || 0,
        iron || 0,
        calcium || 0,
        vitC || 0,
        vitD || 0,
        fiber || 0,
        vitB12 || 0
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, category, diet_type AS dietType, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              created_at AS createdAt, updated_at AS updatedAt
       FROM foods
       WHERE id = ?`,
      [result.insertId]
    );
    return res.status(201).json(formatFoodRow(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.put('/:foodId', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const foodId = Number(req.params.foodId);
    const {
      name,
      category,
      dietType,
      calories,
      protein,
      carbs,
      fat,
      iron,
      calcium,
      vitC,
      vitD,
      fiber,
      vitB12
    } = req.body;

    const [existingRows] = await pool.query(
      `SELECT name, category, diet_type AS dietType
       FROM foods
       WHERE id = ?`,
      [foodId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Food not found.' });
    }

    const existingFood = existingRows[0];
    const resolvedDietType = normalizeDietType(
      dietType ?? existingFood.dietType,
      name ?? existingFood.name,
      category ?? existingFood.category
    );

    await pool.query(
      `UPDATE foods
       SET name = COALESCE(?, name),
           category = COALESCE(?, category),
           diet_type = COALESCE(?, diet_type),
           calories = COALESCE(?, calories),
           protein = COALESCE(?, protein),
           carbs = COALESCE(?, carbs),
           fat = COALESCE(?, fat),
           iron = COALESCE(?, iron),
           calcium = COALESCE(?, calcium),
           vit_c = COALESCE(?, vit_c),
           vit_d = COALESCE(?, vit_d),
           fiber = COALESCE(?, fiber),
           vit_b12 = COALESCE(?, vit_b12)
       WHERE id = ?`,
      [name, category, resolvedDietType, calories, protein, carbs, fat, iron, calcium, vitC, vitD, fiber, vitB12, foodId]
    );

    const [rows] = await pool.query(
      `SELECT id, name, category, diet_type AS dietType, calories, protein, carbs, fat, iron, calcium,
              vit_c AS vitC, vit_d AS vitD, fiber, vit_b12 AS vitB12,
              created_at AS createdAt, updated_at AS updatedAt
       FROM foods
       WHERE id = ?`,
      [foodId]
    );
    return res.json(formatFoodRow(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:foodId', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const foodId = Number(req.params.foodId);
    const [result] = await pool.query('DELETE FROM foods WHERE id = ?', [foodId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food not found.' });
    }

    return res.json({ message: 'Food deleted successfully.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
