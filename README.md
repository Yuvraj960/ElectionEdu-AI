# ElectionEdu-AI
ElectionEdu AI is vibe-coded project developed in the Google PromptWars Hackathon.
# 🗳️ ElectionEdu AI

> **Full-stack MERN web application** powered by Google Gemini AI, built for the Google Prompt Wars Hackathon. An interactive civic education platform to help citizens understand the election process.

![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express-5-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-orange)

---

## ✨ Features

- 🌎 **Country & Election Selector**: Choose your country and election type
- 📋 **Step-by-Step Overview**: AI-generated election process breakdown
- 📅 **Visual Timeline**: Interactive timeline of key election milestones
- 🗨️ **AI Chat Assistant**: Multi-turn chat for any election-related questions
- 📝 **Voter Checklist**: Interactive checklist to track voter readiness
- 🎓 **Civic Quiz**: 5-question AI-generated quiz with instant feedback
- 📚 **Election Glossary**: Plain English definitions of election terms

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) — UI framework
- **Tailwind CSS** — Dark theme styling (law/civic themed colors)
- **Zustand** — Global state management
- **React Router v6** — Client-side routing
- **Framer Motion** — Animations and transitions
- **React Icons** — Icon library

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database (optional for chat history, quiz results)
- **Google Gemini API** (`gemini-1.5-flash`) — AI provider (free tier)
- **CORS, Helmet, Morgan** — Middleware

---

## 🏗️ Monorepo Structure

```
electionedu-ai/
├── client/              # React (Vite) → Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route-level pages
│   │   ├── services/    # API calls (Axios)
│   │   ├── store/       # Zustand store
│   │   └── utils/       # Constants & helpers
│   └── ...
├── server/              # Express API → Backend
│   ├── models/          # Mongoose schemas
│   ├── prompts/         # AI prompt builders
│   ├── routes/          # API routes
│   ├── services/        # Gemini service layer
│   └── ...
├── .env.example         # Environment variables template
└── README.md
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Google Gemini API Key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))
- MongoDB Atlas URI (optional, for chat history and quiz results)

### 1. Clone & Navigate

```bash
git clone <repository-url>
cd electionedu-ai
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
# or for production:
node index.js
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the client:

```bash
npm run dev
```

---

## 🚀 Deployment

### Frontend (Vercel)
- Connect your GitHub repo
- Set root to `client/`
- Add `VITE_API_BASE_URL` as environment variable pointing to your deployed backend

### Backend (Render)
- Connect your GitHub repo
- Set root to `server/`
- Build: `npm install` | Start: `node index.js`
- Add all environment variables from `.env.example`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the Google Prompt Wars Hackathon.
