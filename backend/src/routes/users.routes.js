import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

function normalizeOptionalString(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return String(value);
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalNumber(value, { integer = false } = {}) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return Number.NaN;
  }
  if (integer && !Number.isInteger(parsed)) {
    return Number.NaN;
  }
  return parsed;
}

function normalizeOptionalDate(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return Number.NaN;

  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return Number.NaN;
  return trimmed;
}

function computeBodyMetrics(userRow) {
  const height = Number(userRow?.height || 0);
  const waist = Number(userRow?.waist || 0);

  if (height <= 0 || waist <= 0) {
    return {
      ...userRow,
      waistToHeightRatio: null,
      bellyFatRisk: null
    };
  }

  const ratio = Number((waist / height).toFixed(2));
  let bellyFatRisk = 'Low';
  if (ratio >= 0.6) {
    bellyFatRisk = 'High';
  } else if (ratio >= 0.5) {
    bellyFatRisk = 'Moderate';
  }

  return {
    ...userRow,
    waistToHeightRatio: ratio,
    bellyFatRisk
  };
}

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const role = String(req.auth?.role || '').toLowerCase();
    if (role !== 'user' && role !== 'admin') {
      return res.status(403).json({ message: 'Only user/admin accounts can access this endpoint.' });
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, age, gender, height, weight, waist, date_of_birth AS dateOfBirth,
              profile_complete AS profileComplete, created_at AS createdAt
       FROM users WHERE id = ?`,
      [req.auth.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(computeBodyMetrics(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.put('/me/profile', requireAuth, async (req, res, next) => {
  try {
    const role = String(req.auth?.role || '').toLowerCase();
    if (role !== 'user' && role !== 'admin') {
      return res.status(403).json({ message: 'Only user/admin accounts can update profile.' });
    }

    const { name, age, gender, height, weight, waist, dateOfBirth } = req.body;

    const safeName = normalizeOptionalString(name);
    const safeGender = normalizeOptionalString(gender);
    const safeAge = normalizeOptionalNumber(age, { integer: true });
    const safeHeight = normalizeOptionalNumber(height);
    const safeWeight = normalizeOptionalNumber(weight);
    const safeWaist = normalizeOptionalNumber(waist);
    const safeDateOfBirth = normalizeOptionalDate(dateOfBirth);

    if (Number.isNaN(safeAge) || Number.isNaN(safeHeight) || Number.isNaN(safeWeight) || Number.isNaN(safeWaist) || Number.isNaN(safeDateOfBirth)) {
      return res.status(400).json({ message: 'Invalid profile values. Check age, height, weight, waist, and dateOfBirth format (YYYY-MM-DD).' });
    }

    await pool.query(
      `UPDATE users
       SET name = COALESCE(?, name),
           age = COALESCE(?, age),
           gender = COALESCE(?, gender),
           height = COALESCE(?, height),
           weight = COALESCE(?, weight),
           waist = COALESCE(?, waist),
           date_of_birth = COALESCE(?, date_of_birth),
           profile_complete = 1
       WHERE id = ?`,
      [safeName, safeAge, safeGender, safeHeight, safeWeight, safeWaist, safeDateOfBirth, req.auth.id]
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, age, gender, height, weight, waist, date_of_birth AS dateOfBirth,
              profile_complete AS profileComplete, created_at AS createdAt
       FROM users WHERE id = ?`,
      [req.auth.id]
    );

    return res.json(computeBodyMetrics(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, age, gender, waist, role, profile_complete AS profileComplete, created_at AS createdAt
       FROM users
       ORDER BY created_at DESC`
    );
    return res.json(rows.map(computeBodyMetrics));
  } catch (error) {
    return next(error);
  }
});

export default router;
