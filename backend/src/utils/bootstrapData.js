import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';
import { classifyDietType } from './foodClassification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_EMAIL = 'tharun@nutrifit.com';
const ADMIN_NAME = 'Tharun';
const ADMIN_PASSWORD_HASH = '$2a$10$EYsWKNlVVhypk/Lp2Sp4i.9JrxKb8IzIXbsyq/cjaphzzxYXH.NfW';

function addDietType(food) {
  return {
    ...food,
    diet_type: classifyDietType(food.name, food.category, food.diet_type)
  };
}

function buildFoodRecord(item, category) {
  const name = String(item?.name || '').trim();
  if (!name) return null;

  return {
    name,
    category,
    calories: Number(item.calories || 0),
    protein: Number(item.protein || 0),
    carbs: Number(item.carbs || 0),
    fat: Number(item.fat || 0),
    iron: Number(item.iron || 0),
    calcium: Number(item.calcium || 0),
    vit_c: Number(item.vit_c || 0),
    vit_d: Number(item.vit_d || 0),
    fiber: Number(item.fiber || 0),
    vit_b12: Number(item.vit_b12 || 0),
    diet_type: classifyDietType(name, category, item?.diet_type)
  };
}

function resolveCategoryFromMealType(mealType) {
  const normalized = String(mealType || '').trim().toLowerCase();
  if (normalized === 'fruits' || normalized === 'fruit') return 'Fruit';
  if (normalized === 'juices' || normalized === 'juice' || normalized === 'liquids' || normalized === 'liquid' || normalized === 'beverages' || normalized === 'beverage') {
    return 'Liquids';
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

async function ensureNutritionColumns(connection) {
  const [userWaistRows] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'users'
       AND column_name = 'waist'`
  );

  if (Number(userWaistRows?.[0]?.total || 0) === 0) {
    await connection.query('ALTER TABLE users ADD COLUMN waist DECIMAL(5,2) NULL AFTER weight');
  }

  const [foodDietRows] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'foods'
       AND column_name = 'diet_type'`
  );

  if (Number(foodDietRows?.[0]?.total || 0) === 0) {
    await connection.query("ALTER TABLE foods ADD COLUMN diet_type ENUM('veg', 'nonveg') NOT NULL DEFAULT 'veg' AFTER category");
  }
}

function fallbackIndianFoods() {
  return [
    { name: 'Upma', category: 'Breakfast', calories: 200, protein: 6, carbs: 32, fat: 5, iron: 2.5, calcium: 60, vit_c: 15, vit_d: 0.5, fiber: 2, vit_b12: 0.1 },
    { name: 'Idli', category: 'Breakfast', calories: 140, protein: 4, carbs: 28, fat: 1, iron: 1.5, calcium: 45, vit_c: 8, vit_d: 0.3, fiber: 1.5, vit_b12: 0.05 },
    { name: 'Dosa', category: 'Breakfast', calories: 180, protein: 5, carbs: 30, fat: 5, iron: 2, calcium: 50, vit_c: 10, vit_d: 0.4, fiber: 2, vit_b12: 0.1 },
    { name: 'Pesarattu', category: 'Breakfast', calories: 190, protein: 8, carbs: 28, fat: 5, iron: 2.2, calcium: 55, vit_c: 12, vit_d: 0.3, fiber: 2.5, vit_b12: 0.15 },
    { name: 'Aloo Paratha', category: 'Breakfast', calories: 250, protein: 7, carbs: 35, fat: 8, iron: 2, calcium: 60, vit_c: 5, vit_d: 0.2, fiber: 1.5, vit_b12: 0.05 },
    { name: 'Masala Dosa', category: 'Breakfast', calories: 220, protein: 5, carbs: 32, fat: 6, iron: 2, calcium: 50, vit_c: 12, vit_d: 0.3, fiber: 2, vit_b12: 0.08 },
    { name: 'Medu Vada', category: 'Breakfast', calories: 210, protein: 8, carbs: 24, fat: 8, iron: 2, calcium: 70, vit_c: 5, vit_d: 0.2, fiber: 1, vit_b12: 0.1 },
    { name: 'Pongal', category: 'Breakfast', calories: 220, protein: 7, carbs: 38, fat: 4, iron: 1.5, calcium: 50, vit_c: 5, vit_d: 0.2, fiber: 1.5, vit_b12: 0.1 },
    { name: 'Gongura Pulao', category: 'Lunch', calories: 320, protein: 8, carbs: 48, fat: 8, iron: 3, calcium: 60, vit_c: 40, vit_d: 0.3, fiber: 2, vit_b12: 0.1 },
    { name: 'Hyderabadi Biryani', category: 'Lunch', calories: 380, protein: 15, carbs: 45, fat: 12, iron: 2.5, calcium: 50, vit_c: 8, vit_d: 0.5, fiber: 1.5, vit_b12: 0.4 },
    { name: 'Sambar', category: 'Lunch', calories: 120, protein: 6, carbs: 18, fat: 2, iron: 3, calcium: 80, vit_c: 20, vit_d: 0.1, fiber: 3, vit_b12: 0.05 },
    { name: 'Rasam', category: 'Lunch', calories: 60, protein: 2, carbs: 10, fat: 1, iron: 1, calcium: 30, vit_c: 15, vit_d: 0.05, fiber: 1.5, vit_b12: 0.02 },
    { name: 'Paneer Curry', category: 'Lunch', calories: 280, protein: 20, carbs: 15, fat: 15, iron: 1.5, calcium: 300, vit_c: 10, vit_d: 0.3, fiber: 1, vit_b12: 0.2 },
    { name: 'Butter Chicken', category: 'Lunch', calories: 320, protein: 30, carbs: 10, fat: 16, iron: 2, calcium: 60, vit_c: 12, vit_d: 0.4, fiber: 1, vit_b12: 0.5 },
    { name: 'Fish Curry', category: 'Lunch', calories: 280, protein: 32, carbs: 8, fat: 12, iron: 3, calcium: 120, vit_c: 25, vit_d: 1, fiber: 0.5, vit_b12: 1.5 },
    { name: 'Curd Rice', category: 'Lunch', calories: 200, protein: 6, carbs: 38, fat: 3, iron: 1, calcium: 120, vit_c: 5, vit_d: 0.15, fiber: 1, vit_b12: 0.2 },
    { name: 'Tamarind Rice', category: 'Lunch', calories: 260, protein: 4, carbs: 48, fat: 4, iron: 1.5, calcium: 40, vit_c: 15, vit_d: 0.1, fiber: 2.5, vit_b12: 0.05 },
    { name: 'Lemon Rice', category: 'Lunch', calories: 240, protein: 4, carbs: 46, fat: 3, iron: 1, calcium: 30, vit_c: 20, vit_d: 0.1, fiber: 2, vit_b12: 0.05 },
    { name: 'Chakli', category: 'Snacks', calories: 180, protein: 4, carbs: 22, fat: 8, iron: 1, calcium: 40, vit_c: 2, vit_d: 0.1, fiber: 0.5, vit_b12: 0.05 },
    { name: 'Murukku', category: 'Snacks', calories: 160, protein: 3, carbs: 20, fat: 7, iron: 1.2, calcium: 35, vit_c: 1, vit_d: 0.08, fiber: 0.8, vit_b12: 0.03 },
    { name: 'Mixture', category: 'Snacks', calories: 200, protein: 5, carbs: 22, fat: 9, iron: 1.5, calcium: 50, vit_c: 0, vit_d: 0.1, fiber: 1, vit_b12: 0.05 },
    { name: 'Mirchi Bajji', category: 'Snacks', calories: 180, protein: 3, carbs: 18, fat: 8, iron: 1, calcium: 30, vit_c: 20, vit_d: 0.1, fiber: 2, vit_b12: 0.03 },
    { name: 'Dahi Bhalle', category: 'Snacks', calories: 170, protein: 6, carbs: 22, fat: 5, iron: 0.5, calcium: 100, vit_c: 2, vit_d: 0.2, fiber: 0.5, vit_b12: 0.2 },
    { name: 'Peanut Laddu', category: 'Snacks', calories: 220, protein: 8, carbs: 20, fat: 12, iron: 2.5, calcium: 60, vit_c: 2, vit_d: 0.2, fiber: 2, vit_b12: 0.1 },
    { name: 'Jalebi', category: 'Snacks', calories: 220, protein: 2, carbs: 50, fat: 1, iron: 0.5, calcium: 15, vit_c: 0, vit_d: 0, fiber: 0.2, vit_b12: 0 },
    { name: 'Laddu', category: 'Snacks', calories: 240, protein: 6, carbs: 30, fat: 12, iron: 2, calcium: 80, vit_c: 2, vit_d: 0.6, fiber: 2, vit_b12: 0.15 },
    { name: 'Khichdi', category: 'Dinner', calories: 180, protein: 7, carbs: 28, fat: 4, iron: 1.8, calcium: 70, vit_c: 5, vit_d: 0.4, fiber: 2, vit_b12: 0.08 },
    { name: 'Rajma Chawal', category: 'Dinner', calories: 280, protein: 12, carbs: 42, fat: 5, iron: 3, calcium: 95, vit_c: 4, vit_d: 0.5, fiber: 4, vit_b12: 0.08 },
    { name: 'Chana Masala', category: 'Dinner', calories: 200, protein: 10, carbs: 28, fat: 6, iron: 2.8, calcium: 85, vit_c: 8, vit_d: 0.4, fiber: 3.5, vit_b12: 0.12 },
    { name: 'Baingan Bharta', category: 'Dinner', calories: 130, protein: 4, carbs: 18, fat: 5, iron: 1.4, calcium: 50, vit_c: 22, vit_d: 0.3, fiber: 2, vit_b12: 0.05 },
    { name: 'Jowar Roti', category: 'Dinner', calories: 200, protein: 5, carbs: 35, fat: 4, iron: 4, calcium: 100, vit_c: 0, vit_d: 0.1, fiber: 3.5, vit_b12: 0.08 },
    { name: 'Spinach Dal', category: 'Dinner', calories: 170, protein: 10, carbs: 24, fat: 3, iron: 5, calcium: 150, vit_c: 20, vit_d: 0.1, fiber: 3.5, vit_b12: 0.1 },
    { name: 'Lentil Soup', category: 'Dinner', calories: 160, protein: 12, carbs: 24, fat: 1, iron: 3.5, calcium: 80, vit_c: 8, vit_d: 0.05, fiber: 4, vit_b12: 0.1 },
    { name: 'Vegetable Stew', category: 'Dinner', calories: 200, protein: 6, carbs: 28, fat: 6, iron: 2, calcium: 60, vit_c: 30, vit_d: 0.2, fiber: 3.5, vit_b12: 0.05 }
  ].map(addDietType);
}

function loadIndianFoodsFromDatasetFile() {
  try {
    const datasetPath = path.resolve(__dirname, '../../../INDIAN_FOODS_COMPLETE.json');
    const raw = fs.readFileSync(datasetPath, 'utf8');

    const objectStart = raw.indexOf('{');
    const objectEnd = raw.lastIndexOf('};');
    if (objectStart === -1 || objectEnd === -1) {
      return fallbackIndianFoods();
    }

    const jsonObjectText = raw.slice(objectStart, objectEnd + 1);
    const parsed = JSON.parse(jsonObjectText);
    const states = Array.isArray(parsed.states) ? parsed.states : [];

    const normalizedFoods = [];
    const seen = new Set();

    for (const state of states) {
      const meals = state?.meals || {};
      for (const [mealType, items] of Object.entries(meals)) {
        if (!Array.isArray(items)) continue;
        const category = resolveCategoryFromMealType(mealType);

        for (const item of items) {
          const name = String(item?.name || '').trim();
          if (!name) continue;

          const key = name.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);

          const foodRecord = buildFoodRecord(item, category);
          if (foodRecord) {
            normalizedFoods.push(foodRecord);
          }
        }
      }
    }

    return normalizedFoods.length > 0 ? normalizedFoods : fallbackIndianFoods();
  } catch {
    return fallbackIndianFoods();
  }
}

export async function seedAdminAndFoods() {
  const foods = loadIndianFoodsFromDatasetFile();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureNutritionColumns(connection);

    await connection.query('DELETE FROM users WHERE role = ? AND email <> ?', ['admin', ADMIN_EMAIL]);
    await connection.query(
      `INSERT INTO users (name, email, password_hash, role, profile_complete)
       VALUES (?, ?, ?, 'admin', 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password_hash = VALUES(password_hash),
         role = 'admin',
         profile_complete = 1`,
      [ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD_HASH]
    );

    for (const food of foods) {
      await connection.query(
        `INSERT INTO foods
         (name, category, diet_type, calories, protein, carbs, fat, iron, calcium, vit_c, vit_d, fiber, vit_b12)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
         FROM DUAL
         WHERE NOT EXISTS (SELECT 1 FROM foods WHERE LOWER(name) = LOWER(?))`,
        [
          food.name,
          food.category,
          food.diet_type,
          food.calories,
          food.protein,
          food.carbs,
          food.fat,
          food.iron,
          food.calcium,
          food.vit_c,
          food.vit_d,
          food.fiber,
          food.vit_b12,
          food.name
        ]
      );
    }

    await connection.query(
      `UPDATE foods
       SET diet_type = CASE
         WHEN LOWER(name) REGEXP 'chicken|fish|egg|eggs|mutton|meat|beef|pork|lamb|duck|goat|prawn|shrimp|crab|lobster|keema|chorizo'
         THEN 'nonveg'
         ELSE 'veg'
       END`
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
