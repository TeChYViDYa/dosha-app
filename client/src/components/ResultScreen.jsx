const labels = {
  vata: "Vata",
  pitta: "Pitta",
  kapha: "Kapha",
};

const doshas = [
  {
    name: "Vata",
    emoji: "🌬️",
    elements: "Air + Ether",
    color: "#5B8FA8",
    desc: "Movement & creativity",
  },
  {
    name: "Pitta",
    emoji: "🔥",
    elements: "Fire + Water",
    color: "#C9503A",
    desc: "Transformation & drive",
  },
  {
    name: "Kapha",
    emoji: "🌱",
    elements: "Water + Earth",
    color: "#4A7C59",
    desc: "Structure & stability",
  },
];

export default function ResultScreen({ scores, onRestart }) {
  const dominant = scores?.dominantDosha;
  const prakriti = scores?.prakriti?.percent ?? {};
  const vikriti = scores?.vikriti?.percent ?? {};

  return (
    <main className="screen">
      <section className="panel">
        <p className="eyebrow">Assessment complete</p>
        <h1>Your primary dosha is {labels[dominant] ?? "ready"}</h1>
        <div className="results">
          {Object.keys(labels).map((dosha) => (
            <div key={dosha} className="result-row">
              <div className="dosha-info">
                <span className="dosha-emoji">
                  {doshas.find((d) => d.name === labels[dosha])?.emoji}
                </span>

                <span className="dosha-name">{labels[dosha]}</span>
              </div>

              <strong>{prakriti[dosha] ?? 0}%</strong>
              <small>Current: {vikriti[dosha] ?? 0}%</small>
            </div>
          ))}
        </div>
        <button type="button" onClick={onRestart}>
          Start again
        </button>
      </section>
    </main>
  );
}
