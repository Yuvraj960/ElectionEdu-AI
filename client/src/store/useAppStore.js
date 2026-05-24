import { create } from 'zustand';
import { generateSessionId } from '../utils/sessionId';

const getStoredSession = () => {
  try {
    const stored = localStorage.getItem('electionedu_session_id');
    if (stored) return stored;
    const newSession = generateSessionId();
    localStorage.setItem('electionedu_session_id', newSession);
    return newSession;
  } catch {
    return generateSessionId();
  }
};

export const useAppStore = create((set, get) => ({
  // Selection
  selectedCountry: 'United States',
  selectedElectionType: 'General Election',
  setSelection: (country, electionType) =>
    set({ selectedCountry: country, selectedElectionType: electionType }),

  // Overview
  overviewSteps: [],
  currentStep: 0,
  setOverviewSteps: (steps) => set({ overviewSteps: steps }),
  setCurrentStep: (index) => set({ currentStep: index }),

  // Chat
  sessionId: getStoredSession(),
  chatHistory: [],
  addMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  clearChat: () => set({ chatHistory: [] }),

  // Quiz
  quizQuestions: [],
  quizAnswers: {},
  quizScore: null,
  setQuizQuestions: (questions) => set({ quizQuestions: questions, quizAnswers: {}, quizScore: null }),
  submitAnswer: (questionId, answer) =>
    set((state) => ({ quizAnswers: { ...state.quizAnswers, [questionId]: answer } })),
  setQuizScore: (score) => set({ quizScore: score }),

  // Checklist
  checklistItems: Array(5).fill(false),
  toggleChecklistItem: (index) =>
    set((state) => {
      const items = [...state.checklistItems];
      items[index] = !items[index];
      return { checklistItems: items };
    }),

  // UI
  isLoading: false,
  error: null,
  toast: null,
  setLoading: (bool) => set({ isLoading: bool }),
  setError: (msg) => set({ error: msg }),
  showToast: (msg, type = 'info') => set({ toast: { message: msg, type } }),
  clearToast: () => set({ toast: null }),
}));
