import { useState } from 'react';

const CATEGORY_LABELS = {
  physical:   '🧬 Physical',
  mental:     '🧠 Mental',
  digestive:  '🔥 Digestive',
  behavioral: '🌙 Behavioral',
};

export default function QuizScreen({ question, progress, loading, onAnswer }) {
  const [firstChoice, setFirstChoice]   = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);

  const { answered = 0, maxAllowed = 20 } = progress ?? {};
  const progressPct = Math.min((answered / maxAllowed) * 100, 100);

  const handleOptionClick = (index) => {
    if (firstChoice === null) { setFirstChoice(index); return; }
    if (index === firstChoice) return;
    setSecondChoice(index === secondChoice ? null : index);
  };

  const handleContinue = () => {
    onAnswer(firstChoice, secondChoice);
    setFirstChoice(null);
    setSecondChoice(null);
  };

  if (!question) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <h2>Loading question…</h2>
        </div>
      </div>
    );
  }


  // Derive category  answered count for sidebar display  // Derive category from  count for sidebar display
  const categories = ['physical', 'mental', 'digestive', 'behavioral'];
  const questionsPerCat = Math.ceil(maxAllowed / categories.length);
  const currentCatIndex = Math.min(Math.floor(answered / questionsPerCat), categories.length - 1);

  return (
    <div className="quiz-layout">

      {/* ── Sidebar ── */}
      <div className="quiz-sidebar">
        <div className="quiz-sidebar-bg" />
        <div className="quiz-sidebar-content">

          <span className="quiz-sidebar-logo">
            <span className="quiz-sidebar-logo-dot" />
            Dosha
          </span>

          <div>
            <p className="quiz-prog-label">Categories</p>
            <div className="quiz-cats">
              {categories.map((cat, i) => (
                <div
                  key={cat}
                  className={`quiz-cat ${i < currentCatIndex ? 'done' : i === currentCatIndex ? 'active' : ''}`}
                >
                  {i < currentCatIndex ? '✓' : i === currentCatIndex ? '→' : ''}&nbsp;
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="quiz-prog-label">Progress</p>
            <div className="quiz-prog-bar">
              <div className="quiz-prog-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="quiz-prog-count">{answered} of {maxAllowed} questions</p>
          </div>

          <div className="quiz-conf-box">
            <p className="quiz-conf-label">Confidence</p>
            <div className="quiz-conf-bar">
              <div className="quiz-conf-fill" style={{ width: `${Math.min(progressPct * 1.4, 90)}%` }} />
            </div>
            <p className="quiz-conf-text">
              {answered < 6 ? 'Building picture…' : answered < 12 ? 'Getting clearer →' : 'Almost done →'}
            </p>
          </div>

        </div>
      </div>

      {/* ── Main ── */}
      <div className="quiz-main">
        <div style={{ flex: 1 }}>
          <p className="quiz-cat-tag">
            {CATEGORY_LABELS[question.category] ?? question.category}
          </p>
          <h1 className="quiz-question">{question.text}</h1>
          <p className="quiz-hint">
            {firstChoice === null
              ? 'Select your primary answer'
              : 'Optionally select a second answer, then continue'}
          </p>

          {loading && (
            <p style={{ fontSize: 12, color: 'var(--mist)', fontStyle: 'italic', marginBottom: 12 }}>
              Submitting…
            </p>
          )}

          <div className="options">
            {question.options.map((opt, index) => {
              const isFirst  = firstChoice  === index;
              const isSecond = secondChoice === index;
              return (
                <button
                  key={opt.text}
                  type="button"
                  disabled={loading}
                  className={isFirst ? 'selected' : isSecond ? 'second-selected' : ''}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-letter">
                    {isFirst ? 'Ⅰ' : isSecond ? 'Ⅱ' : String.fromCharCode(65 + index)}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {firstChoice !== null && (
          <div className="quiz-footer">
            <button className="btn-skip" type="button" onClick={handleContinue}>
              Skip second answer
            </button>
            <button
              className="btn-continue"
              type="button"
              disabled={loading}
              onClick={handleContinue}
            >
              {secondChoice !== null ? 'Continue with both →' : 'Continue →'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}