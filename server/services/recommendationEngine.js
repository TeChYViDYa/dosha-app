/**
 * RECOMMENDATION ENGINE
 *
 * Input:  scores object from scoringEngine (prakriti %, vikriti %, delta, elevatedDoshas)
 * Output: a fully personalised recommendation object with:
 *   - todayAction     → one specific micro-action for today
 *   - sections        → food, routine, exercise, mental, hydration, sleep
 *   - doshaBlend      → how multi-dosha scores affect the recommendations
 *   - urgentFixes     → things to address NOW based on elevated vikriti doshas
 *   - reasoning       → plain-English explanation of why this result was generated
 *
 * BLENDING LOGIC:
 *   Dominant dosha (highest %)  → full recommendation set
 *   Secondary dosha (> 25%)     → add its priority-1 items to the mix
 *   Elevated vikriti dosha      → add its urgent fixes regardless of prakriti
 *
 * This avoids the trap of giving pure-Vata advice to someone who is 55% Vata / 35% Pitta.
 */

const recommendations = require('../data/recommendations');

/**
 * Main entry point.
 * @param {Object} scores - from computeScores()
 * @returns {Object} personalised recommendation bundle
 */
function generateRecommendations(scores) {
  const { prakriti, vikriti, dominantDosha, elevatedDoshas, delta } = scores;
  const pct = prakriti.percent;

  // ── Determine dosha blend ─────────────────────────────────────
  const sorted = Object.entries(pct).sort((a, b) => b[1] - a[1]);
  const primary   = sorted[0][0];   // highest %
  const secondary = sorted[1][1] >= 25 ? sorted[1][0] : null; // meaningful if ≥ 25%
  const tertiary  = sorted[2][1] >= 15 ? sorted[2][0] : null; // noticeable if ≥ 15%

  // ── Build each section ────────────────────────────────────────
  const food     = buildFoodSection(primary, secondary, pct);
  const routine  = buildRoutineSection(primary, secondary);
  const exercise = buildExerciseSection(primary, secondary);
  const mental   = buildMentalSection(primary);
  const hydration = buildHydrationSection(primary);
  const sleep    = buildSleepSection(primary);

  // ── Urgent fixes from elevated vikriti doshas ─────────────────
  const urgentFixes = buildUrgentFixes(elevatedDoshas, delta);

  // ── Pick today's action ───────────────────────────────────────
  const todayAction = pickTodayAction(primary, elevatedDoshas);

  // ── Build reasoning text ──────────────────────────────────────
  const reasoning = buildReasoning(pct, primary, secondary, elevatedDoshas, delta);

  return {
    todayAction,
    doshaBlend: {
      primary,
      secondary,
      tertiary,
      percentages: pct,
      note: buildBlendNote(primary, secondary, pct),
    },
    urgentFixes,
    sections: {
      food,
      routine,
      exercise,
      mental,
      hydration,
      sleep,
    },
    reasoning,
    generatedAt: new Date().toISOString(),
  };
}


// ── SECTION BUILDERS ─────────────────────────────────────────────

function buildFoodSection(primary, secondary, pct) {
  const base = recommendations[primary].foods;

  // Start with primary dosha's priority-1 and priority-2 items
  let eat   = filterByPriority(base.eat,   [1, 2]);
  let avoid = filterByPriority(base.avoid, [1, 2]);
  let spices = filterByPriority(base.spices, [1, 2]);

  // If secondary is meaningful, blend in its priority-1 items
  if (secondary && pct[secondary] >= 30) {
    const sec = recommendations[secondary].foods;
    eat    = mergeLists(eat,   filterByPriority(sec.eat,   [1]), 3);
    avoid  = mergeLists(avoid, filterByPriority(sec.avoid, [1]), 2);
    spices = mergeLists(spices, filterByPriority(sec.spices, [1]), 1);
  }

  return { eat, avoid, spices };
}

function buildRoutineSection(primary, secondary) {
  const base = recommendations[primary].routine;
  return {
    morning: filterByPriority(base.morning, [1, 2]),
    evening: filterByPriority(base.evening, [1, 2]),
    general: filterByPriority(base.general, [1, 2]),
  };
}

function buildExerciseSection(primary, secondary) {
  return filterByPriority(recommendations[primary].exercise, [1, 2]);
}

function buildMentalSection(primary) {
  return filterByPriority(recommendations[primary].mental, [1, 2]);
}

function buildHydrationSection(primary) {
  return filterByPriority(recommendations[primary].hydration, [1, 2]);
}

function buildSleepSection(primary) {
  return filterByPriority(recommendations[primary].sleep, [1, 2]);
}


// ── URGENT FIXES ─────────────────────────────────────────────────
// If vikriti shows a dosha is elevated above prakriti baseline,
// pull the top priority-1 fixes for that dosha specifically.

function buildUrgentFixes(elevatedDoshas, delta) {
  if (!elevatedDoshas || elevatedDoshas.length === 0) return [];

  const fixes = [];

  for (const { dosha, elevatedBy } of elevatedDoshas) {
    const rec = recommendations[dosha];
    const severity = elevatedBy >= 20 ? 'high' : elevatedBy >= 10 ? 'medium' : 'low';

    // Pick the most impactful items to address this specific elevation
    const foodFix    = rec.foods.avoid.find(f => f.priority === 1);
    const routineFix = rec.routine.general.find(r => r.priority === 1);
    const todayFix   = rec.todayActions[0];

    fixes.push({
      dosha,
      elevatedBy,
      severity,
      label: getSeverityLabel(severity, dosha),
      recommendations: [
        foodFix    ? { category: 'food',    ...foodFix }    : null,
        routineFix ? { category: 'routine', ...routineFix } : null,
        { category: 'today', text: todayFix, reason: `Your ${dosha} is currently ${elevatedBy}% above your natural baseline — this is the most impactful action to reduce it today.`, priority: 1 },
      ].filter(Boolean),
    });
  }

  return fixes;
}


// ── TODAY'S ACTION ────────────────────────────────────────────────
// Picks from elevated dosha first (urgent), then primary dosha pool.
// Rotates based on day of week so it feels fresh.

function pickTodayAction(primary, elevatedDoshas) {
  const pool = elevatedDoshas?.length > 0
    ? recommendations[elevatedDoshas[0].dosha].todayActions
    : recommendations[primary].todayActions;

  // Rotate by day of week — same user sees different action each day
  const dayIndex = new Date().getDay(); // 0–6
  return pool[dayIndex % pool.length];
}


// ── REASONING ────────────────────────────────────────────────────
// Plain-English explanation of how the result was computed.

function buildReasoning(pct, primary, secondary, elevatedDoshas, delta) {
  const lines = [];

  lines.push(
    `Your natural constitution is ${pct.vata}% Vata, ${pct.pitta}% Pitta, and ${pct.kapha}% Kapha, making ${capitalize(primary)} your dominant dosha.`
  );

  if (secondary) {
    lines.push(
      `With ${pct[secondary]}% ${capitalize(secondary)}, your secondary dosha is significant — recommendations are blended to account for both.`
    );
  }

  if (elevatedDoshas?.length > 0) {
    const names = elevatedDoshas.map(e => `${capitalize(e.dosha)} (+${e.elevatedBy}%)`).join(' and ');
    lines.push(
      `Your current state shows ${names} elevated above your baseline. This means you may be experiencing symptoms associated with that imbalance right now.`
    );
  } else {
    lines.push('Your current state appears close to your natural constitution — you are relatively balanced right now.');
  }

  return lines;
}

function buildBlendNote(primary, secondary, pct) {
  if (!secondary) {
    return `Pure ${capitalize(primary)} constitution — recommendations are focused entirely on this dosha.`;
  }
  return `${capitalize(primary)}–${capitalize(secondary)} blend (${pct[primary]}% / ${pct[secondary]}%) — recommendations are weighted toward ${capitalize(primary)} but account for your significant ${capitalize(secondary)} influence.`;
}


// ── HELPERS ───────────────────────────────────────────────────────

function filterByPriority(items, priorities) {
  return items.filter(item => priorities.includes(item.priority));
}

// Merge two lists up to maxFromSecondary items from the second list
function mergeLists(primary, secondary, maxFromSecondary) {
  return [...primary, ...secondary.slice(0, maxFromSecondary)];
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function getSeverityLabel(severity, dosha) {
  const labels = {
    high:   `⚠️ High ${capitalize(dosha)} Imbalance`,
    medium: `⚡ Elevated ${capitalize(dosha)}`,
    low:    `📍 Mild ${capitalize(dosha)} Elevation`,
  };
  return labels[severity];
}

module.exports = { generateRecommendations };