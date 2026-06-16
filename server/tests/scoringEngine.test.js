const { computeScores, shouldStopQuiz, normalizeToPercent, computeConfidence } = require('../services/scoringEngine');
const questions = require('../data/questions');

let passed = 0, failed = 0;

function test(name, fn) {
  try { fn(); console.log(`  PASS: ${name}`); passed++; }
  catch (err) { console.log(`  FAIL: ${name} — ${err.message}`); failed++; }
}

function expect(actual) {
  return {
    toBe: (e) => { if (actual !== e) throw new Error(`Expected ${e}, got ${actual}`); },
    toBeGreaterThan: (n) => { if (actual <= n) throw new Error(`Expected ${actual} > ${n}`); },
    toBeLessThan: (n) => { if (actual >= n) throw new Error(`Expected ${actual} < ${n}`); },
  };
}

console.log('\n--- normalizeToPercent ---');
test('sums to 100', () => {
  const r = normalizeToPercent({ vata: 9, pitta: 3, kapha: 0 });
  expect(r.vata + r.pitta + r.kapha).toBe(100);
});
test('equal split when zeros', () => {
  expect(normalizeToPercent({ vata: 0, pitta: 0, kapha: 0 }).vata).toBe(33);
});
test('vata dominates with high raw', () => {
  expect(normalizeToPercent({ vata: 12, pitta: 2, kapha: 1 }).vata).toBeGreaterThan(70);
});

console.log('\n--- computeConfidence ---');
test('high when gap > 20', () => {
  expect(computeConfidence({ vata: 70, pitta: 20, kapha: 10 }).level).toBe('high');
});
test('low when gap < 10', () => {
  expect(computeConfidence({ vata: 36, pitta: 34, kapha: 30 }).level).toBe('low');
});
test('medium for gap 10-20', () => {
  expect(computeConfidence({ vata: 50, pitta: 35, kapha: 15 }).level).toBe('medium');
});

console.log('\n--- computeScores ---');
const vataAnswers = questions.filter(q => q.prakriti).slice(0, 8).map(q => ({
  questionId: q.id, selectedOption: q.options[0]
}));
test('vata answers -> vata dominant', () => {
  expect(computeScores(vataAnswers, questions).dominantDosha).toBe('vata');
});
test('prakriti % sums to 100', () => {
  const s = computeScores(vataAnswers, questions);
  expect(s.prakriti.percent.vata + s.prakriti.percent.pitta + s.prakriti.percent.kapha).toBe(100);
});
test('answeredCount correct', () => {
  expect(computeScores(vataAnswers, questions).answeredCount).toBe(vataAnswers.length);
});

console.log('\n--- shouldStopQuiz ---');
test('no stop before 12 questions', () => {
  expect(shouldStopQuiz({ answeredCount: 8, confidence: { level: 'high' } }).shouldStop).toBe(false);
});
test('stops at 12 with high confidence', () => {
  expect(shouldStopQuiz({ answeredCount: 12, confidence: { level: 'high' } }).shouldStop).toBe(true);
});
test('stops at 20 regardless', () => {
  expect(shouldStopQuiz({ answeredCount: 20, confidence: { level: 'low' } }).shouldStop).toBe(true);
});
test('no stop at 13 with medium', () => {
  expect(shouldStopQuiz({ answeredCount: 13, confidence: { level: 'medium' } }).shouldStop).toBe(false);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
