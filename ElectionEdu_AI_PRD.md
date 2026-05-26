# 🗳️ ElectionEdu AI — Product Requirements Document (PRD)
### Google Prompt Wars Hackathon Submission

---

## 📌 Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Target Users](#3-target-users)
4. [Core Features](#4-core-features)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture](#6-system-architecture)
7. [Application Pages & UI Screens](#7-application-pages--ui-screens)
8. [AI Prompt Design](#8-ai-prompt-design)
9. [Data Models](#9-data-models)
10. [API Endpoints](#10-api-endpoints)
11. [Component Breakdown](#11-component-breakdown)
12. [State Management](#12-state-management)
13. [Environment Variables](#13-environment-variables)
14. [Deployment](#14-deployment)
15. [MVP Scope](#15-mvp-scope)
16. [Agent Instructions Summary](#16-agent-instructions-summary)

---

## 1. Problem Statement

Most citizens — especially first-time voters and civic education students — lack a clear, accessible, and engaging way to understand how elections work. Official government websites are dense, inconsistent, and hard to navigate. There is no single interactive AI-powered platform that:

- Explains the **full election lifecycle** step-by-step
- Adapts to the user's **country/state/context**
- Answers **follow-up questions** in plain language
- Provides **timelines, deadlines, and voting steps** interactively
- Bridges the gap between **complex civic procedures** and **everyday understanding**

**ElectionEdu AI** solves this by building a conversational AI assistant that educates users about the election process in an intuitive, guided, and visually engaging format.

---

## 2. Solution Overview

ElectionEdu AI is a **full-stack MERN web application** powered by **Google Gemini API** that acts as an intelligent civic education assistant. Users can:

- Choose their **country and election type** (general, local, state, primary)
- Get a **structured, step-by-step breakdown** of the election process
- Ask **natural language questions** via a chat interface
- View **timelines** of key election dates and milestones
- Take a **quiz** to test their understanding
- Get **personalized voter readiness guidance**

The app is built entirely via **vibe coding (AI-agent-driven development)** — making it a meta showcase of AI-first development for the hackathon.

---

## 3. Target Users

| User Type | Description |
|-----------|-------------|
| First-Time Voters | Citizens voting for the first time needing end-to-end guidance |
| Civic Students | High school/college students studying government & civics |
| Immigrants & New Citizens | People learning about their adopted country's election system |
| General Public | Anyone wanting a refresher on how elections work |
| Educators | Teachers looking for an interactive classroom tool |

---

## 4. Core Features

### 4.1 Feature List (MVP)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| F1 | Country & Election Selector | Dropdown to select country + election type | P0 |
| F2 | Election Process Overview | AI-generated step-by-step breakdown of the process | P0 |
| F3 | Interactive Timeline | Visual horizontal/vertical timeline of key election milestones | P0 |
| F4 | Conversational Chat | Multi-turn AI chat to ask election-related questions | P0 |
| F5 | Voter Checklist | Interactive checklist: registration, ID, polling location, etc. | P1 |
| F6 | Civic Quiz | 5-question AI-generated quiz with instant feedback | P1 |
| F7 | Glossary | Plain-English definitions of election terms (ballot, precinct, etc.) | P1 |
| F8 | Share/Export | Share a summary card or export checklist as PDF | P2 |

---

## 5. Tech Stack

### Frontend
- **React.js** (Vite) — UI framework
- **Tailwind CSS** — Styling
- **Zustand** — Global state management
- **React Router v6** — Client-side routing
- **Framer Motion** — Animations and transitions
- **React Icons** — Icon library

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database (chat history, quiz results)
- **Google Gemini API** (`gemini-1.5-flash`) — AI provider (free tier)
- **dotenv** — Environment variable management
- **cors, helmet, morgan** — Middleware

### DevOps / Deployment
- **Frontend** → Vercel
- **Backend** → Render
- **MongoDB** → MongoDB Atlas (free tier M0)
- **CI/CD** → GitHub Actions (lint + deploy)

---

## 6. System Architecture

```
┌─────────────────────────────────────────────┐
│                  CLIENT (React)              │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Selector│  │ Timeline │  │  Chat UI   │  │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  │
│       └────────────┴──────────────┘         │
│                    │                         │
│              Zustand Store                   │
└──────────────────┬──────────────────────────┘
                   │  HTTP / REST API
┌──────────────────▼──────────────────────────┐
│              SERVER (Express)                │
│  ┌──────────────────────────────────────┐   │
│  │  POST /api/overview                  │   │
│  │  POST /api/chat                      │   │
│  │  GET  /api/timeline/:country         │   │
│  │  POST /api/quiz/generate             │   │
│  │  POST /api/quiz/evaluate             │   │
│  │  GET  /api/glossary/:term            │   │
│  └────────────────┬─────────────────────┘   │
│                   │                          │
│  ┌────────────────▼─────────────────────┐   │
│  │       Gemini API Service Layer       │   │
│  │  buildOverviewPrompt()               │   │
│  │  buildChatPrompt()                   │   │
│  │  buildQuizPrompt()                   │   │
│  │  buildTimelinePrompt()               │   │
│  └────────────────┬─────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
     ┌─────────────▼──────────┐
     │   Google Gemini API    │
     │   gemini-1.5-flash     │
     └────────────────────────┘
                   │
     ┌─────────────▼──────────┐
     │   MongoDB Atlas        │
     │   - chat_sessions      │
     │   - quiz_results       │
     └────────────────────────┘
```

---

## 7. Application Pages & UI Screens

### Page 1: Home / Landing (`/`)
- Hero section: "Understand Your Vote. Understand Your Power."
- Country + Election Type selector (dropdowns)
- CTA button: "Explore Election Process →"
- Feature highlights (3 cards: Timeline, Chat, Quiz)

### Page 2: Election Overview (`/overview`)
- Left sidebar: Step navigator (e.g., Step 1: Voter Registration → Step 2: Primaries → ...)
- Main content: AI-generated explanation of each step (rendered as card)
- "Ask a question about this step" → triggers chat
- Progress bar showing current step

### Page 3: Timeline (`/timeline`)
- Horizontal scrollable or vertical stepper timeline
- Milestones: Registration Deadline → Campaigning → Election Day → Results → Certification
- Each milestone has: date (if available), description, and an info icon for detail
- AI-generated contextual notes per milestone

### Page 4: Chat Assistant (`/chat`)
- Full-screen chat interface
- System context pre-loaded with selected country + election type
- User can ask anything: "What is a primary election?", "How do I register to vote?", "What happens if I miss the deadline?"
- Streaming responses (word by word) using Gemini streaming API
- Chat history persisted in MongoDB (sessionId in localStorage)

### Page 5: Voter Checklist (`/checklist`)
- Interactive checklist with checkboxes:
  - [ ] Check voter registration status
  - [ ] Find your polling location
  - [ ] Understand your ballot
  - [ ] Arrange transportation
  - [ ] Know the ID requirements
- AI tip appears for each unchecked item on hover
- Progress ring showing % complete

### Page 6: Civic Quiz (`/quiz`)
- 5 AI-generated MCQ questions based on selected country/election
- Timer (optional) per question
- Instant feedback after each answer (correct/incorrect + explanation)
- Final score card with "Share Results" button

### Page 7: Glossary (`/glossary`)
- Searchable list of civic/election terms
- Each term has: Term Name, Plain-English Definition, Example usage
- Terms fetched from AI on demand (on search/click)
- Persistent terms stored in MongoDB for caching

### Global Components
- **Navbar**: Logo, nav links, country indicator badge
- **Footer**: About, Sources, Disclaimer
- **Toast Notifications**: For loading/error states
- **Loading Skeleton**: For AI response delays

---

## 8. AI Prompt Design

### 8.1 Overview Prompt
```
You are a civic education expert. The user wants to understand the election process.

Country: {{country}}
Election Type: {{electionType}}

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

Return ONLY valid JSON. No markdown, no preamble.
```

### 8.2 Chat System Prompt
```
You are ElectionEdu AI, a friendly and knowledgeable civic education assistant.

Context:
- Country: {{country}}
- Election Type: {{electionType}}
- Current Step Being Viewed: {{currentStep}}

Rules:
1. Answer ONLY questions related to elections, voting, civic processes, and democracy.
2. Keep answers concise (under 150 words) unless the user asks for detail.
3. Use simple, plain language. Avoid jargon unless you define it.
4. If a question is outside scope, politely redirect: "That's outside my focus area. I'm here to help with election-related questions!"
5. Never give partisan political opinions or endorse any candidate/party.
6. If asked about a specific law or deadline, always recommend verifying with official government sources.

Conversation History:
{{chatHistory}}

User: {{userMessage}}
Assistant:
```

### 8.3 Timeline Prompt
```
You are a civic timeline expert.

Country: {{country}}
Election Type: {{electionType}}

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

Return ONLY valid JSON. Include 6-9 milestones. Order chronologically.
```

### 8.4 Quiz Generation Prompt
```
You are a civic education quiz generator.

Country: {{country}}
Election Type: {{electionType}}
Topics Covered: {{topicsCovered}}

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

Return ONLY valid JSON. Questions must be factual, educational, and non-partisan.
```

### 8.5 Glossary Term Prompt
```
Define the following election/civic term in plain English for a first-time voter.

Term: {{term}}
Country Context: {{country}}

Respond in JSON:
{
  "term": "{{term}}",
  "definition": "Clear 1-2 sentence definition",
  "example": "Real-world usage example",
  "relatedTerms": ["term1", "term2"]
}

Return ONLY valid JSON.
```

---

## 9. Data Models

### 9.1 ChatSession
```javascript
{
  _id: ObjectId,
  sessionId: String,          // UUID stored in localStorage
  country: String,
  electionType: String,
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 9.2 QuizResult
```javascript
{
  _id: ObjectId,
  sessionId: String,
  country: String,
  electionType: String,
  score: Number,              // 0-5
  totalQuestions: Number,
  answers: [
    {
      questionId: Number,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }
  ],
  createdAt: Date
}
```

### 9.3 GlossaryCache
```javascript
{
  _id: ObjectId,
  term: String,               // lowercase normalized
  country: String,
  definition: String,
  example: String,
  relatedTerms: [String],
  createdAt: Date
}
```

---

## 10. API Endpoints

### POST `/api/overview`
**Request:**
```json
{ "country": "United States", "electionType": "General Election" }
```
**Response:** Array of step objects (see Overview Prompt format)

---

### POST `/api/chat`
**Request:**
```json
{
  "sessionId": "uuid",
  "country": "United States",
  "electionType": "General Election",
  "currentStep": "Voter Registration",
  "message": "How do I register to vote?",
  "history": [ { "role": "user", "content": "..." }, { "role": "assistant", "content": "..." } ]
}
```
**Response:** `{ "reply": "AI response text" }`

---

### GET `/api/timeline/:country?electionType=General Election`
**Response:** Array of timeline milestone objects

---

### POST `/api/quiz/generate`
**Request:**
```json
{ "country": "United States", "electionType": "General Election", "topics": ["registration", "voting day"] }
```
**Response:** Array of 5 quiz question objects

---

### POST `/api/quiz/submit`
**Request:**
```json
{
  "sessionId": "uuid",
  "country": "United States",
  "electionType": "General Election",
  "answers": [ { "questionId": 1, "selectedAnswer": "A" } ],
  "questions": [ { ... } ]
}
```
**Response:** `{ "score": 4, "totalQuestions": 5, "results": [...] }`

---

### GET `/api/glossary/:term?country=United States`
**Response:** Glossary term object (from cache or freshly generated)

---

### GET `/api/health`
**Response:** `{ "status": "ok", "timestamp": "..." }`

---

## 11. Component Breakdown

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── Toast.jsx
│   │   └── ProgressBar.jsx
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── CountrySelector.jsx
│   │   └── FeatureCards.jsx
│   ├── overview/
│   │   ├── StepSidebar.jsx
│   │   ├── StepCard.jsx
│   │   └── OverviewContainer.jsx
│   ├── timeline/
│   │   ├── TimelineView.jsx
│   │   └── MilestoneCard.jsx
│   ├── chat/
│   │   ├── ChatWindow.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── ChatInput.jsx
│   │   └── TypingIndicator.jsx
│   ├── checklist/
│   │   ├── VoterChecklist.jsx
│   │   ├── ChecklistItem.jsx
│   │   └── ProgressRing.jsx
│   ├── quiz/
│   │   ├── QuizContainer.jsx
│   │   ├── QuizQuestion.jsx
│   │   ├── QuizResult.jsx
│   │   └── AnswerOption.jsx
│   └── glossary/
│       ├── GlossarySearch.jsx
│       └── TermCard.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── OverviewPage.jsx
│   ├── TimelinePage.jsx
│   ├── ChatPage.jsx
│   ├── ChecklistPage.jsx
│   ├── QuizPage.jsx
│   └── GlossaryPage.jsx
├── store/
│   └── useAppStore.js         # Zustand store
├── services/
│   └── api.js                 # Axios API calls
├── hooks/
│   ├── useElectionData.js
│   └── useChat.js
├── utils/
│   ├── sessionId.js           # UUID generator/getter
│   └── constants.js           # Countries, election types list
├── App.jsx
└── main.jsx
```

---

## 12. State Management (Zustand)

```javascript
// store/useAppStore.js
{
  // Selection
  selectedCountry: "United States",
  selectedElectionType: "General Election",
  setSelection: (country, electionType) => void,

  // Overview
  overviewSteps: [],
  currentStep: 0,
  setOverviewSteps: (steps) => void,
  setCurrentStep: (index) => void,

  // Chat
  sessionId: String,            // from localStorage
  chatHistory: [],
  addMessage: (message) => void,
  clearChat: () => void,

  // Quiz
  quizQuestions: [],
  quizAnswers: {},
  quizScore: null,
  setQuizQuestions: (questions) => void,
  submitAnswer: (questionId, answer) => void,
  setQuizScore: (score) => void,

  // Checklist
  checklistItems: [],
  toggleChecklistItem: (id) => void,

  // UI
  isLoading: Boolean,
  setLoading: (bool) => void,
  error: null | String,
  setError: (msg) => void
}
```

---

## 13. Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/electionedu
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 14. Deployment

### Monorepo Structure
```
electionedu-ai/
├── client/          # React (Vite) → Deploy to Vercel
├── server/          # Express API → Deploy to Render
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
└── README.md
```

### Vercel (Frontend)
- Connect GitHub repo → set root to `client/`
- Add `VITE_API_BASE_URL` as environment variable pointing to Render URL

### Render (Backend)
- Connect GitHub repo → set root to `server/`
- Build: `npm install` | Start: `node index.js`
- Add all environment variables from server `.env`

### GitHub Actions: `deploy-frontend.yml`
```yaml
on:
  push:
    branches: [main]
    paths: ['client/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

---

## 15. MVP Scope

### ✅ Must Have (Hackathon MVP)
- [ ] Home page with Country + Election Type selector
- [ ] AI-generated election process overview (step-by-step)
- [ ] Visual election timeline
- [ ] Multi-turn chat assistant with context
- [ ] Voter readiness checklist
- [ ] Civic quiz (5 questions)
- [ ] Glossary with search
- [ ] Deployed on Vercel + Render

### 🟡 Nice to Have (Post-Hackathon)
- [ ] User authentication (save progress)
- [ ] PDF export of checklist + summary
- [ ] Election news feed (via Google Search API)
- [ ] Multi-language support (i18n)
- [ ] Mobile PWA support

### ❌ Out of Scope
- Real-time election results
- Voter registration integration with government APIs
- Partisan political content of any kind

---

## 16. Agent Instructions Summary

> **For AI agents building this project**, follow these exact constraints:

### Stack Rules
- Frontend: **React + Vite + Tailwind CSS + Zustand + Framer Motion**
- Backend: **Node.js + Express + Mongoose**
- Database: **MongoDB Atlas**
- AI: **Google Gemini API (`gemini-1.5-flash`)** — free tier, no paid models
- Deployment: **Vercel (frontend) + Render (backend)**
- **NO Redux** — use Zustand only
- **NO Next.js** — pure React SPA
- **Minimal dependencies** — avoid bloat

### File Generation Order for Agents
1. `server/` — Setup Express, MongoDB, Gemini service, all routes
2. `client/src/store/` — Zustand store
3. `client/src/services/api.js` — Axios wrappers
4. `client/src/pages/` — All page shells
5. `client/src/components/` — All components bottom-up
6. `client/src/App.jsx` + `main.jsx` — Routing setup
7. `.github/workflows/` — CI/CD pipelines
8. `README.md` — Setup instructions

### Naming Conventions
- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- API routes: `kebab-case` (`/api/quiz/generate`)
- MongoDB collections: `camelCase` (`chatSessions`)
- Environment variables: `SCREAMING_SNAKE_CASE`

### Error Handling Rules
- All Gemini API calls wrapped in `try/catch`
- Strip JSON fences before `JSON.parse()`
- Return `{ error: "message" }` with appropriate HTTP status codes
- Frontend shows `Toast` for all API errors
- Never expose raw error stack to client in production

### Prompt Rules
- All prompts in `/server/prompts/` as separate `.js` files exporting prompt builder functions
- Each prompt must instruct Gemini to return **ONLY valid JSON**
- Parse and validate JSON before sending to client
- Fall back gracefully if JSON parse fails

---

*Document Version: 1.0*
*Project: ElectionEdu AI*
*Hackathon: Google Prompt Wars*
*Author: Yuvraj Gupta*
