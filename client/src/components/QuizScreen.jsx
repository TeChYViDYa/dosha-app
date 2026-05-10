export default function QuizScreen({ question, progress, loading, onAnswer }) {
  if (!question) {
    return (
      <main className="screen">
        <section className="panel">
          <p>Loading question...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen">
      <section className="panel">
        <p className="eyebrow">
          Question {progress.answered + 1} of {progress.maxAllowed}
        </p>
        <h1>{question.text}</h1>
        <div className="options">
          {loading && <p className="loading">Submitting answer...</p>}
          {question.options.map((option, index) => (
            <button
              key={option.text}
              type="button"
              disabled={loading}
              onClick={() => onAnswer(index)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
