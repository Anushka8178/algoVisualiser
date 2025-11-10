import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-cyan-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-60 h-60 bg-teal-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 text-cyan-300/80 hover:text-cyan-200 transition-colors flex items-center gap-2"
      >
        <span>←</span> Back to Home
      </Link>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
            About Algorithm Visualizer
          </h1>
          <p className="text-xl text-cyan-100/80 max-w-2xl mx-auto">
            Making algorithm learning interactive, visual, and fun!
          </p>
        </motion.div>

        {}
        <div className="space-y-8">
          <motion.div
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">🎯 Our Mission</h2>
            <p className="text-slate-200 leading-relaxed">
              Algorithm Visualizer is designed to help students and developers understand algorithms
              through interactive visualization. We believe that seeing algorithms in action makes
              complex concepts easier to grasp and remember.
            </p>
          </motion.div>

          <motion.div
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">✨ Features</h2>
            <ul className="space-y-3 text-slate-200">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🧠</span>
                <span><strong className="text-cyan-300">Interactive Learning:</strong> Step through algorithms at your own pace</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <span><strong className="text-cyan-300">Multiple Algorithms:</strong> Sorting, searching, graph algorithms, and more</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <span><strong className="text-cyan-300">Real-time Visualization:</strong> See how data structures change in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎮</span>
                <span><strong className="text-cyan-300">Gamified Experience:</strong> Make learning fun and engaging</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">🚀 Get Started</h2>
            <p className="text-slate-200 mb-6 leading-relaxed">
              Ready to start visualizing algorithms? Click the button below to begin your journey!
            </p>
            <Link to="/">
              <motion.button
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Visualizing
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {}
        <motion.div
          className="mt-16 text-center text-slate-300/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>© 2025 Algorithm Visualizer Team</p>
        </motion.div>
      </div>
    </div>
  );
}

