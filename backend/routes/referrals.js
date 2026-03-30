const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { query } = require('../database/db');

router.get('/', protect, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin' || req.user.role === 'health_officer') {
      result = await query('SELECT * FROM referrals ORDER BY generated_at DESC');
    } else {
      result = await query(
        `SELECT r.* FROM referrals r
         JOIN children c ON r.child_id = c.id
         WHERE c.guardian_id = $1
         ORDER BY r.generated_at DESC`,
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const result = await query('SELECT * FROM referrals WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Referral not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;