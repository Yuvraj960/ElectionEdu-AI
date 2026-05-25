import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { useAppStore } from '../store/useAppStore';

const icons = {
  success: <FaCheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <FaExclamationCircle className="w-5 h-5 text-rose-400" />,
  info: <FaInfoCircle className="w-5 h-5 text-primary-400" />,
};

export function showToast(message, type = 'info') {
  const store = useAppStore.getState();
  store.showToast(message, type);
  setTimeout(() => store.clearToast(), 4000);
}

export default function Toast() {
  const { toast, clearToast } = useAppStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-card flex items-center gap-3 px-5 py-3 border-l-4 border-primary-500 min-w-[300px]">
            {icons[toast.type] || icons.info}
            <p className="text-sm text-white">{toast.message}</p>
            <button onClick={clearToast} className="ml-auto text-slate-400 hover:text-white">
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
