import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getOverview } from '../services/api';
import { showToast } from '../components/Toast';

export default function OverviewPage() {
  const {
    selectedCountry,
    selectedElectionType,
    overviewSteps,
    setOverviewSteps,
    currentStep,
    setCurrentStep,
    setLoading,
  } = useAppStore();

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      try {
        const response = await getOverview(selectedCountry, selectedElectionType);
        if (response.data?.success) {
          setOverviewSteps(response.data.data);
        } else {
          showToast('Failed to load overview', 'error');
        }
      } catch (error) {
        showToast('Failed to load overview: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, [selectedCountry, selectedElectionType]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
      >
        Election Process Overview
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-4 space-y-2 sticky top-24">
            {overviewSteps.map((step, index) => (
              <button
                key={step.stepNumber}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentStep === index
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className="text-xs text-slate-500 block mb-0.5">Step {step.stepNumber}</span>
                <span className="line-clamp-1">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {overviewSteps.length > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/20 text-primary-300 font-bold text-lg">
                  {overviewSteps[currentStep].stepNumber}
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {overviewSteps[currentStep].title}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-base">
                {overviewSteps[currentStep].description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-accent-400 mb-2">Key Facts</h3>
                  <ul className="space-y-1.5">
                    {overviewSteps[currentStep].keyFacts.map((fact, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-rose-400 mb-2">Common Misconception</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {overviewSteps[currentStep].commonMisconceptions}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
