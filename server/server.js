const express = require('express');
const cors = require('cors');

const sessionRoutes = require('./routes/session');
const quizRoutes = require('./routes/quiz');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/session', sessionRoutes);
app.use('/api/quiz', quizRoutes);

app.listen(port, () => {
  console.log(`Dosha API listening on http://localhost:${port}`);
});
