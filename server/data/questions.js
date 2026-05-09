/**
 * AYURVEDA QUESTION BANK — 32 questions
 * Weight scale: { vata, pitta, kapha } each 0–3
 * prakriti: true → stable constitutional trait
 * vikriti: true  → current-state trait (used in check-ins too)
 * Categories: physical | mental | digestive | behavioral
 */

const questions = [

  {
    id: 'q_body_frame',
    category: 'physical',
    text: 'How would you describe your natural body frame?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Thin, light', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Medium, athletic', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Heavy, broad', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_weight_tendency',
    category: 'physical',
    text: 'How does your body naturally respond to weight gain?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Hard to gain weight', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Weight stays moderate and stable', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Gains weight easily', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_skin',
    category: 'physical',
    text: 'What best describes your skin?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Dry, rough, cold', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Warm, sensitive, reddish', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Oily, smooth, cool', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_hair',
    category: 'physical',
    text: 'What best describes your hair?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Dry, frizzy', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Fine, early greying', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Thick, oily', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_eyes',
    category: 'physical',
    text: 'What best describes your eyes?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Small, dry', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Sharp, intense', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Big, calm', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_appetite',
    category: 'digestive',
    text: 'How is your appetite usually?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Irregular', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Strong, frequent hunger', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow, steady', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_digestion',
    category: 'digestive',
    text: 'How would you describe your digestion?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Variable', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Strong', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_thirst',
    category: 'digestive',
    text: 'How is your thirst generally?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Variable', vata: 3, pitta: 0, kapha: 0 },
      { text: 'High', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Low', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_body_temperature',
    category: 'physical',
    text: 'How does your body temperature usually feel?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Cold', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Hot', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Cool', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_sweating',
    category: 'physical',
    text: 'How much do you sweat?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Minimal', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Excessive', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Moderate', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_energy_pattern',
    category: 'behavioral',
    text: 'How would you describe your energy pattern?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Quick bursts, fatigues fast', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Consistent, intense', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow, long-lasting', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_sleep',
    category: 'behavioral',
    text: 'How is your sleep generally?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Light, disturbed', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Moderate', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Deep, long', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_speech',
    category: 'behavioral',
    text: 'How do you usually speak?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Fast, irregular', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Sharp, precise', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow, steady', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_movement',
    category: 'behavioral',
    text: 'How are your movements generally?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Quick, restless', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Purposeful', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow, stable', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_mind_nature',
    category: 'mental',
    text: 'Which best describes your mind nature?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Creative, imaginative', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Logical, focused', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Calm, steady', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_learning_style',
    category: 'mental',
    text: 'How do you usually learn and remember?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Learns fast, forgets fast', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Learns well, retains', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Learns slow, remembers long', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_emotional_tendency',
    category: 'mental',
    text: 'Which emotional tendency feels most natural to you?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Fear, anxiety', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Anger, irritability', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Attachment, possessiveness', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_decision_making',
    category: 'mental',
    text: 'How do you make decisions?',
    prakriti: true,
    vikriti: false,
    options: [
      { text: 'Indecisive', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Quick, confident', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Slow but stable', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

  {
    id: 'q_stress_response',
    category: 'mental',
    text: 'How do you respond under stress?',
    prakriti: true,
    vikriti: true,
    options: [
      { text: 'Panic, worry', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Frustration', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Withdrawal', vata: 0, pitta: 0, kapha: 3 },
    ],
  },

];

module.exports = questions;