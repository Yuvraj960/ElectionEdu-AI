import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaTimes, FaRedo } from 'react-icons/fa';
import { useAppStore } from '../store/useAppStore';
import { generateQuiz, submitQuiz } from '../services/api';
import { showToast } from '../components/Toast';

export default function QuizPage() {
  const {
    selectedCountry,
    selectedElectionType,
    quizQuestions,
    setQuizQuestions,
    quizAnswers,
    submitAnswer,
    quizScore,
    setQuizScore,
  } = useAppStore();

  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await generateQuiz(selectedCountry, selectedElectionType);
      if (res.data?.success) {
        setQuizQuestions(res.data.data);
        setCurrentQ(0);
        setShowResult(false);
      }
    } catch (error) {
      showToast('Failed to generate quiz', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (option) => {
    const question = quizQuestions[currentQ];
    submitAnswer(question.id, option);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // Show results
      const score = quizQuestions.reduce((acc, q) => {
        const answer = quizAnswers[q.id];
        return acc + (answer && answer.startsWith(q.correctAnswer) ? 1 : 0);
      }, 0);
      setQuizScore(score);
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    const answers = Object.entries(quizAnswers).map(([questionId, selectedAnswer]) => ({
      questionId: Number(questionId),
      selectedAnswer,
    }));

    try {
      await submitQuiz({
        sessionId: Math.random().toString(36),
        country: selectedCountry,
        electionType: selectedElectionType,
        answers,
        questions: quizQuestions,
      });
    } catch (error) {
      showToast('Failed to submit quiz', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
      >
        Civic Quiz
      </motion.h1>
      <p className="text-slate-400 text-center mb-10">Test your election knowledge</p>

      {isLoading ? (
        <div className="text-center p-12 text-slate-400">Loading questions...</div>
      ) : quizQuestions.length === 0 ? (
        <div className="text-center p-12 text-slate-400">No questions available.</div>
      ) : showResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <div className="text-5xl font-bold text-white mb-4">
            {quizScore}/{quizQuestions.length}
          </div>
          <p className="text-slate-300 mb-6">
            {quizScore === quizQuestions.length
              ? 'Perfect score! You are an election expert!'
              : quizScore > quizQuestions.length / 2
              ? 'Great job! Keep learning!'
              : "Don't worry, keep practicing!"}
          </p>
          <button
            onClick={() => {
              setShowResult(false);
              setCurrentQ(0);
              setQuizQuestions([]);
              loadQuestions();
            }}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors"
          >
            <FaRedo /> Retake Quiz
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 mb-8">
            <motion.div
              className="bg-primary-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Question {currentQ + 1} of {quizQuestions.length}
          </p>

          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              {quizQuestions[currentQ].question}
            </h3>
            <div className="space-y-3">
              {quizQuestions[currentQ].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary-500/30 text-slate-200 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
