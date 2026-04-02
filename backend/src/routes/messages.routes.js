import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreateConversation(userId, doctorId) {
  const [existing] = await pool.query(
    'SELECT id FROM conversations WHERE user_id = ? AND doctor_id = ?',
    [userId, doctorId]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    'INSERT INTO conversations (user_id, doctor_id) VALUES (?, ?)',
    [userId, doctorId]
  );
  return result.insertId;
}

router.get('/conversation/:doctorId', requireAuth, requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const conversationId = await getOrCreateConversation(req.auth.id, doctorId);

    const [rows] = await pool.query(
      `SELECT id, sender_type AS senderType, text, rated, rating, feedback, created_at AS createdAt
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/doctor/inbox', requireAuth, requireRole('doctor'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id AS conversationId, u.id AS userId, u.name AS userName, u.email AS userEmail,
              MAX(m.created_at) AS lastMessageAt,
              SUBSTRING_INDEX(GROUP_CONCAT(m.text ORDER BY m.created_at DESC SEPARATOR '||'), '||', 1) AS lastMessage
       FROM conversations c
       JOIN users u ON u.id = c.user_id
       LEFT JOIN messages m ON m.conversation_id = c.id
       WHERE c.doctor_id = ?
       GROUP BY c.id, u.id, u.name, u.email
       ORDER BY lastMessageAt DESC`,
      [req.auth.id]
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { doctorId, userId, text } = req.body;
    const role = String(req.auth?.role || '').toLowerCase();

    if (!text) {
      return res.status(400).json({ message: 'text is required.' });
    }

    let conversationId;
    let senderType;
    let senderUserId = null;
    let senderDoctorId = null;

    if (role === 'doctor') {
      if (!userId) {
        return res.status(400).json({ message: 'userId is required for doctor messages.' });
      }
      conversationId = await getOrCreateConversation(Number(userId), req.auth.id);
      senderType = 'doctor';
      senderDoctorId = req.auth.id;
    } else if (role === 'user' || role === 'admin') {
      if (!doctorId) {
        return res.status(400).json({ message: 'doctorId is required for user messages.' });
      }
      conversationId = await getOrCreateConversation(req.auth.id, Number(doctorId));
      senderType = 'user';
      senderUserId = req.auth.id;
    } else {
      return res.status(403).json({ message: 'Invalid sender role.' });
    }

    const [result] = await pool.query(
      `INSERT INTO messages (conversation_id, sender_type, sender_user_id, sender_doctor_id, text, rated, rating, feedback, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [conversationId, senderType, senderUserId, senderDoctorId, text, 0, null, null]
    );

    const [rows] = await pool.query(
      `SELECT id, sender_type AS senderType, text, rated, rating, feedback, created_at AS createdAt
       FROM messages
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put('/:messageId/rate', requireAuth, requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const messageId = Number(req.params.messageId);
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5.' });
    }

    const [messageRows] = await pool.query(
      `SELECT m.id, m.sender_doctor_id AS doctorId, c.user_id AS userId
       FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE m.id = ?`,
      [messageId]
    );

    if (messageRows.length === 0) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    const target = messageRows[0];
    if (target.userId !== req.auth.id) {
      return res.status(403).json({ message: 'You can only rate messages in your own conversation.' });
    }

    await pool.query('UPDATE messages SET rated = 1, rating = ?, feedback = ? WHERE id = ?', [
      rating,
      feedback || null,
      messageId
    ]);

    if (target.doctorId) {
      await pool.query(
        `UPDATE doctors d
         JOIN (
           SELECT sender_doctor_id AS doctor_id, AVG(rating) AS avg_rating, COUNT(*) AS total_count
           FROM messages
           WHERE sender_doctor_id IS NOT NULL AND rated = 1
           GROUP BY sender_doctor_id
         ) agg ON agg.doctor_id = d.id
         SET d.rating = ROUND(agg.avg_rating, 2), d.total_ratings = agg.total_count
         WHERE d.id = ?`,
        [target.doctorId]
      );
    }

    return res.json({ message: 'Message rated successfully.' });
  } catch (error) {
    return next(error);
  }
});

router.get('/doctor/conversation/:userId', requireAuth, requireRole('doctor'), async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const conversationId = await getOrCreateConversation(userId, req.auth.id);

    const [rows] = await pool.query(
      `SELECT id, sender_type AS senderType, text, rated, rating, feedback, created_at AS createdAt
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/all', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.sender_type AS senderType, m.text, m.rated, m.rating, m.feedback,
              m.created_at AS createdAt,
              c.id AS conversationId,
              u.id AS userId, u.name AS userName,
              d.id AS doctorId, d.name AS doctorName
       FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       JOIN users u ON u.id = c.user_id
       JOIN doctors d ON d.id = c.doctor_id
       ORDER BY m.created_at DESC`
    );

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

export default router;
