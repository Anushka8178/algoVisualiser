import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, userStats } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30 text-white shadow-lg shadow-cyan-900/10 sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white font-extrabold grid place-items-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-400/70 transition-all duration-300">A</span>
        <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Algo Visualizer</span>
      </Link>

      <nav className="hidden sm:flex items-center gap-4 text-cyan-100/90">
        <NavLink 
          to="/dashboard" 
          className={({isActive})=> `px-3 py-2 rounded-lg transition-all duration-200 ${isActive? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30': 'hover:text-cyan-300 hover:bg-slate-800/50'}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/leaderboard" 
          className={({isActive})=> `px-3 py-2 rounded-lg transition-all duration-200 ${isActive? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30': 'hover:text-cyan-300 hover:bg-slate-800/50'}`}
        >
          Leaderboard
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({isActive})=> `px-3 py-2 rounded-lg transition-all duration-200 ${isActive? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30': 'hover:text-cyan-300 hover:bg-slate-800/50'}`}
        >
          Profile
        </NavLink>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm bg-slate-800/50 px-3 py-1.5 rounded-full border border-cyan-500/30 text-cyan-200">
          <span>🔥</span>
          <span>{userStats?.streak ?? 0} day streak</span>
        </div>
        <button 
          onClick={logout} 
          className="hidden sm:block text-sm bg-slate-700/50 hover:bg-slate-700/70 px-3 py-1.5 rounded-md border border-cyan-500/30 text-cyan-100 hover:border-cyan-400/50 transition-all duration-200 active:scale-95"
        >
          Logout
        </button>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 active:scale-95"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/30 sm:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30' : 'text-cyan-100 hover:bg-slate-800/50'}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30' : 'text-cyan-100 hover:bg-slate-800/50'}`}
              >
                Leaderboard
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30' : 'text-cyan-100 hover:bg-slate-800/50'}`}
              >
                Profile
              </NavLink>
              <div className="flex items-center gap-2 text-sm bg-slate-800/50 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-200 mt-2">
                <span>🔥</span>
                <span>{userStats?.streak ?? 0} day streak</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-sm bg-slate-700/50 hover:bg-slate-700/70 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-100 hover:border-cyan-400/50 transition-all duration-200 text-left"
              >
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

