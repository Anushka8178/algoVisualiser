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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">Explore Algorithms</h1>
          <p className="text-cyan-100/80 mt-2">Read the material, then visualize</p>
          <div className="mt-4">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search algorithms or categories..." className="w-full sm:w-96 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all" />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-cyan-400">Loading algorithms...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((algo, i)=> (
            <motion.div key={algo.id} className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300"
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:i*0.05 }}
              whileHover={{ y:-4, scale:1.01, boxShadow: "0 20px 25px -5px rgba(34, 211, 238, 0.1), 0 10px 10px -5px rgba(34, 211, 238, 0.04)" }}>
              <div>
                <div className="text-sm text-cyan-300/70 mb-1 font-medium">{algo.category}</div>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                  {algo.title}
                  {hasCompleted(algo.id) && <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full font-semibold shadow-lg">✓ Done</span>}
                </h3>
                <p className="text-slate-300/80 mt-2 text-sm">{algo.desc}</p>
                <div className="mt-3 text-xs text-cyan-400/70 font-mono">Complexity: {algo.complexity}</div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link to={`/material/${algo.id}`}>
                  <motion.button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-4 py-3 rounded-xl text-sm shadow-lg hover:shadow-cyan-500/50 transition-all" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                    Read
                  </motion.button>
                </Link>
                <Link to={hasCompleted(algo.id) ? `/visualize/${algo.id}` : `/material/${algo.id}`}>
                  <motion.button className={`w-full ${hasCompleted(algo.id)? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600':'bg-slate-700/50 text-slate-400 cursor-not-allowed'} font-semibold px-4 py-3 rounded-xl text-sm shadow-lg transition-all`} whileHover={{ scale: hasCompleted(algo.id)?1.02:1 }} whileTap={{ scale: hasCompleted(algo.id)?0.98:1 }}>
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

