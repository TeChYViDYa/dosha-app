require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ── Route imports ─────────────────────────────────────────────
const quizRoutes           = require('./routes/quiz');
const sessionRoutes        = require('./routes/session');
const userRoutes           = require('./routes/users');
const recommendationRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware FIRST (always before routes) ───────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Routes AFTER middleware ───────────────────────────────────
app.use('/api/quiz',            quizRoutes);
app.use('/api/session',         sessionRoutes);
app.use('/api/users',           userRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handler (always last) ───────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurveda';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB not connected — running in memory-only mode');
  }
  app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
  });
};

startServer();