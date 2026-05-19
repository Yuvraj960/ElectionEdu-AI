const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  country: { type: String, required: true },
  electionType: { type: String, required: true },
  score: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true, min: 0 },
  answers: [
    {
      questionId: { type: Number, required: true },
      selectedAnswer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
