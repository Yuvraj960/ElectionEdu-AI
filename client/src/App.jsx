import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import OverviewPage from './pages/OverviewPage';
import TimelinePage from './pages/TimelinePage';
import ChatPage from './pages/ChatPage';
import ChecklistPage from './pages/ChecklistPage';
import QuizPage from './pages/QuizPage';
import GlossaryPage from './pages/GlossaryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <Toast />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
