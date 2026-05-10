const express = require('express');
const router = express.Router();
const questions = require('../data/questions');
const { formatQuestionForClient } = require('../services/questionSelector');

router.get('/questions', (req, res) => {
  const { category } = req.query;
  let filtered = category ? questions.filter(q => q.category === category) : questions;
  res.json({ count: filtered.length, questions: filtered.map(formatQuestionForClient) });
});

router.get('/questions/:id', (req, res) => {
  const question = questions.find(q => q.id === req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  res.json(formatQuestionForClient(question));
});

router.get('/categories', (req, res) => {
  const categories = [...new Set(questions.map(q => q.category))];
  res.json({ categories });
});

module.exports = router;
