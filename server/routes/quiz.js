const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const QuizResult = require('../models/QuizResult');

router.post('/quiz/generate', async (req, res) => {
  try {
    const { country, electionType, topics } = req.body;

    if (!country || !electionType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: country, electionType',
      });
    }

    const result = await geminiService.generateQuiz(country, electionType, topics || []);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/quiz/submit', async (req, res) => {
  try {
    const { sessionId, country, electionType, answers, questions } = req.body;
    
    if (!answers || !questions || !Array.isArray(answers) || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz submission format',
      });
    }

    // Grade the quiz
    const results = answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question ? question.correctAnswer : '',
        isCorrect: question ? answer.selectedAnswer === question.correctAnswer : false,
      };
    });

    const score = results.filter((r) => r.isCorrect).length;
    const totalQuestions = questions.length;

    // Save to database
    try {
      const quizResult = new QuizResult({
        sessionId,
        country,
        electionType,
        score,
        totalQuestions,
        answers: results,
      });
      await quizResult.save();
    } catch (dbError) {
      console.warn('Database save failed:', dbError.message);
    }

    res.json({ success: true, score, totalQuestions, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
