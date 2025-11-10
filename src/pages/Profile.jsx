import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Profile(){
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const statsResponse = await fetch(`${API_URL}/progress/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        const historyResponse = await fetch(`${API_URL}/progress/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const SkeletonCard = () => (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 animate-pulse">
      <div className="h-20 w-20 rounded-full bg-slate-700/50 mb-3"></div>
      <div className="h-6 w-32 bg-slate-700/50 rounded mb-2"></div>
      <div className="h-4 w-48 bg-slate-700/50 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <motion.div 
            className="text-center py-20 text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Please log in to view your profile
          </motion.div>
        </div>
      </div>
    );
  }

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
            Your Profile
          </h1>
          <p className="text-cyan-100/80 mt-2 text-sm sm:text-base">Track your progress and learning journey</p>
        </motion.header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white grid place-items-center text-xl sm:text-2xl font-bold shadow-lg shadow-cyan-500/50">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="mt-4 text-lg sm:text-xl font-semibold text-white">{user.username}</div>
            <div className="text-slate-300/80 text-sm sm:text-base break-all">{user.email}</div>
          </motion.div>
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="text-xs sm:text-sm text-cyan-300/70 mb-2 uppercase tracking-wide">Streak</div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">🔥 {stats?.streak || 0} days</div>
            <div className="text-xs sm:text-sm text-slate-300/60 mt-2">Keep it going!</div>
          </motion.div>
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="text-xs sm:text-sm text-cyan-300/70 mb-2 uppercase tracking-wide">Algorithms Completed</div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats?.algorithmsCompleted || 0}</div>
            <div className="text-xs sm:text-sm text-slate-300/60 mt-2">Total Engagement: {stats?.totalEngagement || 0}</div>
          </motion.div>
        </div>
        <motion.div 
          className="mt-6 sm:mt-8 bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-base sm:text-lg font-semibold mb-4 text-cyan-300/90">Recent Activity</div>
          {history.length === 0 ? (
            <motion.div 
              className="text-center py-8 sm:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl mb-3">📚</div>
              <p className="text-slate-300/80 text-sm sm:text-base">No activity yet. Start learning algorithms!</p>
            </motion.div>
          ) : (
            <ul className="space-y-2">
              {history.map((activity, idx) => {
                const algorithm = activity.Algorithm;
                if (!algorithm) return null;
                
                let linkPath = '';
                if (activity.activityType === 'completed') {
                  linkPath = `/visualize/${algorithm.slug}`;
                } else if (activity.activityType === 'viewed') {
                  linkPath = `/material/${algorithm.slug}`;
                } else if (activity.activityType === 'note_created') {
                  linkPath = `/notes/${algorithm.slug}`;
                }
                
                return (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link
                      to={linkPath}
                      className="block text-slate-200 flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-b border-cyan-500/10 last:border-0 hover:bg-slate-700/30 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
                    >
                      <span className="text-lg sm:text-xl">
                        {activity.activityType === 'completed' && '✅'}
                        {activity.activityType === 'viewed' && '👁️'}
                        {activity.activityType === 'note_created' && '📝'}
                      </span>
                      <span className="flex-1 text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                        {algorithm.title}
                      </span>
                      <span className="text-slate-400 text-xs sm:text-sm">
                        {new Date(activity.completedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

