import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, userStats } = useAuth();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30 text-white shadow-lg shadow-cyan-900/10">
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white font-extrabold grid place-items-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-400/70 transition-all">A</span>
        <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Algo Visualizer</span>
      </Link>

      <nav className="hidden sm:flex items-center gap-4 text-cyan-100/90">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'text-cyan-400 border-b-2 border-cyan-400 pb-1': 'hover:text-cyan-300 transition-colors'}>Dashboard</NavLink>
        <NavLink to="/leaderboard" className={({isActive})=> isActive? 'text-cyan-400 border-b-2 border-cyan-400 pb-1': 'hover:text-cyan-300 transition-colors'}>Leaderboard</NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'text-cyan-400 border-b-2 border-cyan-400 pb-1': 'hover:text-cyan-300 transition-colors'}>Profile</NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm bg-slate-800/50 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-200">
          <span>🔥</span>
          <span>{userStats?.streak ?? 0} day streak</span>
        </div>
        <button onClick={logout} className="text-sm bg-slate-700/50 hover:bg-slate-700/70 px-3 py-1 rounded-md border border-cyan-500/30 text-cyan-100 hover:border-cyan-400/50 transition-all">Logout</button>
      </div>
    </header>
  );
}


