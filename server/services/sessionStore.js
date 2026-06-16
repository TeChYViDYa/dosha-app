/**
 * SESSION STORE
 *
 * In-memory store for development.
 * In production: swap this module for a Redis-backed implementation.
 * The interface stays identical — routes don't change.
 *
 * Session shape:
 * {
 *   id: string (uuid),
 *   createdAt: Date,
 *   updatedAt: Date,
 *   status: 'active' | 'completed',
 *   answers: [{ questionId, selectedOptionIndex, selectedOption: { vata, pitta, kapha }, answeredAt }],
 *   scores: { prakriti, vikriti, delta, dominantDosha, confidence, ... },
 *   askedQuestionIds: string[],
 * }
 */

const store = new Map();

function createSession(id) {
  const session = {
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    answers: [],
    scores: null,
    askedQuestionIds: [],
  };
  store.set(id, session);
  return session;
}

function getSession(id) {
  return store.get(id) || null;
}

function updateSession(id, updates) {
  const session = store.get(id);
  if (!session) return null;
  const updated = { ...session, ...updates, updatedAt: new Date() };
  store.set(id, updated);
  return updated;
}

function deleteSession(id) {
  return store.delete(id);
}

function getAllSessions() {
  return Array.from(store.values());
}

module.exports = { createSession, getSession, updateSession, deleteSession, getAllSessions };