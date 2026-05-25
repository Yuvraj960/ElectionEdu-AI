import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { useAppStore } from '../store/useAppStore';
import { sendChat } from '../services/api';
import { showToast } from '../components/Toast';

export default function ChatPage() {
  const {
    selectedCountry,
    selectedElectionType,
    sessionId,
    chatHistory,
    addMessage,
    setLoading,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage({ role: 'user', content: userMessage });
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChat({
        sessionId,
        country: selectedCountry,
        electionType: selectedElectionType,
        message: userMessage,
        currentStep: 'General',
        history: chatHistory.slice(-10),
      });

      if (response.data?.success) {
        addMessage({ role: 'assistant', content: response.data.reply });
      } else {
        showToast('Failed to get response', 'error');
      }
    } catch (error) {
      showToast('Failed to send message', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 h-[calc(100dvh-4rem)] flex flex-col py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-4 text-center"
      >
        Chat with ElectionEdu AI
      </motion.h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chatHistory.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-primary-500/20 text-white border border-primary-500/30'
                  : 'bg-slate-800 text-slate-300 border border-white/5'
              }`}
            >
              <div className="flex items-end gap-2 mb-1">
                {msg.role === 'assistant' ? (
                  <FaRobot className="w-4 h-4 text-primary-400 flex-shrink-0" />
                ) : (
                  <FaUser className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span className="text-xs font-semibold opacity-60">
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-xl border border-white/5 animate-pulse">
              <div className="flex items-center gap-2">
                <FaRobot className="w-5 h-5 text-primary-400" />
                <span className="text-slate-400 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about elections..."
          className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
