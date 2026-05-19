const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const ChatSession = require('../models/ChatSession');

router.post('/chat', async (req, res) => {
  try {
    const { sessionId, country, electionType, message, currentStep, history } = req.body;

    if (!country || !electionType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: country, electionType, message',
      });
    }

    const chatHistory = history || [];
    const formattedHistory = chatHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const result = await geminiService.chat({
      country,
      electionType,
      currentStep,
      chatHistory: formattedHistory,
      userMessage: message,
    });

    // Save to database if available
    try {
      let session = await ChatSession.findOne({ sessionId });
      if (!session) {
        session = new ChatSession({
          sessionId,
          country,
          electionType,
          messages: [],
        });
      }
      session.messages.push({ role: 'user', content: message });
      session.messages.push({ role: 'assistant', content: result.reply });
      await session.save();
    } catch (dbError) {
      console.warn('Database save failed:', dbError.message);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
