import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useAppStore } from '../store/useAppStore';
import { getGlossaryTerm } from '../services/api';
import { showToast } from '../components/Toast';

const COMMON_TERMS = [
  'Ballot',
  'Primary',
  'Precinct',
  'Voter Registration',
  'Electoral College',
  'Campaign Finance',
  'Polling Station',
  'Exit Poll',
  'Absentee Ballot',
  'Coalition',
];

export default function GlossaryPage() {
  const { selectedCountry } = useAppStore();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term) => {
    setIsLoading(true);
    try {
      const res = await getGlossaryTerm(term, selectedCountry);
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        showToast('Failed to find term', 'error');
      }
    } catch (error) {
      showToast('Failed to fetch definition', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
      >
        Election Glossary
      </motion.h1>
      <p className="text-slate-400 text-center mb-8">Key terms in plain English</p>

      {/* Search */}
      <div className="flex gap-2 mb-10">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && handleSearch(query)}
            placeholder="Search for a term..."
            className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
        </div>
        <button
          onClick={() => query && handleSearch(query)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 rounded-xl transition-colors"
        >
          Search
        </button>
      </div>

      {/* Quick Terms */}
      {!result && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 mb-2">Popular terms:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_TERMS.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            key={result.term}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 sm:p-8 mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{result.term}</h2>
              <button
                onClick={() => setResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">{result.definition}</p>
            {result.example && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-primary-300 font-medium mb-1">Example</p>
                <p className="text-sm text-slate-300">{result.example}</p>
              </div>
            )}
            {result.relatedTerms && result.relatedTerms.length > 0 && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Related Terms:</p>
                <div className="flex flex-wrap gap-2">
                  {result.relatedTerms.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setQuery(t);
                        handleSearch(t);
                      }}
                      className="text-xs px-3 py-1 bg-white/5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
