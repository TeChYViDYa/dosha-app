/**
 * SESSION ROUTES
 *
 * POST /api/session/start        → create a new quiz session
 * GET  /api/session/:id          → get session state
 * POST /api/session/:id/answer   → submit an answer, get next question
 * POST /api/session/:id/finish   → force-complete the session
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { createSession, getSession, updateSession } = require('../services/sessionStore');
const { computeScores, shouldStopQuiz } = require('../services/scoringEngine');
const { getNextQuestion, formatQuestionForClient } = require('../services/questionSelector');
const { saveQuizResult } = require('../services/resultSaver');
const questions = require('../data/questions');

// Anonymous ID may come from header, request body, or query string
function getAnonymousId(req) {
  return req.headers['x-anonymous-id'] || req.body?.anonymousId || req.query?.anonymousId || null;
}

// ── POST /api/session/start ───────────────────────────────────
router.post('/start', (req, res) => {
  try {
    const id = uuidv4();
    const session = createSession(id);

    // Get the first question immediately
    const firstQuestion = getNextQuestion([], null, 0);
    if (!firstQuestion) {
      return res.status(500).json({ error: 'No questions available' });
    }

    // Mark it as asked
    updateSession(id, { askedQuestionIds: [firstQuestion.id] });

    res.status(201).json({
      sessionId: id,
      status: 'active',
      progress: { answered: 0, minRequired: 12, maxAllowed: 20 },
      question: formatQuestionForClient(firstQuestion),
    });
  } catch (err) {
    console.error('Start session error:', err);
    res.status(500).json({ error: 'Failed to start session' });
  }
});


// ── GET /api/session/:id ──────────────────────────────────────
router.get('/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({
    sessionId: session.id,
    status: session.status,
    progress: {
      answered: session.answers.length,
      minRequired: 12,
      maxAllowed: 20,
    },
    scores: session.scores,
  });
});


// ── POST /api/session/:id/answer ─────────────────────────────
router.post('/:id/answer', (req, res) => {
  try {
    const session = getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'completed') return res.status(400).json({ error: 'Session already completed' });

    const { questionId, optionIndex, optionIndex2 } = req.body;

    // Validate input
    if (!questionId || optionIndex === undefined) {
      return res.status(400).json({ error: 'questionId and optionIndex are required' });
    }

    // Find the question
    const question = questions.find(q => q.id === questionId);
    if (!question) return res.status(400).json({ error: 'Invalid questionId' });

    const selectedOption = question.options[optionIndex];
    if (!selectedOption) return res.status(400).json({ error: 'Invalid optionIndex' });

    let selectedOption2 = null;
    if (optionIndex2 !== undefined && optionIndex2 !== null) {
      selectedOption2 = question.options[optionIndex2];
      if (!selectedOption2) return res.status(400).json({ error: 'Invalid optionIndex2' });
    }

    // Check for duplicate answer
    const alreadyAnswered = session.answers.some(a => a.questionId === questionId);
    if (alreadyAnswered) return res.status(400).json({ error: 'Question already answered' });

    // Record the answer
    const newAnswer = {
      questionId,
      selectedOptionIndex: optionIndex,
      selectedOptionIndex2: optionIndex2 !== undefined ? optionIndex2 : null,

      selectedOption: {
        vata:  selectedOption.vata,
        pitta: selectedOption.pitta,
        kapha: selectedOption.kapha,
        text:  selectedOption.text,
      },
      selectedOption2: selectedOption2
        ? {
            vata:  selectedOption2.vata,
            pitta: selectedOption2.pitta,
            kapha: selectedOption2.kapha,
            text:  selectedOption2.text,
          }
        : null,
      answeredAt: new Date(),
    };

    const updatedAnswers = [...session.answers, newAnswer];

    // Recompute scores
    const scores = computeScores(updatedAnswers, questions);

    // Check stop condition
    const stopCheck = shouldStopQuiz(scores);

    if (stopCheck.shouldStop) {
      // Complete the session in memory first
      const completedSession = updateSession(req.params.id, {
        answers: updatedAnswers,
        scores,
        status: 'completed',
      });

      // Persist to MongoDB in background (don't block the response)
      const anonymousId = getAnonymousId(req);
      if (anonymousId) {
        console.log('Saving quiz result for session', req.params.id, 'anonymousId', anonymousId);
        saveQuizResult(anonymousId, req.params.id, completedSession, stopCheck.reason)
          .then(() => console.log('Quiz result save queued for session', req.params.id))
          .catch(err => console.error('MongoDB save failed (non-fatal):', err));
      } else {
        console.warn('No anonymousId found for session completion', req.params.id, 'headers:', req.headers, 'body:', req.body, 'query:', req.query);
      }

      return res.json({
        status: 'completed',
        reason: stopCheck.reason,
        scores,
        nextQuestion: null,
      });
    }

    // Get next question
    const updatedAsked = [...session.askedQuestionIds, questionId];
    const nextQuestion = getNextQuestion(updatedAsked, scores, updatedAnswers.length);

    if (nextQuestion) updatedAsked.push(nextQuestion.id);

    updateSession(req.params.id, {
      answers: updatedAnswers,
      scores,
      askedQuestionIds: updatedAsked,
    });

    res.json({
      status: 'active',
      scores,
      progress: {
        answered: updatedAnswers.length,
        minRequired: 12,
        maxAllowed: 20,
        confidence: scores.confidence,
      },
      nextQuestion: nextQuestion ? formatQuestionForClient(nextQuestion) : null,
    });

  } catch (err) {
    console.error('Answer error:', err);
    res.status(500).json({ error: 'Failed to process answer' });
  }
});


// ── POST /api/session/:id/finish ─────────────────────────────
router.post('/:id/finish', (req, res) => {
  try {
    const session = getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const scores = computeScores(session.answers, questions);
    const completedSession = updateSession(req.params.id, { status: 'completed', scores });

    const anonymousId = getAnonymousId(req);
    if (anonymousId) {
      saveQuizResult(anonymousId, req.params.id, completedSession, 'user_forced')
        .catch(err => console.error('MongoDB save failed (non-fatal):', err.message));
    }

    res.json({ status: 'completed', scores });
  } catch (err) {
    res.status(500).json({ error: 'Failed to finish session' });
  }
});

module.exports = router;