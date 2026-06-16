/**
 * SCORING ENGINE
 * Computes prakriti + vikriti % scores, confidence, delta, and stop condition.
 */

function computeRawScores(answers, scoreType, allQuestions) {
  const raw = { vata: 0, pitta: 0, kapha: 0 };
  for (const answer of answers) {
    const question = allQuestions.find(q => q.id === answer.questionId);
    if (!question || !question[scoreType]) continue;
    
    const option = answer.selectedOption || { vata: 0, pitta: 0, kapha: 0 };
    const option2 = answer.selectedOption2 || { vata: 0, pitta: 0, kapha: 0 };
    raw.vata  += (option.vata || 0) + ((option2.vata || 0) / 2);
    raw.pitta += (option.pitta || 0) + ((option2.pitta || 0) / 2);
    raw.kapha += (option.kapha || 0) + ((option2.kapha || 0) / 2);

  }
  return raw;
}

function normalizeToPercent(raw) {
  const total = raw.vata + raw.pitta + raw.kapha;
  if (total === 0) return { vata: 33, pitta: 33, kapha: 34 };
  return {
    vata:  Math.round((raw.vata  / total) * 100),
    pitta: Math.round((raw.pitta / total) * 100),
    kapha: Math.round((raw.kapha / total) * 100),
  };
}

function computeConfidence(normalized) {
  const values = [normalized.vata, normalized.pitta, normalized.kapha].sort((a, b) => b - a);
  const gap = values[0] - values[1];
  let score, level;
  if (gap < 10)      { score = (gap / 10) * 0.3;                          level = 'low'; }
  else if (gap < 20) { score = 0.3 + ((gap - 10) / 10) * 0.4;            level = 'medium'; }
  else               { score = 0.7 + Math.min((gap - 20) / 30, 1) * 0.3; level = 'high'; }
  return { score: parseFloat(score.toFixed(2)), level, gap };
}

function getDominantDosha(normalized) {
  return Object.entries(normalized).sort((a, b) => b[1] - a[1])[0][0];
}

function computeDelta(prakritiNorm, vikritiNorm) {
  return {
    vata:  vikritiNorm.vata  - prakritiNorm.vata,
    pitta: vikritiNorm.pitta - prakritiNorm.pitta,
    kapha: vikritiNorm.kapha - prakritiNorm.kapha,
  };
}

function computeScores(answers, allQuestions) {
  const prakritiRaw  = computeRawScores(answers, 'prakriti', allQuestions);
  const vikritiRaw   = computeRawScores(answers, 'vikriti',  allQuestions);
  const prakritiNorm = normalizeToPercent(prakritiRaw);
  const vikritiNorm  = normalizeToPercent(vikritiRaw);
  const confidence   = computeConfidence(prakritiNorm);
  const dominantDosha = getDominantDosha(prakritiNorm);
  const delta        = computeDelta(prakritiNorm, vikritiNorm);
  const elevatedDoshas = Object.entries(delta)
    .filter(([, diff]) => diff > 5)
    .map(([dosha, diff]) => ({ dosha, elevatedBy: diff }));
  return {
    prakriti: { raw: prakritiRaw, percent: prakritiNorm },
    vikriti:  { raw: vikritiRaw,  percent: vikritiNorm  },
    delta,
    elevatedDoshas,
    dominantDosha,
    confidence,
    answeredCount: answers.length,
  };
}

function shouldStopQuiz(scores) {
  const { answeredCount, confidence } = scores;
  if (answeredCount >= 20)                                    return { shouldStop: true,  reason: 'max_questions_reached' };
  if (answeredCount >= 12 && confidence.level === 'high')    return { shouldStop: true,  reason: 'high_confidence' };
  if (answeredCount >= 15 && confidence.level === 'medium')  return { shouldStop: true,  reason: 'medium_confidence_sufficient' };
  return { shouldStop: false, reason: null };
}

module.exports = { computeScores, shouldStopQuiz, computeConfidence, normalizeToPercent, getDominantDosha };