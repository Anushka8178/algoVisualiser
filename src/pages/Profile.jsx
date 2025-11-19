import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

export default function Profile() {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const statsResponse = await fetch(`${API_URL}/progress/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        const historyResponse = await fetch(`${API_URL}/progress/history`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData);
        }

        const algoResponse = await fetch(`${API_URL}/algorithms`);
        if (algoResponse.ok) {
          const algoData = await algoResponse.json();
          setAlgorithms(algoData.filter(a => 
            a.slug !== 'inorder-traversal' && 
            a.slug !== 'preorder-traversal' && 
            a.slug !== 'postorder-traversal'
          ));
        }

        const leaderboardResponse = await fetch(`${API_URL}/leaderboard`);
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboard(leaderboardData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1 || null;

  const categoryProgress = algorithms.reduce((acc, algo) => {
    const category = algo.category;
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0 };
    }
    acc[category].total++;
    const isCompleted = history.some(h => 
      h.Algorithm?.id === algo.id && h.activityType === 'completed'
    );
    if (isCompleted) acc[category].completed++;
    return acc;
  }, {});


  const SkeletonCard = () => (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 animate-pulse">
      <div className="h-6 w-24 bg-slate-700/50 rounded mb-4"></div>
      <div className="h-12 w-32 bg-slate-700/50 rounded mb-2"></div>
      <div className="h-4 w-40 bg-slate-700/50 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

  const completedCount = stats?.algorithmsCompleted || 0;
  const totalAlgorithms = algorithms.length;
  const completionPercentage = totalAlgorithms > 0 
    ? Math.round((completedCount / totalAlgorithms) * 100) 
    : 0;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.header 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Your Profile
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${
            isDark ? 'text-cyan-100/80' : 'text-gray-600'
          }`}>
            Track your progress and learning journey
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden group ${
              isDark
                ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/30 shadow-cyan-900/20'
                : 'bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
            <div className="relative">
              <div className={`text-xs sm:text-sm mb-2 uppercase tracking-wide font-semibold ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>
                Algorithms Completed
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {completedCount}
              </div>
              <div className={`text-xs sm:text-sm flex items-center gap-1 ${
                isDark ? 'text-slate-300/60' : 'text-gray-600'
              }`}>
                <span className="text-green-400">↑</span>
                <span>Out of {totalAlgorithms} total</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden group ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
            <div className="relative">
              <div className={`text-xs sm:text-sm mb-2 uppercase tracking-wide font-semibold ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>
                Current Streak
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center gap-2 ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                🔥 {stats?.streak || 0}
              </div>
              <div className={`text-xs sm:text-sm ${
                isDark ? 'text-slate-300/60' : 'text-gray-600'
              }`}>
                {stats?.streak > 0 ? 'Keep it going!' : 'Start your streak today!'}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden group ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
            <div className="relative">
              <div className={`text-xs sm:text-sm mb-2 uppercase tracking-wide font-semibold ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>
                Total Engagement
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {stats?.totalEngagement || 0}
              </div>
              <div className={`text-xs sm:text-sm ${
                isDark ? 'text-slate-300/60' : 'text-gray-600'
              }`}>
                Total activities tracked
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden group ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
            <div className="relative">
              <div className={`text-xs sm:text-sm mb-2 uppercase tracking-wide font-semibold ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>
                Leaderboard Rank
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center gap-2 ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {userRank ? (
                  <>
                    {userRank === 1 && '🥇'}
                    {userRank === 2 && '🥈'}
                    {userRank === 3 && '🥉'}
                    #{userRank}
                  </>
                ) : (
                  '—'
                )}
              </div>
              <div className={`text-xs sm:text-sm ${
                isDark ? 'text-slate-300/60' : 'text-gray-600'
              }`}>
                {userRank ? `Out of ${leaderboard.length} users` : 'Not ranked yet'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Profile Card */}
        <motion.div 
          className={`backdrop-blur-md rounded-2xl p-6 sm:p-8 border shadow-xl mb-6 sm:mb-8 ${
            isDark
              ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
              : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white grid place-items-center text-3xl sm:text-4xl font-bold shadow-lg shadow-cyan-500/50">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{user.username}</h2>
              <p className={`text-sm sm:text-base mb-6 break-all ${
                isDark ? 'text-slate-300/80' : 'text-gray-600'
              }`}>{user.email}</p>
              <div className={`pt-6 border-t ${
                isDark ? 'border-cyan-500/20' : 'border-cyan-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm uppercase tracking-wide font-semibold ${
                    isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
                  }`}>Overall Progress</div>
                  <div className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>{completionPercentage}%</div>
                </div>
                <div className={`w-full rounded-full h-3 overflow-hidden mb-2 ${
                  isDark ? 'bg-slate-700/30' : 'bg-gray-200'
                }`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
                <p className={`text-xs sm:text-sm ${
                  isDark ? 'text-slate-300/60' : 'text-gray-600'
                }`}>
                  {completedCount} of {totalAlgorithms} algorithms completed
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${
              isDark ? 'text-cyan-300/90' : 'text-cyan-700'
            }`}>Category Progress</h2>
            <div className="space-y-4">
              {Object.entries(categoryProgress).map(([category, progress], idx) => {
                const percentage = progress.total > 0 
                  ? Math.round((progress.completed / progress.total) * 100) 
                  : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm sm:text-base font-medium ${
                        isDark ? 'text-slate-200' : 'text-gray-800'
                      }`}>{category}</span>
                      <span className={`text-sm ${
                        isDark ? 'text-cyan-300/90' : 'text-cyan-600'
                      }`}>{progress.completed}/{progress.total}</span>
                    </div>
                    <div className={`w-full rounded-full h-2.5 overflow-hidden ${
                      isDark ? 'bg-slate-700/30' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.7 + idx * 0.1 }}
                      />
                    </div>
                    <div className={`text-xs mt-1 ${
                      isDark ? 'text-slate-300/60' : 'text-gray-600'
                    }`}>{percentage}% completed</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div 
            className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-xl ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className={`text-lg sm:text-xl font-semibold ${
                isDark ? 'text-cyan-300/90' : 'text-cyan-700'
              }`}>Recent Activity</h2>
              <Link
                to="/dashboard"
                className={`text-xs sm:text-sm transition-colors ${
                  isDark 
                    ? 'text-cyan-400 hover:text-cyan-300' 
                    : 'text-cyan-600 hover:text-cyan-700'
                }`}
              >
                View All →
              </Link>
            </div>
            {history.length === 0 ? (
              <motion.div 
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-5xl mb-3">📚</div>
                <p className={`text-sm sm:text-base ${
                  isDark ? 'text-slate-300/80' : 'text-gray-600'
                }`}>No activity yet. Start learning algorithms!</p>
                <Link
                  to="/dashboard"
                  className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 text-sm"
                >
                  Browse Algorithms
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.slice(0, 8).map((activity, idx) => {
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
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + idx * 0.05 }}
                    >
                      <Link
                        to={linkPath}
                        className={`block flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-b last:border-0 transition-all duration-200 cursor-pointer group ${
                          isDark
                            ? 'text-slate-200 border-cyan-500/10 hover:bg-slate-700/30 hover:border-cyan-500/30'
                            : 'text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-cyan-200'
                        }`}
                      >
                        <span className="text-lg sm:text-xl">
                          {activity.activityType === 'completed' && '✅'}
                          {activity.activityType === 'viewed' && '👁️'}
                          {activity.activityType === 'note_created' && '📝'}
                        </span>
                        <span className={`flex-1 text-sm sm:text-base transition-colors ${
                          isDark 
                            ? 'group-hover:text-cyan-300' 
                            : 'group-hover:text-cyan-600'
                        }`}>
                          {algorithm.title}
                        </span>
                        <span className={`text-xs sm:text-sm ${
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
