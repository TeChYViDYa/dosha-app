import React from 'react';

const doshas = [
  { name: 'Vata', emoji: '🌬️', elements: 'Air + Ether', color: '#5B8FA8', desc: 'Movement & creativity' },
  { name: 'Pitta', emoji: '🔥', elements: 'Fire + Water', color: '#C9503A', desc: 'Transformation & drive' },
  { name: 'Kapha', emoji: '🌱', elements: 'Water + Earth', color: '#4A7C59', desc: 'Structure & stability' },
];

export default function IntroScreen({ onStart, loading }) {
  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        {/* Header */}
        <div style={styles.header}>
          <p style={styles.overline}>Ancient wisdom · Modern clarity</p>
          <h1 style={styles.title}>Discover Your<br /><em>Dosha</em></h1>
          <p style={styles.subtitle}>
            A personalized Ayurvedic assessment that reveals your natural constitution
            and your current state of balance — because they are not always the same.
          </p>
        </div>

        {/* Dosha cards */}
        <div style={styles.cards}>
          {doshas.map(d => (
            <div key={d.name} style={{ ...styles.card, borderTop: `3px solid ${d.color}` }}>
              <span style={{ fontSize: 28 }}>{d.emoji}</span>
              <h3 style={{ ...styles.cardName, color: d.color }}>{d.name}</h3>
              <p style={styles.cardElements}>{d.elements}</p>
              <p style={styles.cardDesc}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* What to expect */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>What to expect</h3>
          <ul style={styles.infoList}>
            <li>12–20 adaptive questions (stops when confident)</li>
            <li>Two scores: Prakriti (your nature) + Vikriti (current imbalance)</li>
            <li>Specific, actionable daily recommendations</li>
            <li>Full explanation of why you got your result</li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Starting…' : 'Begin Your Assessment →'}
        </button>

        <p style={styles.disclaimer}>
          Takes 4–8 minutes · Answer based on lifelong patterns, not how you feel today
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(160deg, #FBF7F0 0%, #F0E8D8 100%)',
  },
  inner: {
    maxWidth: 640,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  header: { textAlign: 'center' },
  overline: {
    fontSize: 12,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#9E8C78',
    marginBottom: 12,
  },
  title: {
    fontSize: 'clamp(42px, 8vw, 64px)',
    color: '#2C1F14',
    marginBottom: 16,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B5344',
    lineHeight: 1.7,
    maxWidth: 480,
    margin: '0 auto',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  card: {
    background: 'white',
    borderRadius: 12,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(44,31,20,0.06)',
  },
  cardName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 600,
  },
  cardElements: {
    fontSize: 11,
    color: '#9E8C78',
    letterSpacing: '0.05em',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B5344',
  },
  infoBox: {
    background: 'white',
    borderRadius: 12,
    padding: '20px 24px',
    borderLeft: '3px solid #C17F4A',
    boxShadow: '0 2px 12px rgba(44,31,20,0.06)',
  },
  infoTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    color: '#2C1F14',
    marginBottom: 12,
  },
  infoList: {
    paddingLeft: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  button: {
    background: '#6B4226',
    color: 'white',
    padding: '16px 32px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: '0.02em',
    transition: 'all 0.2s',
    alignSelf: 'center',
    minWidth: 240,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9E8C78',
  },
};