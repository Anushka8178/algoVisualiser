import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: '#e0f7ff', fontFamily: "'Poppins', sans-serif" }}>
      {}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
        style={{ background: '#00ffff' }}
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
        className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-20 blur-3xl"
        style={{ background: '#00ffff' }}
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
      <motion.div
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-15 blur-3xl"
        style={{ background: '#00ffff' }}
        animate={{
          y: [0, -25, 0],
          x: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {}
      <motion.h1
        className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl"
        style={{ color: '#e0f7ff', textShadow: '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Algorithm Visualizer
      </motion.h1>

      {}
      <motion.p
        className="text-lg sm:text-xl md:text-2xl max-w-2xl mb-12 font-medium"
        style={{ color: '#e0f7ff', opacity: 0.95 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        Learn algorithms the interactive way — visualize, play, and master step-by-step!
      </motion.p>

      {}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        {}
        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
        <motion.button
          className="font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 relative"
          style={{
            background: '#e0f7ff',
            color: '#0f2027',
            boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 10px 30px rgba(0, 255, 255, 0.3)",
              "0 10px 40px rgba(0, 255, 255, 0.5)",
              "0 10px 30px rgba(0, 255, 255, 0.3)"
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          Get Started
        </motion.button>
        </Link>

        {}
        <Link to="/login">
          <motion.button
            className="font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: '#e0f7ff'
            }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </Link>

        {}
        <Link to="/about">
          <motion.button
            className="font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: '#e0f7ff'
            }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.button>
        </Link>
      </motion.div>

      {}
      <motion.footer
        className="absolute bottom-10 text-sm"
        style={{ color: '#e0f7ff', opacity: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{
          opacity: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          delay: 1.2
        }}
      >
        © 2025 algoVisualizer
      </motion.footer>
    </div>
  );
}

