const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

router.get('/timeline/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { electionType } = req.query;

    if (!electionType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameter: electionType',
      });
    }

    const result = await geminiService.getTimeline(country, electionType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
