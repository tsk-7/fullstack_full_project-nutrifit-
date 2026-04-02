import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const normalizedAllowedRoles = roles.map((role) => String(role).toLowerCase());
    const tokenRole = String(req.auth?.role || '').toLowerCase();

    if (!req.auth || !normalizedAllowedRoles.includes(tokenRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }
    return next();
  };
}
