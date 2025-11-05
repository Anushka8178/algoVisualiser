import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 blur-3xl"
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
        className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-300 rounded-full opacity-30 blur-3xl"
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

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-10 text-white/80 hover:text-white transition-colors flex items-center gap-2"
      >
        <span>←</span> Back to Home
      </Link>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-2xl">
            About Algorithm Visualizer
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Making algorithm learning interactive, visual, and fun!
          </p>
        </motion.div>

        {/* Content Cards */}
        <div className="space-y-8">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">🎯 Our Mission</h2>
            <p className="text-white/90 leading-relaxed">
              Algorithm Visualizer is designed to help students and developers understand algorithms 
              through interactive visualization. We believe that seeing algorithms in action makes 
              complex concepts easier to grasp and remember.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">✨ Features</h2>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🧠</span>
                <span><strong>Interactive Learning:</strong> Step through algorithms at your own pace</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <span><strong>Multiple Algorithms:</strong> Sorting, searching, graph algorithms, and more</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <span><strong>Real-time Visualization:</strong> See how data structures change in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎮</span>
                <span><strong>Gamified Experience:</strong> Make learning fun and engaging</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">🚀 Get Started</h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              Ready to start visualizing algorithms? Click the button below to begin your journey!
            </p>
            <Link to="/">
              <motion.button
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Visualizing
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-white/70"
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

