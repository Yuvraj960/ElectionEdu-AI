import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Overview
export const getOverview = (country, electionType) =>
  API.post('/overview', { country, electionType });

// Timeline
export const getTimeline = (country, electionType) =>
  API.get(`/timeline/${encodeURIComponent(country)}?electionType=${encodeURIComponent(electionType)}`);

// Chat
export const sendChat = (data) => API.post('/chat', data);

// Quiz
export const generateQuiz = (country, electionType, topics = []) =>
  API.post('/quiz/generate', { country, electionType, topics });

export const submitQuiz = (data) => API.post('/quiz/submit', data);

// Glossary
export const getGlossaryTerm = (term, country) =>
  API.get(`/glossary/${encodeURIComponent(term)}?country=${encodeURIComponent(country)}`);

export default API;
