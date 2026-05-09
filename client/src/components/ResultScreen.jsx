const labels = {
  vata: 'Vata',
  pitta: 'Pitta',
  kapha: 'Kapha',
};

export default function ResultScreen({ scores, onRestart }) {
  const dominant = scores?.dominantDosha;
  const prakriti = scores?.prakriti?.percent ?? {};
  const vikriti = scores?.vikriti?.percent ?? {};

  return (
    <main className="screen">
      <section className="panel">
        <p className="eyebrow">Assessment complete</p>
        <h1>Your primary dosha is {labels[dominant] ?? 'ready'}</h1>
        <div className="results">
          {Object.keys(labels).map((dosha) => (
            <div key={dosha} className="result-row">
              <span>{labels[dosha]}</span>
              <strong>{prakriti[dosha] ?? 0}%</strong>
              <small>Current: {vikriti[dosha] ?? 0}%</small>
            </div>
          ))}
        </div>
        <button type="button" onClick={onRestart}>Start again</button>
      </section>
    </main>
  );
}
