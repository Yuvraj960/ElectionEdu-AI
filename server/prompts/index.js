module.exports = {
  buildOverviewPrompt(country, electionType) {
    return `You are a civic education expert. The user wants to understand the election process.

Country: ${country}
Election Type: ${electionType}

Provide a clear, structured, step-by-step explanation of the entire election process for this context. Format the response as a JSON array of steps:
[
  {
    "stepNumber": 1,
    "title": "Step Title",
    "description": "2-3 sentence plain English explanation",
    "keyFacts": ["fact1", "fact2"],
    "commonMisconceptions": "one common misunderstanding"
  }
]

Return ONLY valid JSON. No markdown, no preamble.`;
  },

  buildChatPrompt({ country, electionType, currentStep, chatHistory, userMessage }) {
    return `You are ElectionEdu AI, a friendly and knowledgeable civic education assistant.

Context:
- Country: ${country}
- Election Type: ${electionType}
- Current Step Being Viewed: ${currentStep || 'General'}

Rules:
1. Answer ONLY questions related to elections, voting, civic processes, and democracy.
2. Keep answers concise (under 150 words) unless the user asks for detail.
3. Use simple, plain language. Avoid jargon unless you define it.
4. If a question is outside scope, politely redirect: "That's outside my focus area. I'm here to help with election-related questions!"
5. Never give partisan political opinions or endorse any candidate/party.
6. If asked about a specific law or deadline, always recommend verifying with official government sources.

${chatHistory ? `Conversation History:\n${chatHistory}\n` : ''}
User: ${userMessage}
Assistant:`;
  },

  buildTimelinePrompt(country, electionType) {
    return `You are a civic timeline expert.

Country: ${country}
Election Type: ${electionType}

Generate a JSON timeline of key milestones in the election cycle:
[
  {
    "id": "milestone-1",
    "title": "Milestone Name",
    "phase": "Pre-Election | Election Day | Post-Election",
    "description": "What happens at this stage",
    "typicalTiming": "e.g., 30-60 days before election day",
    "importance": "Why this milestone matters"
  }
]

Return ONLY valid JSON. Include 6-9 milestones. Order chronologically.`;
  },

  buildQuizPrompt(country, electionType, topicsCovered = []) {
    return `You are a civic education quiz generator.

Country: ${country}
Election Type: ${electionType}
Topics Covered: ${topicsCovered.length > 0 ? topicsCovered.join(', ') : 'General civic knowledge'}

Generate exactly 5 multiple choice questions. Format as JSON:
[
  {
    "id": 1,
    "question": "Question text?",
    "options": ["A. option", "B. option", "C. option", "D. option"],
    "correctAnswer": "A",
    "explanation": "Why this is correct in 1-2 sentences."
  }
]

Return ONLY valid JSON. Questions must be factual, educational, and non-partisan.`;
  },

  buildGlossaryPrompt(term, country) {
    return `Define the following election/civic term in plain English for a first-time voter.

Term: ${term}
Country Context: ${country}

Respond in JSON:
{
  "term": "${term}",
  "definition": "Clear 1-2 sentence definition",
  "example": "Real-world usage example",
  "relatedTerms": ["term1", "term2"]
}

Return ONLY valid JSON.`;
  },
};
