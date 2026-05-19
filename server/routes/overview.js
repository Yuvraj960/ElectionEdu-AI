const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

router.post('/overview', async (req, res) => {
  try {
    const { country, electionType } = req.body;

    if (!country || !electionType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: country, electionType',
      });
    }

    const result = await geminiService.getOverview(country, electionType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
