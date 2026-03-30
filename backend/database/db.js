const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Pool manages multiple connections efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Run the schema once when the server starts
async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Database schema ready');
  } catch (err) {
    console.error('Schema init error:', err.message);
  }
}

// Simple query helper — use this everywhere instead of pool.query directly
async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

module.exports = { query, initDb };