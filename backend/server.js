require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes      = require('./routes/auth');
const childrenRoutes  = require('./routes/children');
const screeningRoutes = require('./routes/screenings');
const referralRoutes  = require('./routes/referrals');

const { initDb } = require('./database/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth',       authRoutes);
app.use('/api/children',   childrenRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/referrals',  referralRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ijwi API is running' });
});

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

// Wait for database to be ready before accepting connections
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Ijwi server running on http://localhost:${PORT}`);
  });
}

start();
module.exports = app;