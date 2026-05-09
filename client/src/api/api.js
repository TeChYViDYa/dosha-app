import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const quizApi = {
  async startSession() {
    const { data } = await client.post('/session/start');
    return data;
  },

  async submitAnswer(sessionId, questionId, optionIndex) {
    const { data } = await client.post(`/session/${sessionId}/answer`, {
      questionId,
      optionIndex,
    });
    return data;
  },
};
