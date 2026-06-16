import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationApi } from '../api/api';

const DOSHA_META = {
  vata:  { label: 'Vata',  emoji: '🌬️', color: '#5B8FA8' },
  pitta: { label: 'Pitta', emoji: '🔥', color: '#C9503A' },
  kapha: { label: 'Kapha', emoji: '🌱', color: '#3A6B42' },
};

const REC_TABS = ['food', 'routine', 'exercise', 'mental', 'hydration', 'sleep'];

function RecList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="rec-list">
      {items.map((item, i) => (
        <div key={i} className="rec-item">
          <p>{item.text}</p>
          <small>{item.reason}</small>
        </div>
      ))}
    </div>
  );
}

export default function ResultScreen({ scores, sessionId, onRestart }) {
  const navigate = useNavigate();
  const [recs, setRecs]       = useState(null);
  const [activeTab, setActiveTab] = useState('food');
  const [recsError, setRecsError] = useState(false);

  const dominant = scores?.dominantDosha;
  const prakriti = scores?.prakriti?.percent ?? {};
  const vikriti  = scores?.vikriti?.percent  ?? {};
  const meta     = DOSHA_META[dominant] ?? DOSHA_META.vata;

  useEffect(() => {
    if (!sessionId) return;
    recommendationApi.fromSession(sessionId)
      .then(data => setRecs(data.recommendations))
      .catch(() => setRecsError(true));
  }, [sessionId]);

  return (
    <div className="result-layout">

      {/* ── Main content ── */}
      <div className="result-main">

        <p className="result-eyebrow">Your Prakriti — Natural Constitution</p>
        <h1 className="result-h1">
          {meta.emoji} {meta.label}<br /><em>dominant</em>
        </h1>
        <p className="result-pct">
          {prakriti.vata ?? 0}% Vata · {prakriti.pitta ?? 0}% Pitta · {prakriti.kapha ?? 0}% Kapha
        </p>

        {/* Dosha bars */}
        <div className="bars-section">
          {Object.entries(DOSHA_META).map(([key, d]) => (
            <div key={key} className="bar-row">
              <span className="bar-label">{d.emoji} {d.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${prakriti[key] ?? 0}%`, background: d.color }} />
              </div>
              <span className="bar-value" style={{ color: d.color }}>{prakriti[key] ?? 0}%</span>
            </div>
          ))}
        </div>

        {/* Reasoning */}
        {recs?.reasoning?.length > 0 && (
          <div className="reasoning-card">
            {recs.reasoning.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        )}

        {/* Urgent fixes */}
        {recs?.urgentFixes?.length > 0 && (
          <div className="urgent-card">
            <h3>⚠️ Current imbalance detected</h3>
            {recs.urgentFixes.map((fix, i) => (
              <div key={i} className="urgent-item">
                <strong>{fix.label}</strong>
                {fix.recommendations.map((r, j) => (
                  <div key={j} className="rec-item">
                    <p>{r.text}</p>
                    <small>{r.reason}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {recs?.sections ? (
          <>
            <p className="rec-tabs-label">Personalised recommendations</p>
            <div className="tabs">
              {REC_TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'food' && (
                <>
                  <h4>✅ Eat more</h4>
                  <RecList items={recs.sections.food.eat} />
                  <h4>❌ Reduce</h4>
                  <RecList items={recs.sections.food.avoid} />
                  <h4>🌿 Spices</h4>
                  <RecList items={recs.sections.food.spices} />
                </>
              )}
              {activeTab === 'routine' && (
                <>
                  <h4>🌅 Morning</h4>
                  <RecList items={recs.sections.routine.morning} />
                  <h4>🌙 Evening</h4>
                  <RecList items={recs.sections.routine.evening} />
                  <h4>📋 General</h4>
                  <RecList items={recs.sections.routine.general} />
                </>
              )}
              {activeTab === 'exercise'  && <RecList items={recs.sections.exercise} />}
              {activeTab === 'mental'    && <RecList items={recs.sections.mental} />}
              {activeTab === 'hydration' && <RecList items={recs.sections.hydration} />}
              {activeTab === 'sleep'     && <RecList items={recs.sections.sleep} />}
            </div>
          </>
        ) : recsError ? (
          <div className="error-card">
            <p>Could not load recommendations. Your result is saved — try refreshing.</p>
          </div>
        ) : (
          <p style={{ color: 'var(--mist)', fontSize: 13 }}>Loading recommendations…</p>
        )}

      </div>

      {/* ── Sidebar ── */}
      <div className="result-sidebar">
        <div className="result-side-img-wrap">
          <img
            className="result-side-img"
            src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&q=80"
            alt="Ayurvedic herbs"
          />
          <div className="result-side-img-overlay" />
          <div className="result-side-img-text">
            <p>"Balance is not something you find,<br />it is something you create."</p>
          </div>
        </div>

        <div className="result-side-inner">

          {recs?.todayAction && (
            <div className="side-block">
              <p className="side-label">Start today with</p>
              <p className="today-text">{recs.todayAction}</p>
            </div>
          )}

          <div className="side-block">
            <p className="side-label">Current imbalance — Vikriti</p>
            <div className="vikriti-rows">
              {Object.entries(DOSHA_META).map(([key, d]) => {
                const diff = (vikriti[key] ?? 0) - (prakriti[key] ?? 0);
                return (
                  <div key={key} className="vikriti-row">
                    <span className="vikriti-name">{d.emoji} {d.label}</span>
                    <span className={`vikriti-val ${Math.abs(diff) > 5 && diff > 0 ? 'delta-up' : 'delta-ok'}`}>
                      {Math.abs(diff) > 5
                        ? diff > 0 ? `▲ +${diff}% elevated` : `▼ ${diff}%`
                        : 'balanced'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {recs?.doshaBlend && (
            <div className="side-block">
              <p className="side-label">Why this result</p>
              <p className="why-text">{recs.doshaBlend.note}</p>
            </div>
          )}

          <div className="result-actions">
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              View full dashboard →
            </button>
            <button className="btn-ghost" onClick={onRestart}>
              ↺ Retake assessment
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}