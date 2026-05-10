const mongoose = require('mongoose');

/**
 * QUIZ RESULT MODEL
 *
 * A complete snapshot of one finished quiz session.
 * Stored separately from User so we can:
 *   - Keep User documents small
 *   - Query result history independently
 *   - Add ML training data later (answers + weights + outcome)
 *
 * Each document is immutable after creation — never update a result,
 * always create a new one. This gives us an accurate history.
 */

const DoshaPercentSchema = new mongoose.Schema(
  {
    vata:  { type: Number, required: true, min: 0, max: 100 },
    pitta: { type: Number, required: true, min: 0, max: 100 },
    kapha: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const DoshaRawSchema = new mongoose.Schema(
  {
    vata:  { type: Number, required: true },
    pitta: { type: Number, required: true },
    kapha: { type: Number, required: true },
  },
  { _id: false }
);

// Individual answer stored with full context for future ML use
const AnswerSchema = new mongoose.Schema(
  {
    questionId:          { type: String, required: true },
    selectedOptionIndex: { type: Number, required: true },
    // Store the weights chosen — needed for weight tuning later
    selectedOption: {
      text:  { type: String },
      vata:  { type: Number },
      pitta: { type: Number },
      kapha: { type: Number },
    },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const QuizResultSchema = new mongoose.Schema(
  {
    // Link back to the user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // The in-memory session ID (for debugging / cross-reference)
    sessionId: {
      type: String,
      required: true,
    },

    // ── Prakriti scores ─────────────────────────────────────────
    prakriti: {
      raw:     { type: DoshaRawSchema, required: true },
      percent: { type: DoshaPercentSchema, required: true },
    },

    // ── Vikriti scores ──────────────────────────────────────────
    vikriti: {
      raw:     { type: DoshaRawSchema, required: true },
      percent: { type: DoshaPercentSchema, required: true },
    },

    // ── Derived fields ──────────────────────────────────────────
    dominantDosha: {
      type: String,
      enum: ['vata', 'pitta', 'kapha'],
      required: true,
    },

    delta: {
      vata:  { type: Number },
      pitta: { type: Number },
      kapha: { type: Number },
    },

    elevatedDoshas: [
      {
        dosha:      { type: String, enum: ['vata', 'pitta', 'kapha'] },
        elevatedBy: { type: Number },
        _id: false,
      },
    ],

    confidence: {
      score: { type: Number },
      level: { type: String, enum: ['low', 'medium', 'high'] },
      gap:   { type: Number },
    },

    // ── Quiz metadata ────────────────────────────────────────────
    answeredCount: { type: Number, required: true },
    stopReason: {
      type: String,
      enum: ['high_confidence', 'medium_confidence_sufficient', 'max_questions_reached', 'user_forced'],
      default: 'high_confidence',
    },

    // ── Full answer log (for weight tuning + ML later) ───────────
    answers: {
      type: [AnswerSchema],
      default: [],
    },

    // ── Quiz type ────────────────────────────────────────────────
    // 'full' = first-time prakriti assessment
    // 'checkin' = daily vikriti check (Phase 5)
    quizType: {
      type: String,
      enum: ['full', 'checkin'],
      default: 'full',
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching a user's result history in chronological order
QuizResultSchema.index({ userId: 1, completedAt: -1 });

/**
 * Static method: build a QuizResult document from a completed session.
 * Call this instead of constructing manually.
 *
 * @param {string} userId    - MongoDB ObjectId of the user
 * @param {string} sessionId - in-memory session UUID
 * @param {Object} session   - full session object from sessionStore
 * @param {string} stopReason
 */
QuizResultSchema.statics.fromSession = function (userId, sessionId, session, stopReason) {
  console.log('fromSession called with', { userId, sessionId, stopReason, answered: session.answers?.length });
  const { scores, answers } = session;
  return new this({
    userId,
    sessionId,
    prakriti:      scores.prakriti,
    vikriti:       scores.vikriti,
    dominantDosha: scores.dominantDosha,
    delta:         scores.delta,
    elevatedDoshas: scores.elevatedDoshas,
    confidence:    scores.confidence,
    answeredCount: scores.answeredCount,
    stopReason:    stopReason || 'high_confidence',
    answers:       answers,
    quizType:      'full',
    completedAt:   new Date(),
  });
};

const QuizResult = mongoose.model('QuizResult', QuizResultSchema);
console.log('QuizResult model created, fromSession:', typeof QuizResult.fromSession);

module.exports = QuizResult;