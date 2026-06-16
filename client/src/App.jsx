import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import IntroScreen    from './components/IntroScreen';
import QuizScreen     from './components/QuizScreen';
import ResultScreen   from './components/ResultScreen';
import DashboardScreen from './components/DashboardScreen';
import useQuiz from './hooks/useQuiz';
import './index.css';

function QuizFlow() {
  const navigate = useNavigate();
  const { status, question, progress, scores, sessionId, error, startQuiz, submitAnswer, resetQuiz } = useQuiz();

  const handleRestart = () => {
    resetQuiz();
    navigate('/');
  };

  if (status === 'idle') {
    return <IntroScreen onStart={startQuiz} loading={false} />;
  }

  if (status === 'loading' && !question) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <h2>Preparing your assessment…</h2>
          <p>Connecting to server</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="screen">
        <section className="panel">
          <p className="eyebrow">Something went wrong</p>
          <h1>Unable to connect</h1>
          <div className="error-card" style={{ marginBottom: 20 }}>
            <p>{error ?? 'Please check the server is running and try again.'}</p>
          </div>
          <button type="button" className="btn-primary" onClick={handleRestart}>
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (status === 'active' || (status === 'loading' && question)) {
    return (
      <QuizScreen
        question={question}
        progress={progress}
        loading={status === 'loading'}
        onAnswer={submitAnswer}
      />
    );
  }

  if (status === 'completed') {
    return (
      <ResultScreen
        scores={scores}
        sessionId={sessionId}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<QuizFlow />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}