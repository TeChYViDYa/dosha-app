require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const quizRoutes = require('./routes/quiz');
const sessionRoutes = require('./routes/session');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/quiz', quizRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const startServer = async () => {
  console.log('Starting server...');
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurveda';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Running in memory-only mode');
  }
  app.listen(PORT, () => {
    console.log('Dosha API listening on http://localhost:' + PORT);
  });
};

startServer();