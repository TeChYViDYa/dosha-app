/**
 * useQuiz — central quiz state hook
 *
 * Manages: session, current question, answers, scores, status
 * Components just call: startQuiz(), submitAnswer(optionIndex)
 */

import { useState, useCallback } from 'react';
import { quizApi } from '../api/api';

const INITIAL_STATE = {
  status: 'idle',        // idle | loading | active | completed | error
  sessionId: null,
  question: null,
  progress: { answered: 0, minRequired: 12, maxAllowed: 20 },
  scores: null,
  answers: [],           // local answer history for explanation layer
  error: null,
};

export function useQuiz() {
  const [state, setState] = useState(INITIAL_STATE);

  const setPartial = (updates) =>
    setState(prev => ({ ...prev, ...updates }));

  // ── Start the quiz ──────────────────────────────────────────
  const startQuiz = useCallback(async () => {
    setPartial({ status: 'loading', error: null });
    try {
      const data = await quizApi.startSession();
      setPartial({
        status: 'active',
        sessionId: data.sessionId,
        question: data.question,
        progress: data.progress,
        scores: null,
        answers: [],
      });
    } catch (err) {
      setPartial({ status: 'error', error: 'Failed to start quiz. Is the server running?' });
    }
  }, []);

  // ── Submit an answer ────────────────────────────────────────
  // const submitAnswer = useCallback(async (optionIndex) => {
  //   if (!state.sessionId || !state.question) return;

  //   setPartial({ status: 'loading' });

  //   // Save answer locally for explanation layer
  //   const newAnswer = {
  //     questionId: state.question.id,
  //     questionText: state.question.text,
  //     selectedOption: state.question.options[optionIndex],
  //     category: state.question.category,
  //   };

  //   try {
  //     const data = await quizApi.submitAnswer(state.sessionId, state.question.id, optionIndex);

  //     if (data.status === 'completed') {
  //       setPartial({
  //         status: 'completed',
  //         scores: data.scores,
  //         answers: [...state.answers, newAnswer],
  //         question: null,
  //       });
  //     } else {
  //       setPartial({
  //         status: 'active',
  //         question: data.nextQuestion,
  //         scores: data.scores,
  //         progress: data.progress,
  //         answers: [...state.answers, newAnswer],
  //       });
  //     }
  //   } catch (err) {
  //     setPartial({ status: 'error', error: 'Failed to submit answer. Please try again.' });
  //   }
  // }, [state]);

    const submitAnswer = useCallback(async (optionIndex, optionIndex2) => {
    if (!state.sessionId || !state.question) return;

    setPartial({ status: 'loading' });

    // Save answer locally for explanation layer
    const newAnswer = {
      questionId: state.question.id,
      questionText: state.question.text,
      selectedOption: state.question.options[optionIndex],
      selectedOption2: state.question.options[optionIndex2],
      category: state.question.category,
    };

    try {
      const data = await quizApi.submitAnswer(state.sessionId, state.question.id, optionIndex, optionIndex2);

      if (data.status === 'completed') {
        setPartial({
          status: 'completed',
          scores: data.scores,
          answers: [...state.answers, newAnswer],
          question: null,
        });
      } else {
        setPartial({
          status: 'active',
          question: data.nextQuestion,
          scores: data.scores,
          progress: data.progress,
          answers: [...state.answers, newAnswer],
        });
      }
    } catch (err) {
      setPartial({ status: 'error', error: 'Failed to submit answer. Please try again.' });
    }
  }, [state]);

  // ── Reset ───────────────────────────────────────────────────
  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    startQuiz,
    submitAnswer,
    resetQuiz,
  };
}

export default useQuiz;
