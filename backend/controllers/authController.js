const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');

async function register(req, res) {
  try {
    const { name, email, password, role, district } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);

    // RETURNING id gives us the new row's id — PostgreSQL equivalent of lastInsertRowid
    const result = await query(
      'INSERT INTO users (name, email, password, role, district) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [name, email, hashed, role, district || null]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'Account created', token, role, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const result = await query(
      'SELECT id, name, email, role, district, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, getProfile };