const questions = require('../data/questions');

function formatQuestionForClient(question) {
  return {
    id: question.id,
    category: question.category,
    text: question.text,
    options: question.options.map((option) => ({ text: option.text })),
  };
}

function getNextQuestion(askedQuestionIds = [], scores = null, answeredCount = 0) {
  const asked = new Set(askedQuestionIds);
  const remaining = questions.filter((question) => !asked.has(question.id));

  if (remaining.length === 0 || answeredCount >= 20) {
    return null;
  }

  if (!scores) {
    return remaining[0];
  }

  const categoryOrder = ['physical', 'mental', 'digestive', 'behavioral'];
  const preferredCategory = categoryOrder[answeredCount % categoryOrder.length];
  return remaining.find((question) => question.category === preferredCategory) ?? remaining[0];
}

module.exports = { getNextQuestion, formatQuestionForClient };
