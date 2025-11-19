import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard(){
  const { hasCompleted } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await fetch(`${API_URL}/algorithms`);
        if (response.ok) {
          const data = await response.json();

          const mapped = data
            .filter(algo => 
              algo.slug !== 'inorder-traversal' && 
              algo.slug !== 'preorder-traversal' && 
              algo.slug !== 'postorder-traversal'
            )
            .map(algo => ({
              id: algo.slug,
              title: algo.title,
              category: algo.category,
              desc: algo.description,
              complexity: algo.complexity,
            }));
          setAlgorithms(mapped);
        }
      } catch (error) {
        console.error('Error fetching algorithms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlgorithms();
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(algorithms.map(a => a.category))];
    return cats;
  }, [algorithms]);

  const filtered = useMemo(()=> {
    let result = algorithms;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(a => a.category === selectedCategory);
    }
    
    // Filter by search query
    if (query) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase()) ||
        a.desc.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return result;
  }, [query, selectedCategory, algorithms]);

  const SkeletonCard = () => (
    <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-xl animate-pulse ${
      isDark
        ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
        : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
    }`}>
      <div className={`h-4 w-20 rounded mb-3 ${
        isDark ? 'bg-slate-700/50' : 'bg-gray-300'
      }`}></div>
      <div className={`h-6 w-3/4 rounded mb-2 ${
        isDark ? 'bg-slate-700/50' : 'bg-gray-300'
      }`}></div>
      <div className={`h-4 w-full rounded mb-1 ${
        isDark ? 'bg-slate-700/50' : 'bg-gray-300'
      }`}></div>
      <div className={`h-4 w-5/6 rounded mb-3 ${
        isDark ? 'bg-slate-700/50' : 'bg-gray-300'
      }`}></div>
      <div className={`h-3 w-32 rounded mb-6 ${
        isDark ? 'bg-slate-700/50' : 'bg-gray-300'
      }`}></div>
      <div className="grid grid-cols-2 gap-3">
        <div className={`h-10 rounded-xl ${
          isDark ? 'bg-slate-700/50' : 'bg-gray-300'
        }`}></div>
        <div className={`h-10 rounded-xl ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Header Section */}
        <motion.header 
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-3"
          >
            Algorithm Library
          </h1>
          <p className={`text-base sm:text-lg ${
            isDark ? 'text-slate-300/80' : 'text-gray-600'
          }`}>
            Explore, learn, and visualize algorithms with interactive demonstrations
          </p>
        </motion.header>

        {/* Search and Filter Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-lg ${
            isDark
              ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
              : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
          }`}>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <svg 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  value={query} 
                  onChange={e=>setQuery(e.target.value)} 
                  placeholder="Search algorithms..." 
                  className={`w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-sm border focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-700/50 border-cyan-500/30 text-white placeholder-cyan-200/50'
                      : 'bg-white/80 border-cyan-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30'
                      : isDark
                      ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Request Algorithm Banner */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 border rounded-2xl p-5 sm:p-6 ${
            isDark 
              ? 'border-cyan-500/20' 
              : 'border-cyan-200/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className={`text-base sm:text-lg font-semibold mb-1 ${
                  isDark ? 'text-cyan-100' : 'text-cyan-700'
                }`}>
                  Looking for an algorithm that's not here?
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-slate-300/70' : 'text-gray-600'
                }`}>
                  Request it from an educator and we'll notify them
                </p>
              </div>
              <Link to="/request">
                <motion.button 
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Request Algorithm</span>
                  <span>→</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {filtered.length} {filtered.length === 1 ? 'algorithm' : 'algorithms'} found
            </p>
          </motion.div>
        )}

        {/* Algorithm Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            className={`text-center py-20 rounded-2xl border ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20'
                : 'bg-white/60 border-cyan-200'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-cyan-400' : 'text-cyan-600'
            }`}>
              No algorithms found
            </p>
            <p className={`text-sm ${
              isDark ? 'text-slate-300/80' : 'text-gray-600'
            }`}>
              Try adjusting your search or category filter
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((algo, i)=> (
              <motion.div 
                key={algo.id} 
                className={`backdrop-blur-md rounded-2xl p-6 border shadow-xl flex flex-col justify-between transition-all duration-300 group ${
                  isDark
                    ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20 hover:border-cyan-400/50'
                    : 'bg-white/60 border-cyan-200 shadow-gray-200/20 hover:border-cyan-300'
                }`}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02,
                  boxShadow: isDark 
                    ? "0 20px 25px -5px rgba(34, 211, 238, 0.15), 0 10px 10px -5px rgba(34, 211, 238, 0.1)"
                    : "0 20px 25px -5px rgba(6, 182, 212, 0.1), 0 10px 10px -5px rgba(6, 182, 212, 0.05)"
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      isDark 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {algo.category}
                    </span>
                    {hasCompleted(algo.id) && (
                      <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                        <span>✓</span>
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {algo.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    isDark ? 'text-slate-300/80' : 'text-gray-600'
                  }`}>
                    {algo.desc}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono ${
                    isDark 
                      ? 'bg-slate-700/50 text-cyan-400' 
                      : 'bg-gray-100 text-cyan-700'
                  }`}>
                    <span className="font-semibold">Complexity:</span>
                    <span>{algo.complexity}</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link to={`/material/${algo.id}`} className="block">
                    <motion.button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-4 py-3 rounded-xl text-sm shadow-lg hover:shadow-cyan-500/50 transition-all duration-200" 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                    >
                      Read Material
                    </motion.button>
                  </Link>
                  <Link to={hasCompleted(algo.id) ? `/visualize/${algo.id}` : `/material/${algo.id}`} className="block">
                    <motion.button 
                      className={`w-full font-semibold px-4 py-3 rounded-xl text-sm shadow-lg transition-all duration-200 ${
                        hasCompleted(algo.id)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/50'
                          : isDark 
                          ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`} 
                      whileHover={{ scale: hasCompleted(algo.id) ? 1.02 : 1 }} 
                      whileTap={{ scale: hasCompleted(algo.id) ? 0.98 : 1 }}
                    >
                      Visualize
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

