const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const GlossaryCache = require('../models/GlossaryCache');

router.get('/glossary/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameter: country',
      });
    }

    // Check cache first
    let cachedTerm;
    try {
      cachedTerm = await GlossaryCache.findOne({ term: term.toLowerCase(), country });
    } catch (err) {
      console.warn('Cache lookup failed:', err.message);
    }

    if (cachedTerm) {
      return res.json({
        success: true,
        data: cachedTerm,
        fromCache: true,
      });
    }

    const result = await geminiService.getGlossaryTerm(term, country);

    // Save to cache if AI succeeded
    if (!result.fromMock) {
      try {
        const newCache = new GlossaryCache({
          term: term.toLowerCase(),
          country,
          definition: result.data.definition,
          example: result.data.example,
          relatedTerms: result.data.relatedTerms,
        });
        await newCache.save();
      } catch (dbError) {
        console.warn('Cache save failed:', dbError.message);
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
