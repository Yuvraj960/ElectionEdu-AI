import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { COUNTRIES, ELECTION_TYPES } from '../utils/constants';
import { useAppStore } from '../store/useAppStore';

export default function CountrySelector() {
  const navigate = useNavigate();
  const { setSelection, selectedCountry, selectedElectionType } = useAppStore();
  const [showCountry, setShowCountry] = useState(false);
  const [showElection, setShowElection] = useState(false);

  const handleExplore = () => {
    navigate('/overview');
  };

  return (
    <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto">
      <div className="space-y-5">
        {/* Country Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Country</label>
          <button
            onClick={() => setShowCountry(!showCountry)}
            className="w-full flex items-center justify-between bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-left hover:border-primary-400/50 transition-colors"
          >
            <span className="flex items-center gap-3 text-slate-200">
              <FaGlobe className="text-primary-400" />
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label || 'Select a country'}
            </span>
            <FaChevronDown className={`text-slate-400 transition-transform ${showCountry ? 'rotate-180' : ''}`} />
          </button>
          {showCountry && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              {COUNTRIES.map((country) => (
                <button
                  key={country.value}
                  onClick={() => {
                    setSelection(country.value, selectedElectionType);
                    setShowCountry(false);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {country.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Election Type Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">Election Type</label>
          <button
            onClick={() => setShowElection(!showElection)}
            className="w-full flex items-center justify-between bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-left hover:border-primary-400/50 transition-colors"
          >
            <span className="text-slate-200">{selectedElectionType}</span>
            <FaChevronDown className={`text-slate-400 transition-transform ${showElection ? 'rotate-180' : ''}`} />
          </button>
          {showElection && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              {ELECTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelection(selectedCountry, type);
                    setShowElection(false);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {type}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExplore}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
        >
          Explore Election Process →
        </motion.button>
      </div>
    </div>
  );
}
