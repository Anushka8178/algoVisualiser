import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const algorithms = [
  { id:'bubble-sort', title:'Bubble Sort', category:'Sorting', desc:'Simple comparison sort', complexity:'O(n^2)' },
  { id:'quick-sort', title:'Quick Sort', category:'Sorting', desc:'Divide and conquer sort', complexity:'O(n log n)' },
  { id:'binary-search', title:'Binary Search', category:'Searching', desc:'Search in sorted array', complexity:'O(log n)' },
  { id:'bfs', title:'Breadth-First Search', category:'Graph', desc:'Layer-by-layer traversal', complexity:'O(V+E)' },
  { id:'dfs', title:'Depth-First Search', category:'Graph', desc:'Depth traversal', complexity:'O(V+E)' },
];

export default function Dashboard(){
  const { progress, hasCompleted } = useAuth();
  const [query, setQuery] = useState('');
  const filtered = useMemo(()=> algorithms.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold drop-shadow">Explore Algorithms</h1>
          <p className="text-white/90">Read the material, then visualize</p>
          <div className="mt-4">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search algorithms or categories..." className="w-full sm:w-96 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((algo, i)=> (
            <motion.div key={algo.id} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col justify-between"
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:i*0.05 }}
              whileHover={{ y:-4, scale:1.01 }}>
              <div>
                <div className="text-sm text-white/80 mb-1">{algo.category}</div>
                <h3 className="text-xl font-semibold flex items-center gap-2">{algo.title}
                  {hasCompleted(algo.id) && <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">Done</span>}
                </h3>
                <p className="text-white/85 mt-2 text-sm">{algo.desc}</p>
                <div className="mt-3 text-xs text-white/70">Complexity: {algo.complexity}</div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link to={`/material/${algo.id}`}>
                  <motion.button className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                    Read
                  </motion.button>
                </Link>
                <Link to={hasCompleted(algo.id) ? `/visualize/${algo.id}` : `/material/${algo.id}`}>
                  <motion.button className={`w-full ${hasCompleted(algo.id)? 'bg-white text-purple-600 hover:bg-purple-50':'bg-white/20 text-white/90 cursor-not-allowed'} font-semibold px-4 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl`} whileHover={{ scale: hasCompleted(algo.id)?1.02:1 }} whileTap={{ scale: hasCompleted(algo.id)?0.98:1 }}>
                    Visualize
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


