import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getTimeline } from '../services/api';
import { showToast } from '../components/Toast';

const phaseColors = {
  'Pre-Election': 'bg-primary-500',
  'Election Day': 'bg-accent-500',
  'Post-Election': 'bg-emerald-500',
};

export default function TimelinePage() {
  const { selectedCountry, selectedElectionType, setLoading } = useAppStore();
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const res = await getTimeline(selectedCountry, selectedElectionType);
        if (res.data?.success) {
          setMilestones(res.data.data);
        } else {
          showToast('Failed to load timeline', 'error');
        }
      } catch (err) {
        showToast('Failed to load timeline', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [selectedCountry, selectedElectionType]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
      >
        Election Timeline
      </motion.h1>
      <p className="text-slate-400 text-center mb-12">Key milestones in the election cycle</p>

      <div className="relative">
        {milestones.map((m, i) => (
          <motion.div
            key={m.id || i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative pl-8 sm:pl-12 pb-12 last:pb-0"
          >
            {/* Timeline connector */}
            {i < milestones.length - 1 && (
              <div className="absolute left-[11px] sm:left-[15px] top-8 w-0.5 h-full bg-slate-700" />
            )}
            {/* Dot */}
            <div
              className={`absolute left-0 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-4 border-slate-900 ${
                phaseColors[m.phase] || 'bg-slate-500'
              }`}
            />
            <div className="glass-card p-5 sm:p-6 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${phaseColors[m.phase] || 'bg-slate-500'}`}>
                  {m.phase}
                </span>
                <h3 className="text-lg font-semibold text-white">{m.title}</h3>
              </div>
              <p className="text-sm text-slate-300 mb-1">{m.description}</p>
              <p className="text-xs text-slate-500">Timing: {m.typicalTiming}</p>
              <p className="text-xs text-slate-400 mt-1 italic">{m.importance}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
