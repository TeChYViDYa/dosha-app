/**
 * RECOMMENDATIONS ROUTES
 *
 * GET /api/recommendations/session/:sessionId
 *   → Generate recommendations from a live completed session (in-memory)
 *   → Used immediately after quiz completion on the result screen
 *
 * GET /api/recommendations/user/:anonymousId
 *   → Generate recommendations from user's stored profile in MongoDB
 *   → Used for returning users / dashboard
 */

const express = require('express');
const router = express.Router();

const { getSession } = require('../services/sessionStore');
const { generateRecommendations } = require('../services/recommendationEngine');
const User = require('../models/User');


// ── GET /api/recommendations/session/:sessionId ───────────────
router.get('/session/:sessionId', (req, res) => {
  try {
    const session = getSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Session is not yet completed' });
    }

    if (!session.scores) {
      return res.status(400).json({ error: 'No scores found for this session' });
    }

    const recommendations = generateRecommendations(session.scores);

    res.json({
      sessionId: req.params.sessionId,
      dominantDosha: session.scores.dominantDosha,
      scores: {
        prakriti: session.scores.prakriti.percent,
        vikriti:  session.scores.vikriti.percent,
        delta:    session.scores.delta,
      },
      recommendations,
    });

  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});


// ── GET /api/recommendations/user/:anonymousId ────────────────
router.get('/user/:anonymousId', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId }).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.prakriti?.percent) {
      return res.status(400).json({ error: 'User has not completed a quiz yet' });
    }

    // Reconstruct a scores-like object from stored user profile
    const scores = {
      prakriti:      { percent: user.prakriti.percent },
      vikriti:       { percent: user.vikriti?.percent || user.prakriti.percent },
      dominantDosha: user.prakriti.dominantDosha,
      delta: computeDelta(
        user.prakriti.percent,
        user.vikriti?.percent || user.prakriti.percent
      ),
      elevatedDoshas: user.vikriti?.elevatedDoshas || [],
    };

    const recommendations = generateRecommendations(scores);

    res.json({
      anonymousId: req.params.anonymousId,
      dominantDosha: user.prakriti.dominantDosha,
      scores: {
        prakriti: user.prakriti.percent,
        vikriti:  user.vikriti?.percent || user.prakriti.percent,
        delta:    scores.delta,
      },
      totalQuizzesTaken: user.totalQuizzesTaken,
      recommendations,
    });

  } catch (err) {
    console.error('User recommendations error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});


// Helper: recompute delta from stored percentages
function computeDelta(prakritiPct, vikritiPct) {
  return {
    vata:  (vikritiPct?.vata  || 0) - (prakritiPct?.vata  || 0),
    pitta: (vikritiPct?.pitta || 0) - (prakritiPct?.pitta || 0),
    kapha: (vikritiPct?.kapha || 0) - (prakritiPct?.kapha || 0),
  };
}

module.exports = router;