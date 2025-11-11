import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

export default function Leaderboard(){
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const SkeletonRow = () => (
    <div className={`p-4 border-b animate-pulse ${
      isDark ? 'border-cyan-500/10' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`h-4 w-12 rounded ${
          isDark ? 'bg-slate-700/50' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 w-24 rounded ${
          isDark ? 'bg-slate-700/50' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 w-16 rounded ${
          isDark ? 'bg-slate-700/50' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 w-16 rounded ${
          isDark ? 'bg-slate-700/50' : 'bg-gray-300'
        }`}></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.header 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Leaderboard
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${
            isDark ? 'text-cyan-100/80' : 'text-gray-600'
          }`}>Top performers by streak and engagement</p>
        </motion.header>
        {loading ? (
          <div className={`backdrop-blur-md rounded-2xl border shadow-xl overflow-hidden ${
            isDark
              ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
              : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
          }`}>
            <div className={`hidden sm:grid grid-cols-4 px-4 py-3 text-sm border-b font-semibold ${
              isDark
                ? 'text-cyan-300/70 border-cyan-500/20'
                : 'text-cyan-600 border-gray-200'
            }`}>
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">🔥 Streak</div>
              <div className="text-right">📊 Engagement</div>
            </div>
            {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <motion.div 
            className={`backdrop-blur-md rounded-2xl border shadow-xl overflow-hidden ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`hidden sm:grid grid-cols-4 px-4 py-3 text-sm border-b font-semibold ${
              isDark
                ? 'text-cyan-300/70 border-cyan-500/20 bg-slate-800/30'
                : 'text-cyan-600 border-gray-200 bg-gray-50'
            }`}>
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">🔥 Streak</div>
              <div className="text-right">📊 Engagement</div>
            </div>
            <div className={`divide-y ${
              isDark ? 'divide-cyan-500/10' : 'divide-gray-200'
            }`}>
              {leaderboard.length === 0 ? (
                <motion.div 
                  className="px-4 py-12 sm:py-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <p className={`text-base sm:text-lg ${
                    isDark ? 'text-slate-300/80' : 'text-gray-600'
                  }`}>No users yet. Be the first!</p>
                </motion.div>
              ) : (
                leaderboard.map((row, idx) => {
                  const isYou = user && row.id === user.id;
                  return (
                    <motion.div
                      key={row.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`${isYou 
                        ? isDark 
                          ? 'bg-cyan-500/20 font-semibold text-cyan-100 border-l-4 border-cyan-400' 
                          : 'bg-cyan-50 font-semibold text-cyan-700 border-l-4 border-cyan-500'
                        : isDark
                          ? 'text-slate-200 hover:bg-slate-700/20'
                          : 'text-gray-700 hover:bg-gray-100'
                      } transition-all duration-200`}
                    >
                      <div className="hidden sm:grid grid-cols-4 px-4 py-3">
                        <div className={`flex items-center gap-2 ${
                          isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                        }`}>
                          <span className="text-lg">{medal(row.rank)}</span>
                          <span>#{row.rank}</span>
                        </div>
                        <div className={isYou 
                          ? isDark 
                            ? 'font-semibold text-cyan-100' 
                            : 'font-semibold text-cyan-700'
                          : isDark
                            ? 'text-slate-200'
                            : 'text-gray-700'
                        }>
                          {row.username} {isYou && <span className={`text-sm ${
                            isDark ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>(You)</span>}
                        </div>
                        <div className={`text-right ${
                          isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                        }`}>🔥 {row.streak}</div>
                        <div className={`text-right ${
                          isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                        }`}>📊 {row.engagement}</div>
                      </div>
                      <div className="sm:hidden p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{medal(row.rank)}</span>
                            <span className={`font-semibold ${
                              isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                            }`}>#{row.rank}</span>
                            <span className={isYou 
                              ? isDark 
                                ? 'text-cyan-100 font-semibold' 
                                : 'text-cyan-700 font-semibold'
                              : isDark
                                ? 'text-slate-200'
                                : 'text-gray-700'
                            }>
                              {row.username}
                            </span>
                            {isYou && <span className={`text-xs ${
                              isDark ? 'text-cyan-400' : 'text-cyan-600'
                            }`}>(You)</span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className={`flex items-center gap-2 ${
                            isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                          }`}>
                            <span>🔥</span>
                            <span>{row.streak} day streak</span>
                          </div>
                          <div className={`flex items-center gap-2 ${
                            isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                          }`}>
                            <span>📊</span>
                            <span>{row.engagement} engagement</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function medal(rank){
  if(rank===1) return '🥇';
  if(rank===2) return '🥈';
  if(rank===3) return '🥉';
  return '';
}

