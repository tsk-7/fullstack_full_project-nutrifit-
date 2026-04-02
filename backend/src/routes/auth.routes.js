import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { signToken } from '../utils/token.js';

const router = express.Router();

function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: String(user.role || 'user').toLowerCase()
  };
}

function buildDoctorPayload(doctor) {
  return {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    role: 'doctor'
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, age, gender, role, profile_complete)
       VALUES (?, ?, ?, ?, ?, 'user', 0)`,
      [name, email, passwordHash, age || null, gender || null]
    );

    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [result.insertId]);
    const user = users[0];
    const token = signToken(buildUserPayload(user));

    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(buildUserPayload(user));
    return res.json({ token, user: buildUserPayload(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/doctor-register', async (req, res, next) => {
  try {
    const { name, email, password, specialty, experienceYears } = req.body;
    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim().toLowerCase();
    const safeSpecialty = specialty ? String(specialty).trim() : null;
    const safeExperienceYears =
      experienceYears === undefined || experienceYears === null || experienceYears === ''
        ? null
        : Number.parseInt(experienceYears, 10);

    if (!safeName || !safeEmail || !password) {
      return res.status(400).json({ message: 'name, email, and password are required.' });
    }

    if (safeExperienceYears !== null && Number.isNaN(safeExperienceYears)) {
      return res.status(400).json({ message: 'experienceYears must be a valid integer.' });
    }

    const [existing] = await pool.query('SELECT id FROM doctors WHERE email = ?', [safeEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Doctor already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = safeName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR';

    const [result] = await pool.query(
      `INSERT INTO doctors
       (name, email, password_hash, specialty, experience_years, rating, total_ratings, avatar, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [safeName, safeEmail, passwordHash, safeSpecialty, safeExperienceYears, 0, 0, avatar]
    );

    const [rows] = await pool.query(
      'SELECT id, name, email, specialty, experience_years, rating, total_ratings, avatar, available FROM doctors WHERE id = ?',
      [result.insertId]
    );
    const doctor = rows[0];
    const token = signToken(buildDoctorPayload(doctor));

    return res.status(201).json({ token, doctor });
  } catch (error) {
    return next(error);
  }
});

router.post('/doctor-login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const doctor = rows[0];
    const isMatch = await bcrypt.compare(password, doctor.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(buildDoctorPayload(doctor));
    return res.json({ token, doctor: buildDoctorPayload(doctor) });
  } catch (error) {
    return next(error);
  }
});

export default router;
