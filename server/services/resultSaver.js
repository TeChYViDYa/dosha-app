/**
 * RESULT SAVER SERVICE
 *
 * Called at session completion. Handles all MongoDB writes atomically:
 *   1. Find or create the user
 *   2. Save the QuizResult document
 *   3. Update User.prakriti (if not locked) and User.vikriti
 *   4. Push result reference into User.quizResults
 *
 * Decoupled from the session route so the route doesn't become a mess.
 * If MongoDB is unavailable, this fails gracefully — the session result
 * is still returned to the client from in-memory store.
 */

const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

console.log('QuizResult model:', typeof QuizResult, QuizResult.fromSession);

/**
 * Persist a completed quiz session to MongoDB.
 *
 * @param {string} anonymousId  - client UUID (from request header or body)
 * @param {string} sessionId    - the in-memory session UUID
 * @param {Object} session      - full session object { answers, scores, status }
 * @param {string} stopReason   - why the quiz ended
 * @returns {Object}            - { user, quizResult } MongoDB documents
 */
async function saveQuizResult(anonymousId, sessionId, session, stopReason) {
  console.log('saveQuizResult called', { anonymousId, sessionId, stopReason, answered: session.answers.length });
  try {
    // ── 1. Find or create user ────────────────────────────────────
    let user = await User.findOne({ anonymousId });
    if (!user) {
      user = await User.create({ anonymousId });
      console.log('Created new user document for anonymousId', anonymousId);
    } else {
      console.log('Found existing user document for anonymousId', anonymousId);
    }

    // Ensure nested defaults exist after user creation
    if (!user.prakriti) {
      user.prakriti = { percent: null, dominantDosha: null, lockedAt: null };
    }
    if (!user.vikriti) {
      user.vikriti = { percent: null, elevatedDoshas: [], lastUpdatedAt: null };
    }

    // ── 2. Save the QuizResult document ──────────────────────────
    const quizResult = QuizResult.fromSession(user._id, sessionId, session, stopReason);
    await quizResult.save();
    console.log('Saved QuizResult document with id', quizResult._id);

    // ── 3. Update User document ───────────────────────────────────
    // Lock prakriti if this is the first time (lockedAt is null)
    if (!user.prakriti.lockedAt) {
      user.lockPrakriti({
        percent:       session.scores.prakriti.percent,
        dominantDosha: session.scores.dominantDosha,
      });
      console.log('Locked prakriti for user', anonymousId);
    }

    // Always update vikriti with the latest reading
    user.updateVikriti({
      percent:        session.scores.vikriti.percent,
      elevatedDoshas: session.scores.elevatedDoshas,
    });
    console.log('Updated vikriti for user', anonymousId);

    // Push result reference and increment counter
    user.quizResults.push(quizResult._id);
    user.totalQuizzesTaken += 1;

    await user.save();
    console.log('Saved updated user document for', anonymousId);

    return { user, quizResult };
  } catch (err) {
    console.error('saveQuizResult failed', err);
    throw err;
  }
}

module.exports = { saveQuizResult };