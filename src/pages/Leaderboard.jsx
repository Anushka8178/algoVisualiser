import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Leaderboard(){
  const { user } = useAuth();
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
    <div className="p-4 border-b border-cyan-500/10 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-12 bg-slate-700/50 rounded"></div>
        <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
        <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
        <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
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
          <p className="text-cyan-100/80 mt-2 text-sm sm:text-base">Top performers by streak and engagement</p>
        </motion.header>
        {loading ? (
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-900/20 overflow-hidden">
            <div className="hidden sm:grid grid-cols-4 px-4 py-3 text-sm text-cyan-300/70 border-b border-cyan-500/20 font-semibold">
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">🔥 Streak</div>
              <div className="text-right">📊 Engagement</div>
            </div>
            {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-900/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hidden sm:grid grid-cols-4 px-4 py-3 text-sm text-cyan-300/70 border-b border-cyan-500/20 font-semibold bg-slate-800/30">
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">🔥 Streak</div>
              <div className="text-right">📊 Engagement</div>
            </div>
            <div className="divide-y divide-cyan-500/10">
              {leaderboard.length === 0 ? (
                <motion.div 
                  className="px-4 py-12 sm:py-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-slate-300/80 text-base sm:text-lg">No users yet. Be the first!</p>
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
                      className={`${isYou ? 'bg-cyan-500/20 font-semibold text-cyan-100 border-l-4 border-cyan-400' : 'text-slate-200 hover:bg-slate-700/20'} transition-all duration-200`}
                    >
                      <div className="hidden sm:grid grid-cols-4 px-4 py-3">
                        <div className="text-cyan-300/90 flex items-center gap-2">
                          <span className="text-lg">{medal(row.rank)}</span>
                          <span>#{row.rank}</span>
                        </div>
                        <div className={isYou ? 'font-semibold text-cyan-100' : 'text-slate-200'}>
                          {row.username} {isYou && <span className="text-cyan-400 text-sm">(You)</span>}
                        </div>
                        <div className="text-right text-cyan-300/90">🔥 {row.streak}</div>
                        <div className="text-right text-cyan-300/90">📊 {row.engagement}</div>
                      </div>
                      <div className="sm:hidden p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{medal(row.rank)}</span>
                            <span className="text-cyan-300/90 font-semibold">#{row.rank}</span>
                            <span className={`${isYou ? 'text-cyan-100 font-semibold' : 'text-slate-200'}`}>
                              {row.username}
                            </span>
                            {isYou && <span className="text-cyan-400 text-xs">(You)</span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-cyan-300/90">
                            <span>🔥</span>
                            <span>{row.streak} day streak</span>
                          </div>
                          <div className="flex items-center gap-2 text-cyan-300/90">
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

