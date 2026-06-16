import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../hooks/useDashboard';

const DOSHA_META = {
  vata:  { label: 'Vata',  emoji: '🌬️', color: '#5B8FA8' },
  pitta: { label: 'Pitta', emoji: '🔥', color: '#C9503A' },
  kapha: { label: 'Kapha', emoji: '🌱', color: '#3A6B42' },
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DoshaBar({ dosha, value, suffix }) {
  const meta = DOSHA_META[dosha];
  return (
    <div className="d-bar-row">
      <span className="d-bar-label">{meta.emoji} {meta.label}</span>
      <div className="d-bar-track">
        <div className="d-bar-fill" style={{ width: `${value}%`, background: meta.color }} />
      </div>
      <span className="d-bar-val" style={suffix ? { color: '#B85C2A' } : {}}>
        {value}%{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  );
}

function RecItem({ item }) {
  return (
    <div className="rec-item">
      <p>{item.text}</p>
      <small>{item.reason}</small>
    </div>
  );
}

function getDeltaLabel(delta) {
  if (!delta) return null;
  const top = Object.entries(delta)
    .filter(([, v]) => Math.abs(v) > 5)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (!top) return <span style={{ color: 'var(--sage)' }}>Balanced</span>;
  const [dosha, val] = top;
  return (
    <span style={{ color: '#B85C2A' }}>
      {DOSHA_META[dosha]?.emoji} {val > 0 ? `▲ +${val}%` : `▼ ${val}%`}
    </span>
  );
}

export default function DashboardScreen() {
  const navigate  = useNavigate();
  const { status, profile, history, recs, error } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');
  const [recTab,    setRecTab]    = useState('food');

  // ── Loading ───────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <h2>Loading your dashboard…</h2>
          <p>Fetching your profile</p>
        </div>
      </div>
    );
  }

  // ── No data ───────────────────────────────────────────────────
  if (status === 'no_data') {
    return (
      <div className="center-screen">
        <div className="center-panel">
          <p className="section-label" style={{ marginBottom: 12 }}>Dashboard</p>
          <h1>No results yet</h1>
          <p>Take the assessment first to unlock your personal dashboard.</p>
          <button className="btn-primary" style={{ margin: '0 auto', width: 'auto', padding: '14px 32px' }} onClick={() => navigate('/')}>
            Start assessment →
          </button>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="center-screen">
        <div className="center-panel">
          <h1>Something went wrong</h1>
          <div className="error-card"><p>{error ?? 'Could not load your dashboard.'}</p></div>
          <button className="btn-ghost" style={{ width: 'auto', margin: '0 auto' }} onClick={() => navigate('/')}>← Back to home</button>
        </div>
      </div>
    );
  }

  // ── Data ──────────────────────────────────────────────────────
  const dominant     = profile.prakriti?.dominantDosha;
  const meta         = DOSHA_META[dominant] ?? DOSHA_META.vata;
  const prakriti     = profile.prakriti?.percent ?? {};
  const vikriti      = profile.vikriti?.percent  ?? {};
  const elevated     = profile.vikriti?.elevatedDoshas ?? [];
  const latestResult = history[0];

  const NAV_MAIN = ['Overview', 'Recommendations', 'History'];
  const NAV_SOON = ['Daily check-in', 'AI coach', 'Symptom tracker', 'Seasonal plan', 'Community'];

  return (
    <div className="dash-layout">

      {/* ── Sidebar nav ── */}
      <div className="dash-sidebar">
        <div className="dash-sidebar-bg" />
        <div className="dash-sidebar-inner">

          <span className="dash-logo" onClick={() => navigate('/')}>
            <span className="dash-logo-dot" />
            Dosha
          </span>

          <p className="nav-section-lbl">Main</p>
          {NAV_MAIN.map(item => (
            <div
              key={item}
              className={`dash-nav-item ${activeTab === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item}
            </div>
          ))}

          <div className="dash-nav-divider" />

          <p className="nav-section-lbl">Coming soon</p>
          {NAV_SOON.map(item => (
            <div key={item} className="dash-nav-item dimmed">{item}</div>
          ))}

          <div className="dash-nav-divider" />
          <div className="dash-nav-item" style={{ color: 'rgba(138,184,144,0.7)' }} onClick={() => navigate('/')}>
            + New assessment
          </div>

          <div className="dash-nav-upgrade" style={{ marginTop: 'auto' }}>
            <p className="dash-nav-upgrade-title">Pro features</p>
            <p className="dash-nav-upgrade-sub">AI coach, symptom mapping, seasonal protocols — coming soon.</p>
          </div>

        </div>
      </div>

      {/* ── Content ── */}
      <div className="dash-content">

        {/* Topbar */}
        <div className="dash-topbar">
          <div>
            <h2 className="dash-title">{meta.emoji} Your {meta.label} dashboard</h2>
            <p className="dash-meta">
              Last assessed {formatDate(latestResult?.completedAt)} · {profile.totalQuizzesTaken} assessment{profile.totalQuizzesTaken !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-btn" onClick={() => navigate('/')}>+ New assessment</button>
          </div>
        </div>

        <div className="dash-body">

          {/* ══ OVERVIEW ══ */}
          {activeTab === 'overview' && (
            <>
              {/* Stat cards */}
              <div className="dash-stats-grid">
                <div className="dash-stat accent">
                  <p className="dash-stat-label">Dominant dosha</p>
                  <p className="dash-stat-value">{meta.label}</p>
                  <p className="dash-stat-sub">your constitution</p>
                </div>
                <div className="dash-stat">
                  <p className="dash-stat-label">Current {meta.label}</p>
                  <p className="dash-stat-value" style={{ color: elevated.length > 0 ? '#B85C2A' : meta.color }}>
                    {vikriti[dominant] ?? prakriti[dominant] ?? 0}%
                  </p>
                  <p className="dash-stat-sub" style={{ color: elevated.length > 0 ? '#B85C2A' : 'var(--mist)' }}>
                    {elevated.length > 0 ? `▲ +${elevated[0]?.elevatedBy}% from baseline` : 'at baseline'}
                  </p>
                </div>
                <div className="dash-stat">
                  <p className="dash-stat-label">Assessments</p>
                  <p className="dash-stat-value">{profile.totalQuizzesTaken}</p>
                  <p className="dash-stat-sub">total taken</p>
                </div>
                <div className="dash-stat">
                  <p className="dash-stat-label">Last check-in</p>
                  <p className="dash-stat-value" style={{ fontSize: 20 }}>{formatDate(latestResult?.completedAt)}</p>
                  <p className="dash-stat-sub">most recent quiz</p>
                </div>
              </div>

              {/* Prakriti + Vikriti cards */}
              <div className="dash-cards-grid">
                <div className="dash-card">
                  <p className="dash-card-label">Prakriti — permanent constitution</p>
                  {Object.keys(DOSHA_META).map(key => (
                    <DoshaBar key={key} dosha={key} value={prakriti[key] ?? 0} />
                  ))}
                  <p className="dash-card-note">Set on {formatDate(profile.prakriti?.lockedAt)} · permanent</p>
                </div>

                <div className="dash-card">
                  <p className="dash-card-label">Vikriti — current state</p>
                  {Object.keys(DOSHA_META).map(key => {
                    const diff = (vikriti[key] ?? 0) - (prakriti[key] ?? 0);
                    return (
                      <DoshaBar
                        key={key}
                        dosha={key}
                        value={vikriti[key] ?? 0}
                        suffix={Math.abs(diff) > 5 ? (diff > 0 ? `▲` : `▼`) : null}
                      />
                    );
                  })}
                  {elevated.length > 0 && (
                    <p className="dash-card-note" style={{ color: '#B85C2A' }}>
                      ⚠ {elevated.map(e => `${DOSHA_META[e.dosha]?.label} +${e.elevatedBy}%`).join(', ')} above baseline
                    </p>
                  )}
                  {elevated.length === 0 && (
                    <p className="dash-card-note" style={{ color: 'var(--sage)' }}>✓ Currently balanced</p>
                  )}
                </div>
              </div>

              {/* Today's action */}
              {recs?.todayAction && (
                <div className="dash-card" style={{ borderLeft: `3px solid ${meta.color}`, background: 'white' }}>
                  <p className="dash-card-label">🌅 Start today with</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--bark)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{recs.todayAction}"
                  </p>
                </div>
              )}

              {/* Future strip */}
              <div className="future-strip" style={{ margin: '16px -44px -32px', width: 'calc(100% + 88px)' }}>
                {[
                  ['🤖', 'AI daily coach',    'Conversational guidance adapting to your day and current imbalance'],
                  ['📊', 'Symptom tracker',   'Log symptoms and map them to dosha imbalances automatically'],
                  ['🌿', 'Seasonal protocols','Auto-adjusted routines for each season based on your constitution'],
                  ['👥', 'Community',         'Connect with others of the same constitution for shared insights'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="future-item">
                    <span className="future-badge">Soon</span>
                    <div className="future-icon">{icon}</div>
                    <p className="future-title">{title}</p>
                    <p className="future-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ RECOMMENDATIONS ══ */}
          {activeTab === 'recommendations' && (
            <>
              {recs?.urgentFixes?.length > 0 && (
                <div className="urgent-card" style={{ marginBottom: 20 }}>
                  <h3>⚠️ Address these first</h3>
                  {recs.urgentFixes.map((fix, i) => (
                    <div key={i} className="urgent-item">
                      <strong>{fix.label}</strong>
                      {fix.recommendations.map((r, j) => (
                        <div key={j} className="rec-item"><p>{r.text}</p><small>{r.reason}</small></div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {recs?.reasoning?.length > 0 && (
                <div className="reasoning-card" style={{ marginBottom: 20 }}>
                  {recs.reasoning.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}

              {recs?.sections ? (
                <>
                  <div className="tabs" style={{ marginBottom: 20 }}>
                    {['food','routine','exercise','mental','hydration','sleep'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={`tab-btn ${recTab === tab ? 'active' : ''}`}
                        onClick={() => setRecTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="dash-card tab-content">
                    {recTab === 'food' && (
                      <>
                        <p className="dash-card-label">✅ Eat more</p>
                        {recs.sections.food.eat.map((item, i) => <RecItem key={i} item={item} />)}
                        <p className="dash-card-label" style={{ marginTop: 16 }}>❌ Reduce</p>
                        {recs.sections.food.avoid.map((item, i) => <RecItem key={i} item={item} />)}
                        <p className="dash-card-label" style={{ marginTop: 16 }}>🌿 Spices</p>
                        {recs.sections.food.spices.map((item, i) => <RecItem key={i} item={item} />)}
                      </>
                    )}
                    {recTab === 'routine' && (
                      <>
                        <p className="dash-card-label">🌅 Morning</p>
                        {recs.sections.routine.morning.map((item, i) => <RecItem key={i} item={item} />)}
                        <p className="dash-card-label" style={{ marginTop: 16 }}>🌙 Evening</p>
                        {recs.sections.routine.evening.map((item, i) => <RecItem key={i} item={item} />)}
                        <p className="dash-card-label" style={{ marginTop: 16 }}>📋 General</p>
                        {recs.sections.routine.general.map((item, i) => <RecItem key={i} item={item} />)}
                      </>
                    )}
                    {recTab === 'exercise'  && recs.sections.exercise.map((item, i)  => <RecItem key={i} item={item} />)}
                    {recTab === 'mental'    && recs.sections.mental.map((item, i)    => <RecItem key={i} item={item} />)}
                    {recTab === 'hydration' && recs.sections.hydration.map((item, i) => <RecItem key={i} item={item} />)}
                    {recTab === 'sleep'     && recs.sections.sleep.map((item, i)     => <RecItem key={i} item={item} />)}
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--mist)', fontSize: 13 }}>Loading recommendations…</p>
              )}
            </>
          )}

          {/* ══ HISTORY ══ */}
          {activeTab === 'history' && (
            <div className="history-card">
              <div className="history-header">
                <span className="history-header-label">Assessment history</span>
                <span className="history-header-action">Export →</span>
              </div>
              {history.length === 0 ? (
                <p style={{ padding: 24, color: 'var(--mist)', fontSize: 13 }}>No history yet.</p>
              ) : (
                <>
                  <div className="history-table-head">
                    <span>Date</span>
                    <span>Constitution</span>
                    <span>Imbalance</span>
                    <span>Confidence</span>
                  </div>
                  {history.map((result, i) => {
                    const dom = result.dominantDosha;
                    const m   = DOSHA_META[dom] ?? DOSHA_META.vata;
                    return (
                      <div key={result.id ?? i} className="history-row">
                        <span className="h-date">{formatDate(result.completedAt)}</span>
                        <span className="h-dosha">{m.emoji} {m.label} dominant</span>
                        <span className="h-delta">{getDeltaLabel(result.delta)}</span>
                        <span>
                          <span className={`h-conf ${result.confidence?.level === 'high' ? 'high' : 'med'}`}>
                            {result.confidence?.level ?? '—'}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}