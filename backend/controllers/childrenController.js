const { query } = require('../database/db');

async function registerChild(req, res) {
  try {
    const { full_name, gender, date_of_birth, district, consent_given } = req.body;

    const result = await query(
      `INSERT INTO children (guardian_id, full_name, gender, date_of_birth, district, consent_given)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [req.user.id, full_name, gender, date_of_birth, district, consent_given ? 1 : 0]
    );

    res.status(201).json({
      message: 'Child registered successfully',
      child_id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyChildren(req, res) {
  try {
    const result = await query(
      'SELECT * FROM children WHERE guardian_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getChildById(req, res) {
  try {
    const result = await query('SELECT * FROM children WHERE id = $1', [req.params.id]);
    const child = result.rows[0];
    if (!child) return res.status(404).json({ error: 'Child not found' });
    if (child.guardian_id !== req.user.id && req.user.role === 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// For health officers — all children in their district
async function getAllChildren(req, res) {
  try {
    const result = await query(
      `SELECT c.*, u.name AS guardian_name, u.district AS guardian_district
       FROM children c
       JOIN users u ON c.guardian_id = u.id
       ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { registerChild, getMyChildren, getChildById, getAllChildren };

async function registerChild(req, res) {
  try {
    const {
      full_name, gender, date_of_birth, district, consent_given,
      guardian_name, guardian_phone, guardian_relationship
    } = req.body;

    const result = await query(
      `INSERT INTO children
        (guardian_id, full_name, gender, date_of_birth, district, consent_given,
         guardian_name, guardian_phone, guardian_relationship)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [
        req.user.id, full_name, gender, date_of_birth, district,
        consent_given ? 1 : 0,
        guardian_name || null,
        guardian_phone || null,
        guardian_relationship || null
      ]
    );

    res.status(201).json({
      message: 'Child registered successfully',
      child_id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}