import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import useQuiz from './hooks/useQuiz';
import './index.css';

function App() {
  const {
    status,
    question,
    progress,
    scores,
    error,
    startQuiz,
    submitAnswer,
    resetQuiz,
  } = useQuiz();

  if (status === 'idle') {
    return <IntroScreen onStart={startQuiz} loading={false} />;
  }

  if (status === 'completed') {
    return <ResultScreen scores={scores} onRestart={resetQuiz} />;
  }

  if (status === 'error') {
    return (
      <main className="screen">
        <section className="panel">
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <button type="button" onClick={resetQuiz}>Back to start</button>
        </section>
      </main>
    );
  }

  return (
    <QuizScreen
      question={question}
      progress={progress}
      loading={status === 'loading'}
      onAnswer={submitAnswer}
    />
  );
}

export default App;
