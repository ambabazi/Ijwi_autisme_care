const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');

function register(req, res) {
  const db = getDb();
  const { name, email, password, role, district } = req.body;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, role, district) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hashed, role, district || null);

  const token = jwt.sign(
    { id: result.lastInsertRowid, role, name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({ message: 'Account created', token, role, name });
}

function login(req, res) {
  const db = getDb();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ message: 'Login successful', token, role: user.role, name: user.name });
}

function getProfile(req, res) {
  const db = getDb();
  const user = db.prepare(
    'SELECT id, name, email, role, district, created_at FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json(user);
}

module.exports = { register, login, getProfile };