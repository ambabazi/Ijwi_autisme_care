const { getDb } = require('../database/db');

function registerChild(req, res) {
  const db = getDb();
  const { full_name, gender, date_of_birth, district, consent_given } = req.body;

  const result = db.prepare(
    `INSERT INTO children (guardian_id, full_name, gender, date_of_birth, district, consent_given)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, full_name, gender, date_of_birth, district, consent_given ? 1 : 0);

  res.status(201).json({
    message: 'Child registered successfully',
    child_id: result.lastInsertRowid
  });
}

function getMyChildren(req, res) {
  const db = getDb();
  const children = db.prepare(
    'SELECT * FROM children WHERE guardian_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json(children);
}

function getChildById(req, res) {
  const db = getDb();
  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(req.params.id);
  if (!child) return res.status(404).json({ error: 'Child not found' });
  if (child.guardian_id !== req.user.id && req.user.role === 'parent') {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(child);
}

module.exports = { registerChild, getMyChildren, getChildById };