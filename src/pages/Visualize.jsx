import { motion } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Visualize(){
  const { id } = useParams();
  const { hasCompleted } = useAuth();
  if(!hasCompleted(id)) return <Navigate to={`/material/${id}`} replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold drop-shadow">{formatTitle(id)}</h1>
            <p className="text-white/90">Visualize step-by-step execution</p>
          </div>
          <Link to="/dashboard" className="text-white/90 hover:text-white underline">← Back to Dashboard</Link>
        </header>

        {/* Canvas placeholder */}
        <motion.div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 shadow-xl h-72 md:h-96 flex items-center justify-center"
          initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div className="text-white/80">Visualization Canvas (plug D3.js or custom animations here)</div>
        </motion.div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.button className="bg-white text-purple-600 rounded-xl py-3 font-semibold hover:bg-purple-50" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Play</motion.button>
          <motion.button className="bg-white/20 border border-white/30 rounded-xl py-3 font-semibold hover:bg-white/30" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Pause</motion.button>
          <motion.button className="bg-white/20 border border-white/30 rounded-xl py-3 font-semibold hover:bg-white/30" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Step</motion.button>
          <motion.button className="bg-white/20 border border-white/30 rounded-xl py-3 font-semibold hover:bg-white/30" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Reset</motion.button>
        </div>

        {/* Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
            <div className="text-sm text-white/80">Time Complexity</div>
            <div className="text-lg font-semibold">O(n log n)</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
            <div className="text-sm text-white/80">Space Complexity</div>
            <div className="text-lg font-semibold">O(n)</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
            <div className="text-sm text-white/80">Algorithm</div>
            <div className="text-lg font-semibold">{formatTitle(id)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTitle(id){
  if(!id) return '';
  return id.split('-').map(s=> s[0].toUpperCase()+s.slice(1)).join(' ');
}


