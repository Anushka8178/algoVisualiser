import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

export default function AlgorithmNavigator({ currentSlug }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasCompleted } = useAuth();

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await fetch(`${API_URL}/algorithms`);
        if (response.ok) {
          const data = await response.json();
          setAlgorithms(data);
        }
      } catch (error) {
        console.error('Error fetching algorithms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, []);

  if (loading) return null;

  const currentIndex = algorithms.findIndex(algo => algo.slug === currentSlug);
  const currentAlgo = algorithms[currentIndex];
  const nextAlgo = algorithms[currentIndex + 1];
  const prevAlgo = algorithms[currentIndex - 1];

  return (
    <div className="w-full mb-6 relative">
      <div className={`backdrop-blur-md rounded-xl p-4 border shadow-xl ${
        isDark
          ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
          : 'bg-gray-100/90 border-cyan-200 shadow-gray-200/20'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 transition-colors px-4 py-2 rounded-lg ${
              isDark
                ? 'text-cyan-300/90 hover:text-cyan-200 hover:bg-slate-700/50'
                : 'text-cyan-600 hover:text-cyan-700 hover:bg-gray-200'
            }`}
          >
            <span>←</span>
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            {prevAlgo && (
              <Link
                to={hasCompleted(prevAlgo.slug) ? `/visualize/${prevAlgo.slug}` : `/material/${prevAlgo.slug}`}
                className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? 'bg-slate-700/50 border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50'
                    : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300 hover:border-gray-400'
                }`}
              >
                <span>◀</span>
                <span className="hidden sm:inline">Previous</span>
              </Link>
            )}
            {nextAlgo && (
              <Link
                to={hasCompleted(nextAlgo.slug) ? `/visualize/${nextAlgo.slug}` : `/material/${nextAlgo.slug}`}
                className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? 'bg-slate-700/50 border-cyan-500/30 text-cyan-100 hover:bg-slate-700/70 hover:border-cyan-400/50'
                    : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <span>▶</span>
              </Link>
            )}
          </div>

          {currentAlgo && (
            <Link
              to={`/notes/${currentSlug}`}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-cyan-500/50"
            >
              <span>📝</span>
              <span>Notes</span>
            </Link>
          )}

        </div>

        {currentAlgo && (
          <div className={`mt-4 pt-4 border-t ${
            isDark ? 'border-cyan-500/20' : 'border-gray-300'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <div className={isDark ? 'text-cyan-300/70' : 'text-gray-600'}>
                <span className="font-semibold">Current: </span>
                <span className={isDark ? 'text-cyan-200' : 'text-cyan-600'}>{currentAlgo.title}</span>
                <span className="mx-2">•</span>
                <span className={isDark ? 'text-slate-300' : 'text-gray-500'}>{currentAlgo.category}</span>
              </div>
              <div className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                {currentIndex + 1} of {algorithms.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

