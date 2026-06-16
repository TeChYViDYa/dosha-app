/**
 * USER ROUTES
 *
 * POST /api/users/register          → create anonymous user profile
 * GET  /api/users/:anonymousId      → get user profile + latest scores
 * GET  /api/users/:anonymousId/history → get full quiz result history
 * POST /api/users/:anonymousId/reset-prakriti → unlock prakriti for re-assessment
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// ── POST /api/users/register ─────────────────────────────────
// Frontend calls this on first load if no profile exists yet.
// Idempotent: calling twice with the same anonymousId is safe.
router.post('/register', async (req, res) => {
  try {
    const { anonymousId } = req.body;

    if (!anonymousId) {
      return res.status(400).json({ error: 'anonymousId is required' });
    }

    // findOneAndUpdate with upsert = create if not exists, return if exists
    const user = await User.findOneAndUpdate(
      { anonymousId },
      { $setOnInsert: { anonymousId } }, // only set on creation, never overwrite
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      userId: user._id,
      anonymousId: user.anonymousId,
      prakriti: user.prakriti,
      vikriti: user.vikriti,
      totalQuizzesTaken: user.totalQuizzesTaken,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});


// ── GET /api/users/:anonymousId ──────────────────────────────
router.get('/:anonymousId', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId })
      .select('-quizResults') // don't populate the full array — use /history for that
      .lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      userId: user._id,
      anonymousId: user.anonymousId,
      prakriti: user.prakriti,
      vikriti: user.vikriti,
      totalQuizzesTaken: user.totalQuizzesTaken,
      lastActiveAt: user.lastActiveAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// ── GET /api/users/:anonymousId/history ──────────────────────
// Returns last 20 quiz results, most recent first.
// Used for Phase 5 progress tracking.
router.get('/:anonymousId/history', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const results = await QuizResult.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .limit(20)
      .select('-answers') // exclude raw answers for list view (too heavy)
      .lean();

    res.json({
      totalQuizzesTaken: user.totalQuizzesTaken,
      results: results.map(r => ({
        id: r._id,
        quizType: r.quizType,
        dominantDosha: r.dominantDosha,
        prakritiPercent: r.prakriti.percent,
        vikritiPercent: r.vikriti.percent,
        elevatedDoshas: r.elevatedDoshas,
        confidence: r.confidence,
        answeredCount: r.answeredCount,
        completedAt: r.completedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});


// ── GET /api/users/:anonymousId/history/:resultId ────────────
// Full detail of a single result including all answers.
router.get('/:anonymousId/history/:resultId', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await QuizResult.findOne({
      _id: req.params.resultId,
      userId: user._id,
    }).lean();

    if (!result) return res.status(404).json({ error: 'Result not found' });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});


// ── POST /api/users/:anonymousId/reset-prakriti ──────────────
// Unlocks prakriti so user can retake the full assessment.
// Use sparingly — prakriti is supposed to be stable.
router.post('/:anonymousId/reset-prakriti', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.prakriti = { percent: null, dominantDosha: null, lockedAt: null };
    await user.save();

    res.json({ message: 'Prakriti reset. Next full quiz will re-establish constitution.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset prakriti' });
  }
});

module.exports = router;