const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDb } = require('../database/db');

router.get('/', protect, (req, res) => {
  const db = getDb();
  let referrals;
  if (req.user.role === 'admin' || req.user.role === 'health_officer') {
    referrals = db.prepare('SELECT * FROM referrals ORDER BY generated_at DESC').all();
  } else {
    referrals = db.prepare(
      `SELECT r.* FROM referrals r
       JOIN children c ON r.child_id = c.id
       WHERE c.guardian_id = ?
       ORDER BY r.generated_at DESC`
    ).all(req.user.id);
  }
  res.json(referrals);
});

router.get('/:id', protect, (req, res) => {
  const db = getDb();
  const referral = db.prepare('SELECT * FROM referrals WHERE id = ?').get(req.params.id);
  if (!referral) return res.status(404).json({ error: 'Referral not found' });
  res.json(referral);
});

module.exports = router;