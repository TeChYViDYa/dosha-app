const mongoose = require('mongoose');

/**
 * USER MODEL
 *
 * Stores the user's profile and a running history of quiz results.
 * For now: anonymous users identified by a client-generated UUID.
 * Later: swap anonymousId for email + password or OAuth.
 *
 * Design decisions:
 * - prakriti is stored separately from individual quiz results because
 *   it's the stable constitution and should only be set once (or rarely updated).
 * - vikriti is the latest imbalance reading — it changes every check-in.
 * - quizResults holds the full history so we can show progress over time (Phase 5).
 */

const DoshaPercentSchema = new mongoose.Schema(
  {
    vata:  { type: Number, required: true, min: 0, max: 100 },
    pitta: { type: Number, required: true, min: 0, max: 100 },
    kapha: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    // Anonymous identifier from client (UUID stored in localStorage)
    // Replace with email field when adding auth
    anonymousId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ── Constitution (stable, set after first full quiz) ────────
    prakriti: {
      percent: { type: DoshaPercentSchema, default: null },
      dominantDosha: {
        type: String,
        enum: ['vata', 'pitta', 'kapha', null],
        default: null,
      },
      lockedAt: { type: Date, default: null }, // When prakriti was first determined
    },

    // ── Current imbalance (updated every quiz / check-in) ───────
    vikriti: {
      percent:       { type: DoshaPercentSchema, default: null },
      elevatedDoshas: [
        {
          dosha:     { type: String, enum: ['vata', 'pitta', 'kapha'] },
          elevatedBy: { type: Number },
          _id: false,
        },
      ],
      lastUpdatedAt: { type: Date, default: null },
    },

    // ── Quiz history (array of result references) ────────────────
    quizResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizResult',
      },
    ],

    // ── Metadata ─────────────────────────────────────────────────
    totalQuizzesTaken: { type: Number, default: 0 },
    lastActiveAt:      { type: Date, default: Date.now },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

/**
 * Instance method: update vikriti after a new quiz
 * Called from the quiz result save flow, not directly from routes.
 */
UserSchema.methods.updateVikriti = function (vikritiData) {
  this.vikriti.percent        = vikritiData.percent;
  this.vikriti.elevatedDoshas = vikritiData.elevatedDoshas || [];
  this.vikriti.lastUpdatedAt  = new Date();
  this.lastActiveAt           = new Date();
};

/**
 * Instance method: lock prakriti (called after first full quiz)
 * Once locked, prakriti should not be overwritten unless user explicitly requests a reset.
 */
UserSchema.methods.lockPrakriti = function (prakritiData) {
  if (this.prakriti.lockedAt) return; // already locked — do not overwrite
  this.prakriti.percent       = prakritiData.percent;
  this.prakriti.dominantDosha = prakritiData.dominantDosha;
  this.prakriti.lockedAt      = new Date();
};

module.exports = mongoose.model('User', UserSchema);