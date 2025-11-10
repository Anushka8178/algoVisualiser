import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function AlgorithmNavigator({ currentSlug }) {
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
      {}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-4 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-cyan-300/90 hover:text-cyan-200 transition-colors px-4 py-2 rounded-lg hover:bg-slate-700/50"
          >
            <span>←</span>
            <span>Dashboard</span>
          </Link>

          {}
          <div className="flex items-center gap-2">
            {prevAlgo && (
              <Link
                to={hasCompleted(prevAlgo.slug) ? `/visualize/${prevAlgo.slug}` : `/material/${prevAlgo.slug}`}
                className="flex items-center gap-2 bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-4 py-2 rounded-lg hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
              >
                <span>◀</span>
                <span className="hidden sm:inline">Previous</span>
              </Link>
            )}
            {nextAlgo && (
              <Link
                to={hasCompleted(nextAlgo.slug) ? `/visualize/${nextAlgo.slug}` : `/material/${nextAlgo.slug}`}
                className="flex items-center gap-2 bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-4 py-2 rounded-lg hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <span>▶</span>
              </Link>
            )}
          </div>

          {}
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

        {}
        {currentAlgo && (
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-between text-sm">
              <div className="text-cyan-300/70">
                <span className="font-semibold">Current: </span>
                <span className="text-cyan-200">{currentAlgo.title}</span>
                <span className="mx-2">•</span>
                <span className="text-slate-300">{currentAlgo.category}</span>
              </div>
              <div className="text-slate-300">
                {currentIndex + 1} of {algorithms.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

