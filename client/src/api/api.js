import axios from 'axios';

function getOrCreateAnonymousId() {
  const key = 'ayurveda_anon_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export const anonymousId = getOrCreateAnonymousId();

const api = axios.create({
  baseURL: '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '15000', 10),
  headers: {
    'Content-Type': 'application/json',
    'X-Anonymous-Id': anonymousId,
  },
});

export const quizApi = {
  startSession: () => api.post('/session/start', { anonymousId }).then(r => r.data),
  getSession: (sessionId) => api.get(`/session/${sessionId}`).then(r => r.data),
  submitAnswer: (sessionId, questionId, optionIndex) =>
    api.post(`/session/${sessionId}/answer`, { anonymousId, questionId, optionIndex }).then(r => r.data),
  finishSession: (sessionId) => api.post(`/session/${sessionId}/finish`, { anonymousId }).then(r => r.data),
};

export const userApi = {
  register: () => api.post('/users/register', { anonymousId }).then(r => r.data),
  getProfile: () => api.get(`/users/${anonymousId}`).then(r => r.data),
  getHistory: () => api.get(`/users/${anonymousId}/history`).then(r => r.data),
  getResult: (resultId) => api.get(`/users/${anonymousId}/history/${resultId}`).then(r => r.data),
  resetPrakriti: () => api.post(`/users/${anonymousId}/reset-prakriti`).then(r => r.data),
};

export default api;