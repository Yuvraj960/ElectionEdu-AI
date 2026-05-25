import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useAppStore } from '../store/useAppStore';
import { CHECKLIST_ITEMS } from '../utils/constants';

export default function ChecklistPage() {
  const { checklistItems, toggleChecklistItem } = useAppStore();
  const [dimension, setDimension] = useState(120);

  useEffect(() => {
    setDimension(120);
  }, []);

  const completed = checklistItems.filter(Boolean).length;
  const percentage = Math.round((completed / CHECKLIST_ITEMS.length) * 100);
  const circumference = 2 * Math.PI * (dimension / 2 - 10);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
      >
        Voter Readiness Checklist
      </motion.h1>
      <p className="text-slate-400 text-center mb-10">Make sure you're ready to cast your vote!</p>

      {/* Progress Ring */}
      <div className="flex justify-center mb-10">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-800"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-primary-500"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{percentage}%</span>
            <span className="text-xs text-slate-400">Complete</span>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => toggleChecklistItem(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center gap-4 glass-card p-4 text-left transition-all ${
              checklistItems[index]
                ? 'border-primary-500/30 bg-primary-500/5'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                checklistItems[index]
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-slate-600'
              }`}
            >
              {checklistItems[index] && <FaCheckCircle className="w-5 h-5 text-white" />}
            </div>
            <span
              className={`flex-1 text-base transition-colors ${
                checklistItems[index] ? 'text-slate-300 line-through' : 'text-white'
              }`}
            >
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
