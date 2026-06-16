/**
 * RECOMMENDATION KNOWLEDGE BASE
 *
 * Structure per dosha:
 *   foods.eat       → what to eat more of
 *   foods.avoid     → what to reduce/avoid
 *   foods.spices    → best spices
 *   routine.morning → morning habits
 *   routine.evening → evening habits
 *   routine.general → general daily practices
 *   exercise        → best movement types
 *   mental          → emotional / stress practices
 *   hydration       → water guidance
 *   sleep           → sleep recommendations
 *   todayActions    → pool of micro-actions ("do this today")
 *
 * Every item has:
 *   text     → the recommendation
 *   reason   → WHY (this is what makes it feel personal, not generic)
 *   priority → 1 (critical) | 2 (important) | 3 (nice to have)
 *              used to rank when combining multi-dosha results
 */

const recommendations = {

  vata: {
    foods: {
      eat: [
        { text: 'Warm soups, stews, and khichdi', reason: 'Vata is cold and dry by nature — moist, warm foods directly counteract this', priority: 1 },
        { text: 'Ghee and sesame oil with every meal', reason: 'These oils ground Vata and lubricate the joints and digestive tract', priority: 1 },
        { text: 'Sweet potatoes, carrots, and beetroot', reason: 'Root vegetables are grounding — they anchor Vata\'s upward, scattered energy', priority: 1 },
        { text: 'Basmati rice and whole wheat', reason: 'Easy to digest and nourishing — Vata digestion is variable and needs consistency', priority: 2 },
        { text: 'Warm full-fat milk with nutmeg before bed', reason: 'Calms the nervous system and promotes deep sleep — Vata often struggles with insomnia', priority: 2 },
        { text: 'Ripe, sweet fruits like bananas, mangoes, figs', reason: 'Sweet taste pacifies Vata; avoid sour or astringent fruits', priority: 2 },
        { text: 'Soaked almonds and walnuts', reason: 'Healthy fats nourish Vata\'s nervous system; soaking removes the drying skin', priority: 3 },
        { text: 'Cooked oats with ghee and cardamom for breakfast', reason: 'Warm, moist, and grounding — ideal Vata morning meal', priority: 2 },
      ],
      avoid: [
        { text: 'Raw salads and cold foods', reason: 'Raw and cold foods aggravate Vata\'s already cold, dry quality', priority: 1 },
        { text: 'Dry snacks: crackers, popcorn, rice cakes', reason: 'Increase dryness and constipation — Vata\'s most common imbalance', priority: 1 },
        { text: 'Caffeine and carbonated drinks', reason: 'Stimulate and dry out the nervous system, worsening anxiety', priority: 1 },
        { text: 'Beans and lentils (unless well-spiced)', reason: 'Can cause gas and bloating — Vata\'s digestive fire is irregular', priority: 2 },
        { text: 'Bitter and astringent tastes in excess', reason: 'These tastes increase Vata — minimize raw greens, cruciferous vegetables', priority: 2 },
        { text: 'Skipping meals or irregular eating', reason: 'Vata digestion depends on routine; irregular eating crashes Agni', priority: 1 },
      ],
      spices: [
        { text: 'Ginger, cumin, and fennel in all cooking', reason: 'Warm, digestive spices that kindle Vata\'s irregular digestive fire', priority: 1 },
        { text: 'Cardamom in warm drinks and desserts', reason: 'Calming and warming — reduces gas and anxiety simultaneously', priority: 2 },
        { text: 'Cinnamon in morning tea or oats', reason: 'Warming and grounding; stabilises blood sugar which Vata often swings', priority: 2 },
        { text: 'Hing (asafoetida) when cooking beans', reason: 'Directly prevents the gas and bloating that beans cause in Vata types', priority: 2 },
      ],
    },
    routine: {
      morning: [
        { text: 'Wake at the same time every day — ideally 6–7am', reason: 'Vata is most aggravated by irregular schedules; consistency is medicine', priority: 1 },
        { text: 'Warm sesame oil self-massage (Abhyanga) for 5–10 minutes', reason: 'Grounds Vata, lubricates joints, and calms the nervous system before the day starts', priority: 1 },
        { text: 'Drink warm water with ginger first thing', reason: 'Wakes up the digestive fire gently — Vata digestion needs warming, not shocking', priority: 1 },
        { text: 'Nadi Shodhana pranayama for 5 minutes', reason: 'Alternate nostril breathing directly calms Vata\'s nervous system and reduces morning anxiety', priority: 2 },
      ],
      evening: [
        { text: 'Stop screens by 9pm', reason: 'Blue light and stimulation worsen Vata\'s already light, disturbed sleep', priority: 1 },
        { text: 'Warm milk with nutmeg or ashwagandha at 9:30pm', reason: 'Actively calms the nervous system and promotes the deep sleep Vata chronically lacks', priority: 1 },
        { text: 'In bed by 10pm — strict', reason: 'Vata is most vulnerable after 10pm; being awake then worsens anxiety and insomnia', priority: 1 },
        { text: 'Brief journaling to offload the day\'s mental activity', reason: 'Vata minds race at night — externalising thoughts prevents them from looping during sleep', priority: 2 },
      ],
      general: [
        { text: 'Eat three meals at the same time every day', reason: 'Regularity is the single most powerful Vata remedy — the body learns to prepare digestive fire on schedule', priority: 1 },
        { text: 'Avoid multitasking — do one thing at a time', reason: 'Vata\'s creative mind scatters energy across too many things; focus prevents exhaustion', priority: 2 },
        { text: 'Work in calm, quiet environments', reason: 'Noise and chaos aggravate Vata\'s already overstimulated nervous system', priority: 2 },
        { text: 'Oil the soles of your feet before bed', reason: 'Marma points on the feet connect to the nervous system — deeply grounding for Vata', priority: 3 },
      ],
    },
    exercise: [
      { text: 'Gentle yoga: Yin, Hatha, or restorative', reason: 'Slow, grounding movement counteracts Vata\'s restlessness without depleting energy reserves', priority: 1 },
      { text: '20–30 minute walk in nature daily', reason: 'Rhythmic, grounding movement at a sustainable pace — not exhausting sprints', priority: 1 },
      { text: 'Swimming in warm water', reason: 'Warm water is deeply soothing for Vata — the rhythmic movement grounds without drying', priority: 2 },
      { text: 'Avoid intense cardio, HIIT, or overexertion', reason: 'High-intensity exercise depletes Vata\'s already thin energy reserves — it feels good then crashes hard', priority: 1 },
    ],
    mental: [
      { text: 'Grounding meditation: body scan or earth visualisation', reason: 'Brings Vata\'s scattered awareness back into the body — reduces anxiety at the root', priority: 1 },
      { text: 'Reduce decisions before noon — batch them', reason: 'Decision fatigue hits Vata hardest; making fewer, earlier decisions conserves nervous energy', priority: 2 },
      { text: 'Spend time in nature — especially near water', reason: 'Natural environments reduce Vata\'s neurological overstimulation faster than any other intervention', priority: 2 },
      { text: 'Limit news and social media to 20 minutes daily', reason: 'Constant information flow is uniquely damaging to Vata\'s already overstimulated nervous system', priority: 2 },
    ],
    hydration: [
      { text: 'Sip warm or hot water throughout the day', reason: 'Cold water shocks Vata\'s digestive fire; warm water keeps Agni active', priority: 1 },
      { text: 'Herbal teas: ginger, liquorice, chamomile', reason: 'Warming and calming — directly address Vata\'s two main complaints: cold digestion and anxiety', priority: 2 },
      { text: 'Set reminders to drink — Vata forgets', reason: 'Vata thirst is variable and unreliable; dehydration worsens constipation and anxiety', priority: 1 },
    ],
    sleep: [
      { text: 'Strict 10pm bedtime, no exceptions on weekdays', reason: 'Vata sleep is light and easily disrupted — banking it early is the only reliable strategy', priority: 1 },
      { text: 'Keep the bedroom warm and free of drafts', reason: 'Vata is cold — a cold bedroom guarantees disturbed sleep', priority: 1 },
      { text: 'White noise or silence — no TV or podcasts to sleep', reason: 'Auditory stimulation keeps the Vata mind active; the brain keeps processing even when asleep', priority: 2 },
    ],
    todayActions: [
      'Drink a cup of warm ginger water before your first meal today.',
      'Set three alarms for meals today — breakfast, lunch, and dinner — and eat at those times.',
      'Take a 10-minute warm oil self-massage before your shower tonight.',
      'Put your phone in another room by 9:30pm tonight.',
      'Eat a warm, cooked meal for lunch — no salads or sandwiches today.',
      'Write down three things you are grateful for before sleeping tonight.',
      'Take a 15-minute walk outside after lunch — no headphones.',
      'Add a teaspoon of ghee to your dinner tonight.',
    ],
  },

  pitta: {
    foods: {
      eat: [
        { text: 'Coconut water and fresh coconut', reason: 'Naturally cooling — directly counteracts Pitta\'s excess heat and inflammation', priority: 1 },
        { text: 'Fresh cucumber, mint, and coriander', reason: 'Cooling herbs that reduce internal heat and soothe Pitta\'s digestive fire', priority: 1 },
        { text: 'Sweet, ripe fruits: grapes, melons, pomegranate, figs', reason: 'Sweet taste pacifies Pitta; cooling fruits reduce the heat Pitta generates', priority: 1 },
        { text: 'Basmati rice, oats, and wheat', reason: 'Easily digestible grains that cool and stabilise Pitta\'s intense digestive fire', priority: 2 },
        { text: 'Mung dal and split lentils', reason: 'Light, cooling legumes that satisfy Pitta\'s strong appetite without adding heat', priority: 2 },
        { text: 'Ghee — 1 tsp daily', reason: 'Cooling and nourishing despite being a fat — reduces acid reflux and inflammation', priority: 2 },
        { text: 'Leafy greens: spinach, kale, chard (cooked)', reason: 'Bitter taste directly reduces Pitta — one of the best natural remedies', priority: 2 },
        { text: 'Sunflower and pumpkin seeds', reason: 'Cooling, light proteins that don\'t generate the heat that meat or eggs do', priority: 3 },
      ],
      avoid: [
        { text: 'Spicy food: chilli, jalapeño, hot sauce', reason: 'Directly fans Pitta\'s fire — causes acidity, inflammation, and irritability', priority: 1 },
        { text: 'Fried and oily food', reason: 'Generates heat in the liver and blood — Pitta\'s most reactive organ systems', priority: 1 },
        { text: 'Alcohol and fermented foods', reason: 'Heating and acidic — rapidly aggravate Pitta and damage the liver over time', priority: 1 },
        { text: 'Red meat and eggs', reason: 'Heat-generating proteins that Pitta doesn\'t need more of', priority: 2 },
        { text: 'Sour foods: vinegar, citrus, yoghurt (excess)', reason: 'Sour taste increases Pitta — causes acidity and skin issues', priority: 2 },
        { text: 'Skipping meals or eating late', reason: 'Pitta\'s strong digestive fire turns on itself when empty — causes acidity and anger', priority: 1 },
        { text: 'Coffee on an empty stomach', reason: 'Directly irritates the Pitta stomach lining — acidity begins here', priority: 1 },
      ],
      spices: [
        { text: 'Coriander, fennel, and mint in all cooking', reason: 'Cooling spices that reduce heat without suppressing digestive fire', priority: 1 },
        { text: 'Turmeric — small amounts in cooking', reason: 'Anti-inflammatory without being heating — ideal for Pitta\'s inflammation tendency', priority: 2 },
        { text: 'Cardamom in coffee or desserts', reason: 'Reduces the heating effect of coffee and sweet foods on Pitta', priority: 2 },
        { text: 'Avoid excess black pepper, mustard, and ginger', reason: 'These are warming spices — fine for Vata and Kapha, too heating for Pitta', priority: 2 },
      ],
    },
    routine: {
      morning: [
        { text: 'Wake by 6am — before Pitta time (10am–2pm)', reason: 'Pitta\'s peak intensity is midday; starting early gives calm, focused time before the heat builds', priority: 1 },
        { text: 'Cool water splash on face and eyes upon waking', reason: 'Immediately cools Pitta\'s morning heat and sharpens focus without stimulants', priority: 1 },
        { text: 'Drink room-temperature or cool water first thing', reason: 'Pitta wakes with heat — cold water would shock, cool water cools gently', priority: 1 },
        { text: 'Sheetali pranayama for 5 minutes', reason: 'Cooling breath directly reduces Pitta\'s heat — measurably lowers body temperature', priority: 2 },
      ],
      evening: [
        { text: 'Stop work by 6pm — decompress before dinner', reason: 'Pitta\'s driven nature pushes past limits; a hard stop prevents the evening irritability that follows overwork', priority: 1 },
        { text: 'A 15-minute cool-down walk after dinner', reason: 'Aids Pitta\'s digestion and dissipates the mental intensity that builds during the day', priority: 2 },
        { text: 'Avoid heated discussions or stressful content after 7pm', reason: 'Pitta\'s reactive emotional state peaks in the evening — conflict then disrupts sleep', priority: 1 },
        { text: 'Apply coconut oil to hair and scalp before bed', reason: 'Cooling for the head — Pitta\'s heat rises upward and causes premature greying and hair loss', priority: 3 },
      ],
      general: [
        { text: 'Never skip meals — especially lunch', reason: 'Pitta\'s fire needs fuel; an empty stomach becomes acidic within 2 hours', priority: 1 },
        { text: 'Take a proper lunch break away from your desk', reason: 'Eating while working spikes Pitta stress hormones — digestion suffers directly', priority: 2 },
        { text: 'Build deliberate rest into your schedule', reason: 'Pitta is the dosha most likely to burn out — it confuses exhaustion with laziness', priority: 1 },
        { text: 'Spend time near water — rivers, lakes, ocean', reason: 'Water environments measurably reduce Pitta\'s intensity and restore emotional balance', priority: 2 },
      ],
    },
    exercise: [
      { text: 'Swimming — best exercise for Pitta', reason: 'Water is cooling, rhythmic, and competitive enough for Pitta without overheating', priority: 1 },
      { text: 'Cycling or hiking in the morning or evening', reason: 'Avoid midday exercise when Pitta and the sun are both at peak intensity', priority: 1 },
      { text: 'Moderate yoga: moon salutations, forward folds', reason: 'Cooling postures reduce Pitta\'s heat; avoid hot yoga entirely', priority: 2 },
      { text: 'Avoid competitive sports when already stressed', reason: 'Pitta\'s drive to win becomes harmful when stress is high — it converts play into aggression', priority: 2 },
    ],
    mental: [
      { text: 'Cooling meditation: full moon visualisation or water imagery', reason: 'Visual cooling practices reduce Pitta\'s mental heat more effectively than breath-focused techniques', priority: 1 },
      { text: 'Practice pausing before reacting — especially in conflict', reason: 'Pitta\'s anger response is fast and usually disproportionate; the pause is the intervention', priority: 1 },
      { text: 'Delegate tasks you are perfectionist about', reason: 'Pitta\'s perfectionism is the leading cause of its burnout — delegation is a health practice', priority: 2 },
      { text: 'Read fiction or watch something light in the evening', reason: 'Gives Pitta\'s analytical mind permission to stop solving — prevents the insomnia that follows a work-racing mind', priority: 2 },
    ],
    hydration: [
      { text: 'Drink cool (not ice cold) water throughout the day', reason: 'Pitta runs hot and dehydrates faster — regular cool water is the simplest Pitta remedy', priority: 1 },
      { text: 'Coconut water mid-afternoon', reason: 'Pitta\'s most intense energy crash is at 3–4pm; coconut water cools and rehydrates simultaneously', priority: 2 },
      { text: 'Herbal teas: rose, hibiscus, mint, liquorice', reason: 'Cooling and anti-inflammatory — directly address Pitta\'s heat-based conditions', priority: 2 },
      { text: 'Avoid hot drinks in summer or during stress', reason: 'Adding heat to an already hot system tips Pitta into irritability and acidity', priority: 2 },
    ],
    sleep: [
      { text: 'Keep the bedroom cool and well-ventilated', reason: 'Pitta overheats at night — a cool room is non-negotiable for quality sleep', priority: 1 },
      { text: 'Don\'t take work problems to bed — journal them out', reason: 'Pitta\'s problem-solving mind stays on unless given explicit permission to stop', priority: 1 },
      { text: 'Avoid vigorous exercise within 3 hours of sleep', reason: 'Raises Pitta\'s core temperature — takes 3 hours to drop enough for quality sleep', priority: 2 },
    ],
    todayActions: [
      'Drink a glass of coconut water this afternoon instead of tea or coffee.',
      'Eat lunch away from your desk and phone today — just eat.',
      'Set a hard stop time for work today and honour it.',
      'Add fresh coriander or mint to one meal today.',
      'Take a 10-minute walk near greenery or water after dinner tonight.',
      'Before responding to the next frustrating message, wait 5 minutes.',
      'Put something light and non-work-related on in the evening — a film, music, fiction.',
      'Splash cool water on your face twice today when you feel tension building.',
    ],
  },

  kapha: {
    foods: {
      eat: [
        { text: 'Light, spiced lentils and legumes', reason: 'Light proteins that stimulate Kapha\'s slow digestive fire without adding heaviness', priority: 1 },
        { text: 'Leafy greens and bitter vegetables daily', reason: 'Bitter taste directly reduces Kapha — the most underused taste in modern diets', priority: 1 },
        { text: 'Millet, buckwheat, and barley', reason: 'Light, dry grains that counteract Kapha\'s heavy, damp quality', priority: 1 },
        { text: 'Pomegranate, cranberries, and tart fruits', reason: 'Astringent and pungent fruits are balancing for Kapha; avoid sweet heavy fruits', priority: 2 },
        { text: 'Ginger tea before every meal', reason: 'Kindles Kapha\'s chronically slow digestive fire — like pressing ignition before starting the engine', priority: 1 },
        { text: 'Honey — 1 tsp daily (never heated)', reason: 'The one sweet that is Kapha-balancing — it\'s scraping and lightening, unlike sugar', priority: 2 },
        { text: 'Warm, light soups with plenty of black pepper', reason: 'Warm and stimulating — the heat and spice counteract Kapha\'s cold, sluggish digestion', priority: 2 },
      ],
      avoid: [
        { text: 'Heavy dairy: full-fat milk, cream, cheese, yoghurt', reason: 'The most Kapha-aggravating foods — cold, heavy, and damp by nature', priority: 1 },
        { text: 'Sweets, sugar, and sweet desserts', reason: 'Sweet taste is the primary driver of Kapha weight gain and lethargy', priority: 1 },
        { text: 'Deep-fried food', reason: 'Adds the oiliness and heaviness Kapha already has too much of', priority: 1 },
        { text: 'Wheat and refined carbohydrates', reason: 'Heavy and mucus-forming — contribute to the congestion and weight gain Kapha is prone to', priority: 1 },
        { text: 'Cold, raw foods and cold drinks', reason: 'Suppress Kapha\'s already slow digestive fire completely', priority: 2 },
        { text: 'Eating after 7pm or snacking between meals', reason: 'Kapha digestion is slow — food eaten late doesn\'t digest before sleep and becomes ama (toxins)', priority: 1 },
        { text: 'Excess salt', reason: 'Causes water retention — Kapha already tends to hold water weight', priority: 2 },
      ],
      spices: [
        { text: 'Black pepper, ginger, and chilli in all cooking', reason: 'Pungent and heating — the most powerful spices for stimulating Kapha\'s slow metabolism', priority: 1 },
        { text: 'Turmeric and mustard seeds daily', reason: 'Anti-inflammatory and metabolism-boosting — address Kapha\'s congestion at the tissue level', priority: 1 },
        { text: 'Cinnamon and cloves in morning tea', reason: 'Warm and stimulating — replace the heavy milk tea Kapha is drawn to', priority: 2 },
        { text: 'Fenugreek seeds — soak overnight and eat in the morning', reason: 'Potent Kapha scraper — reduces mucus, balances blood sugar, stimulates digestion', priority: 2 },
      ],
    },
    routine: {
      morning: [
        { text: 'Wake before 6am — before Kapha time begins', reason: 'Kapha time is 6–10am; waking inside it causes the heavy lethargy that lasts all day', priority: 1 },
        { text: 'Dry massage (Udvartana) with chickpea flour or dry brush', reason: 'Stimulates lymphatic drainage and circulation — directly counteracts Kapha\'s sluggish fluid movement', priority: 1 },
        { text: 'Drink hot water with ginger and lemon first thing', reason: 'Kickstarts Kapha\'s digestion and metabolism before food — the body\'s ignition switch', priority: 1 },
        { text: 'Kapalbhati pranayama for 5–10 minutes', reason: 'Forceful exhales clear mucus, stimulate the lungs, and energise — directly targets Kapha\'s congestion', priority: 1 },
      ],
      evening: [
        { text: 'Finish dinner before 6:30pm', reason: 'Kapha digestion is slow — late eating means undigested food sits overnight', priority: 1 },
        { text: 'A brisk 20-minute walk after dinner', reason: 'Stimulates Kapha\'s digestion and prevents the post-dinner heaviness Kapha is prone to', priority: 1 },
        { text: 'Do not nap in the evening', reason: 'Evening naps dramatically increase Kapha — they feel restorative but cause night-time insomnia and next-day lethargy', priority: 1 },
        { text: 'Engage in something mentally stimulating in the evening', reason: 'Kapha\'s inertia grows with passive activities — active engagement prevents the slide into emotional withdrawal', priority: 2 },
      ],
      general: [
        { text: 'Vary your routine deliberately — try one new thing per week', reason: 'Kapha\'s rigidity becomes stagnation; novelty is medicine for this dosha', priority: 2 },
        { text: 'Work in a warm, active environment', reason: 'Kapha performs best when the environment matches the stimulation the dosha needs', priority: 2 },
        { text: 'Avoid sleeping more than 7 hours', reason: 'Excess sleep is uniquely harmful to Kapha — it increases heaviness, mucus, and depression', priority: 1 },
        { text: 'Take the stairs, park further away, add movement to daily tasks', reason: 'Kapha accumulates through stillness — micro-movements throughout the day are cumulative medicine', priority: 2 },
      ],
    },
    exercise: [
      { text: 'Daily vigorous exercise — running, gym, circuit training', reason: 'Kapha requires intensity to shift — gentle exercise is insufficient for this dosha\'s metabolic needs', priority: 1 },
      { text: 'Exercise in the morning, before 10am', reason: 'This is Kapha time — exercising during it is the most effective way to transform its heaviness into energy', priority: 1 },
      { text: 'Hot yoga or Bikram', reason: 'Heat is balancing for Kapha — sweating is actively therapeutic', priority: 2 },
      { text: 'Never skip exercise when you "don\'t feel like it"', reason: 'That feeling IS Kapha — the resistance to movement is the imbalance itself. Motion is the cure.', priority: 1 },
    ],
    mental: [
      { text: 'Energising meditation: sunrise visualisation, or chanting', reason: 'Kapha needs upward, activating energy — calming meditations can deepen its inertia', priority: 1 },
      { text: 'Connect with friends — fight the urge to withdraw', reason: 'Kapha\'s depression manifests as isolation; social connection is literal medicine', priority: 1 },
      { text: 'Set ambitious, short-term goals to create momentum', reason: 'Kapha is motivated by tangible progress — abstract long-term goals don\'t move this dosha', priority: 2 },
      { text: 'Practice letting go — of possessions, habits, relationships that no longer serve', reason: 'Attachment is Kapha\'s core emotional pattern; regular release prevents emotional congestion', priority: 2 },
    ],
    hydration: [
      { text: 'Drink warm or hot water only — no cold drinks', reason: 'Cold water suppresses Kapha\'s already weak digestive fire completely', priority: 1 },
      { text: 'Ginger and tulsi tea throughout the day', reason: 'Stimulating and decongestant — keep Kapha\'s respiratory and digestive systems clear', priority: 1 },
      { text: 'Drink less overall than you think you need', reason: 'Kapha tends to over-hydrate — excess water increases the heaviness and mucus Kapha already has', priority: 2 },
      { text: 'Avoid milk tea and coffee with milk', reason: 'Dairy is the most Kapha-aggravating food — even small amounts in drinks add up', priority: 2 },
    ],
    sleep: [
      { text: 'Set a hard wake time — 5:30–6am and do not snooze', reason: 'Every snooze deepens Kapha heaviness — the first alarm is the medicine', priority: 1 },
      { text: 'Never sleep more than 7 hours', reason: 'Excess sleep is uniquely toxic to Kapha — it increases every Kapha symptom', priority: 1 },
      { text: 'Do not nap during the day', reason: 'Daytime sleep is the fastest way to aggravate Kapha — substituting a walk is far more effective', priority: 1 },
    ],
    todayActions: [
      'Go for a brisk 20-minute walk before 8am today — before Kapha time takes hold.',
      'Drink ginger tea before each meal today instead of water.',
      'Skip dessert completely today — notice how you feel tonight.',
      'Eat your last meal before 6:30pm today.',
      'Call or message a friend today — don\'t wait for them to reach out.',
      'Do 5 minutes of Kapalbhati breathing when you feel the afternoon slump coming.',
      'Take the stairs for every floor change today.',
      'Set one ambitious but achievable goal for this week and write it down.',
    ],
  },
};

module.exports = recommendations;