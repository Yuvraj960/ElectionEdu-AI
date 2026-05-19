const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prompts = require('../prompts');

// Fallback data generators (called when Gemini fails)
function createMockFallbacks() {
  const MOCK_MESSAGE = "This is mock data because AI has failed with the proper failure reason received from the API of AI";

  return {
    overview: [
      {
        stepNumber: 1,
        title: "Voter Registration",
        description: `${MOCK_MESSAGE}. Generally, the first step in any election is ensuring eligible citizens are registered to vote.`,
        keyFacts: [`${MOCK_MESSAGE} - Fact 1`, `${MOCK_MESSAGE} - Fact 2`],
        commonMisconceptions: `${MOCK_MESSAGE} - Common misconception placeholder`
      },
      {
        stepNumber: 2,
        title: "Campaign Period",
        description: `${MOCK_MESSAGE}. Candidates and parties campaign to share their platforms.`,
        keyFacts: [`${MOCK_MESSAGE} - Fact 1`],
        commonMisconceptions: `${MOCK_MESSAGE} - Misconception placeholder`
      }
    ],
    timeline: [
      {
        id: "milestone-1",
        title: "Voter Registration Opens",
        phase: "Pre-Election",
        description: `${MOCK_MESSAGE}. Citizens can begin registering to vote.`,
        typicalTiming: "90 days before election day",
        importance: `${MOCK_MESSAGE}. Registration is crucial to participate.`
      },
      {
        id: "milestone-2",
        title: "Campaigning Begins",
        phase: "Pre-Election",
        description: `${MOCK_MESSAGE}. Candidates start their campaigns and share their platforms.`,
        typicalTiming: "60 days before election day",
        importance: `${MOCK_MESSAGE}. Allows voters to learn about candidates and issues.`
      },
      {
        id: "milestone-3",
        title: "Registration Deadline",
        phase: "Pre-Election",
        description: `${MOCK_MESSAGE}. Last day to register to vote.`,
        typicalTiming: "30 days before election day",
        importance: `${MOCK_MESSAGE}. Ensures voter rolls are finalized in time.`
      },
      {
        id: "milestone-4",
        title: "Early Voting Begins",
        phase: "Pre-Election",
        description: `${MOCK_MESSAGE}. Voters can cast their votes in advance.`,
        typicalTiming: "2 weeks before election day",
        importance: `${MOCK_MESSAGE}. Increases accessibility and voter turnout.`
      },
      {
        id: "milestone-5",
        title: "Election Day",
        phase: "Election Day",
        description: `${MOCK_MESSAGE}. Citizens cast their ballots at polling locations.`,
        typicalTiming: "Election day",
        importance: `${MOCK_MESSAGE}. The most critical day of the democratic process.`
      },
      {
        id: "milestone-6",
        title: "Vote Counting",
        phase: "Post-Election",
        description: `${MOCK_MESSAGE}. Votes are counted and verified.`,
        typicalTiming: "After polls close",
        importance: `${MOCK_MESSAGE}. Determines the election outcome.`
      },
      {
        id: "milestone-7",
        title: "Results Certified",
        phase: "Post-Election",
        description: `${MOCK_MESSAGE}. Official results are finalized and certified.`,
        typicalTiming: "Days to weeks after election",
        importance: `${MOCK_MESSAGE}. Confirms the legitimacy of the election.`
      }
    ],
    quiz: [
      {
        id: 1,
        question: `${MOCK_MESSAGE}. What is the first step to participate in an election?`,
        options: ["A. Voting", "B. Registration", "C. Campaigning", "D. Counting"],
        correctAnswer: "A",
        explanation: `${MOCK_MESSAGE}. Registering is the first step to be eligible to vote.`
      },
      {
        id: 2,
        question: `${MOCK_MESSAGE}. What document is required to vote at a polling station?`,
        options: ["A. Passport", "B. Voter ID", "C. Driver's License", "D. Birth Certificate"],
        correctAnswer: "B",
        explanation: `${MOCK_MESSAGE}. A valid voter ID is typically required to cast a ballot.`
      },
      {
        id: 3,
        question: `${MOCK_MESSAGE}. How often are general elections typically held?`,
        options: ["A. Every year", "B. Every 2 years", "C. Every 4 years", "D. Every 6 years"],
        correctAnswer: "C",
        explanation: `${MOCK_MESSAGE}. Most general elections are held every 4-5 years depending on the country.`
      },
      {
        id: 4,
        question: `${MOCK_MESSAGE}. What happens if a candidate does not win by majority?`,
        options: ["A. No one wins", "B. Runoff election", "C. Election is cancelled", "D. Party chooses winner"],
        correctAnswer: "B",
        explanation: `${MOCK_MESSAGE}. When no candidate gets a majority, a runoff election is often held between the top candidates.`
      },
      {
        id: 5,
        question: `${MOCK_MESSAGE}. What is the purpose of a polling station?`,
        options: ["A. Campaigning", "B. Counting votes", "C. Voting", "D. Registering voters"],
        correctAnswer: "C",
        explanation: `${MOCK_MESSAGE}. Polling stations are designated locations where citizens cast their ballots.`
      }
    ],
    glossary: {
      term: "placeholder",
      definition: `${MOCK_MESSAGE}. This is a placeholder definition for failed glossary term lookup.`,
      example: `${MOCK_MESSAGE}. Example unavailable due to AI failure.`,
      relatedTerms: [`${MOCK_MESSAGE}`]
    }
  };
}

const mockData = createMockFallbacks();

class GeminiService {
  constructor() {
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your')) {
        console.warn('⚠️ Warning: Gemini API key not properly configured. Using mock data mode.');
        this.model = null; // Will trigger mock data use
      } else {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      }
    } catch (error) {
      console.error('❌ Error initializing Gemini:', error.message);
      this.model = null; // Ensure it safely falls back to mock data
    }
  }

  async _generateContent(prompt) {
    if (!this.model) {
      // Intentionally simulate an API error to use mock data
      const error = new Error('AI Service Unavailable - Using mock data as fallback.');
      error.isAIError = true;
      throw error;
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      error.isAIError = true;
      throw error;
    }
  }

  _safeJSONParse(text, fallback = null) {
    try {
      // Strip markdown fences and trim
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (error) {
      console.error('JSON Parse Error:', error.message);
      return fallback;
    }
  }

  async getOverview(country, electionType) {
    try {
      const prompt = prompts.buildOverviewPrompt(country, electionType);
      const text = await this._generateContent(prompt);
      const data = this._safeJSONParse(text, null);
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid JSON structure from AI for overview');
      }
      return { success: true, data, fromMock: false };
    } catch (error) {
      console.error('Overview AI Error:', error.message);
      return { success: true, data: mockData.overview, fromMock: true, aiError: error.message };
    }
  }

  async chat({ country, electionType, currentStep, chatHistory, userMessage }) {
    try {
      const prompt = prompts.buildChatPrompt({ country, electionType, currentStep, chatHistory, userMessage });
      const text = await this._generateContent(prompt);
      // Chat returns plain text, not JSON
      return { success: true, reply: text.trim(), fromMock: false };
    } catch (error) {
      console.error('Chat AI Error:', error.message);
      return { success: true, reply: `This is mock data because AI has failed with the proper failure reason received from the API of AI: ${error.message}`, fromMock: true };
    }
  }

  async getTimeline(country, electionType) {
    try {
      const prompt = prompts.buildTimelinePrompt(country, electionType);
      const text = await this._generateContent(prompt);
      const data = this._safeJSONParse(text, null);
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid JSON structure from AI for timeline');
      }
      return { success: true, data, fromMock: false };
    } catch (error) {
      console.error('Timeline AI Error:', error.message);
      return { success: true, data: mockData.timeline, fromMock: true, aiError: error.message };
    }
  }

  async generateQuiz(country, electionType, topicsCovered) {
    try {
      const prompt = prompts.buildQuizPrompt(country, electionType, topicsCovered);
      const text = await this._generateContent(prompt);
      const data = this._safeJSONParse(text, null);
      if (!data || !Array.isArray(data) || data.length !== 5) {
        throw new Error('Invalid JSON structure from AI for quiz');
      }
      return { success: true, data, fromMock: false };
    } catch (error) {
      console.error('Quiz AI Error:', error.message);
      return { success: true, data: mockData.quiz, fromMock: true, aiError: error.message };
    }
  }

  async getGlossaryTerm(term, country) {
    try {
      const prompt = prompts.buildGlossaryPrompt(term, country);
      const text = await this._generateContent(prompt);
      const data = this._safeJSONParse(text, null);
      if (!data || !data.term) {
        throw new Error('Invalid JSON structure from AI for glossary');
      }
      return { success: true, data, fromMock: false };
    } catch (error) {
      console.error('Glossary AI Error:', error.message);
      const fallback = {
        ...mockData.glossary,
        term: term,
        definition: `This is mock data because AI has failed with the proper failure reason received from the API of AI: ${error.message}`
      };
      return { success: true, data: fallback, fromMock: true, aiError: error.message };
    }
  }
}

module.exports = new GeminiService();
