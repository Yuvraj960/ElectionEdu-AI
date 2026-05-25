import { motion } from 'framer-motion';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          className="glass-card h-32 bg-slate-800/50 border border-white/5"
        />
      ))}
    </div>
  );
}
