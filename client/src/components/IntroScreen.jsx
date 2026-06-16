import { useNavigate } from 'react-router-dom';

const DOSHAS = [
  { name: 'Vata',  emoji: '🌬️', color: '#5B8FA8', elements: 'Air + Ether',   desc: 'Movement, creativity, adaptability' },
  { name: 'Pitta', emoji: '🔥', color: '#C9503A', elements: 'Fire + Water',  desc: 'Transformation, intelligence, drive' },
  { name: 'Kapha', emoji: '🌱', color: '#3A6B42', elements: 'Water + Earth', desc: 'Structure, stability, endurance' },
];

const MARQUEE = [
  ['Adaptive quiz','g'], ['·','dot'], ['Prakriti assessment',''], ['·','dot'],
  ['Vikriti tracking','g'], ['·','dot'], ['Personalised food plan',''], ['·','dot'],
  ['Daily routine','gl'], ['·','dot'], ['Sleep guidance',''], ['·','dot'],
  ['Imbalance alerts','g'], ['·','dot'], ['Progress dashboard',''], ['·','dot'],
];

export default function IntroScreen({ onStart, loading }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <div className="intro-hero">

        {/* Left — dark image panel */}
        <div className="intro-left">
          <div className="intro-left-img" />
          <div className="intro-left-overlay" />
          <div className="intro-left-content">
            <p className="intro-eyebrow">Ancient science · Modern precision</p>
            <h1 className="intro-h1">
              Know your<br />
              <em>constitution.</em><br />
              Balance your<br />
              <em>life.</em>
            </h1>
            <p className="intro-desc">
              An adaptive Ayurvedic assessment that reveals your natural dosha
              and current imbalances — with personalised daily actions grounded in tradition.
            </p>
            <div className="intro-cta">
              <button className="btn-primary" onClick={onStart} disabled={loading}
                style={{ width: 'auto', justifyContent: 'flex-start' }}>
                {loading ? 'Starting…' : 'Begin your assessment →'}
              </button>
              <button className="btn-ghost-light" onClick={() => navigate('/dashboard')}>
                View my dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Right — sand info panel */}
        <div className="intro-right">
          <div className="intro-right-top">
            <p className="intro-right-label">The three doshas</p>
            <h2 className="intro-right-h2">
              Your unique blend of <em>Vata, Pitta</em> and <em>Kapha</em>
            </h2>
            <p className="intro-right-sub">
              Ayurveda holds that every person is a unique combination of three
              fundamental energies. Understanding yours is the foundation of lasting wellbeing.
            </p>
          </div>
          <div className="doshas-grid">
            {DOSHAS.map(d => (
              <div key={d.name} className="dosha-cell">
                <div className="dosha-cell-accent" style={{ background: d.color }} />
                <div className="dosha-emoji-lg">{d.emoji}</div>
                <p className="dosha-cell-name">{d.name}</p>
                <p className="dosha-cell-ele">{d.elements}</p>
                <p className="dosha-cell-desc">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[...MARQUEE, ...MARQUEE].map(([text, cls], i) => (
            cls === 'dot'
              ? <span key={i} className="marquee-dot">·</span>
              : <span key={i} className={`marquee-item${cls ? ` ${cls}` : ''}`}>{text}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="how-section">
        <div className="how-left">
          <p className="section-label">How it works</p>
          <h2 className="section-h2">A system that learns<br /><em>you</em> over time</h2>
          <p className="section-body">
            Unlike a one-time quiz, this assessment evolves. Your Prakriti is established
            once. Your Vikriti is tracked across check-ins, giving you a living picture of your balance.
          </p>
          <div className="steps-list">
            {[
              ['01', 'Answer adaptively', '12–20 questions that adjust based on your answers. Stops when confident.'],
              ['02', 'Get your dosha profile', 'Exact percentages for Vata, Pitta, Kapha — not a generic type.'],
              ['03', 'Receive daily guidance', 'Food, routine, sleep, mental — specific actions with reasons.'],
              ['04', 'Track your balance', 'Regular check-ins reveal how your Vikriti shifts over time.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="step-item">
                <span className="step-num">{num}</span>
                <div>
                  <p className="step-title">{title}</p>
                  <p className="step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="how-right">
          <div className="how-img-wrap">
            <img
              className="how-img"
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
              alt="Ayurvedic herbs and spices"
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,rgba(15,31,15,0.5) 100%)' }} />
            <div className="how-img-caption">Ayurvedic tradition</div>
          </div>

          <p className="section-label">Coming soon</p>
          <div className="steps-list">
            {[
              ['AI daily coach',     'Conversational guidance adapting to your day in real time.'],
              ['Symptom mapping',    'Connect physical symptoms to dosha imbalances automatically.'],
              ['Seasonal protocols', 'Auto-adjusted routines for each season and climate.'],
            ].map(([title, desc]) => (
              <div key={title} className="step-item">
                <span className="step-num" style={{ fontSize: 22, color: 'var(--sage-lt)' }}>→</span>
                <div>
                  <p className="step-title" style={{ color: 'var(--mist)' }}>{title}</p>
                  <p className="step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}