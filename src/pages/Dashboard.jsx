import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard(){
  const { hasCompleted } = useAuth();
  const [query, setQuery] = useState('');
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

  const filtered = useMemo(()=> algorithms.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  ), [query, algorithms]);

  const SkeletonCard = () => (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 animate-pulse">
      <div className="h-4 w-20 bg-slate-700/50 rounded mb-3"></div>
      <div className="h-6 w-3/4 bg-slate-700/50 rounded mb-2"></div>
      <div className="h-4 w-full bg-slate-700/50 rounded mb-1"></div>
      <div className="h-4 w-5/6 bg-slate-700/50 rounded mb-3"></div>
      <div className="h-3 w-32 bg-slate-700/50 rounded mb-6"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-slate-700/50 rounded-xl"></div>
        <div className="h-10 bg-slate-700/50 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <header className="mb-6 sm:mb-8">
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Algorithms
          </motion.h1>
          <motion.p 
            className="text-cyan-100/80 mt-2 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Read the material, then visualize
          </motion.p>
          <motion.div 
            className="mt-4 sm:mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
              placeholder="Search algorithms or categories..." 
              className="w-full sm:w-96 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 text-sm sm:text-base" 
            />
          </motion.div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            className="text-center py-16 sm:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-cyan-400 text-lg sm:text-xl font-semibold mb-2">No algorithms found</p>
            <p className="text-slate-300/80 text-sm sm:text-base">Try adjusting your search query</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((algo, i)=> (
            <motion.div 
              key={algo.id} 
              className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 group"
              initial={{ opacity:0, y:20 }} 
              whileInView={{ opacity:1, y:0 }} 
              viewport={{ once:true, margin: "-50px" }} 
              transition={{ duration:0.4, delay:i*0.05 }}
              whileHover={{ y:-4, scale:1.01, boxShadow: "0 20px 25px -5px rgba(34, 211, 238, 0.1), 0 10px 10px -5px rgba(34, 211, 238, 0.04)" }}
            >
              <div>
                <div className="text-xs sm:text-sm text-cyan-300/70 mb-1 font-medium">{algo.category}</div>
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-white flex-wrap">
                  <span>{algo.title}</span>
                  {hasCompleted(algo.id) && (
                    <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full font-semibold shadow-lg">
                      ✓ Done
                    </span>
                  )}
                </h3>
                <p className="text-slate-300/80 mt-2 text-xs sm:text-sm line-clamp-2">{algo.desc}</p>
                <div className="mt-3 text-xs text-cyan-400/70 font-mono">Complexity: {algo.complexity}</div>
              </div>
              <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                <Link to={`/material/${algo.id}`} className="block">
                  <motion.button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/50 transition-all duration-200" 
                    whileHover={{ scale:1.02 }} 
                    whileTap={{ scale:0.98 }}
                  >
                    Read
                  </motion.button>
                </Link>
                <Link to={hasCompleted(algo.id) ? `/visualize/${algo.id}` : `/material/${algo.id}`} className="block">
                  <motion.button 
                    className={`w-full ${hasCompleted(algo.id)? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600':'bg-slate-700/50 text-slate-400 cursor-not-allowed'} font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all duration-200`} 
                    whileHover={{ scale: hasCompleted(algo.id)?1.02:1 }} 
                    whileTap={{ scale: hasCompleted(algo.id)?0.98:1 }}
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

