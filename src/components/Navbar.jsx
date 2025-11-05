import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, progress } = useAuth();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white/10 backdrop-blur border-b border-white/20 text-white">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="inline-block w-8 h-8 rounded-lg bg-white text-purple-600 font-extrabold grid place-items-center">A</span>
        <span className="text-lg font-bold">Algo Visualizer</span>
      </Link>

      <nav className="hidden sm:flex items-center gap-4 text-white/90">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'text-white': 'hover:text-white'}>Dashboard</NavLink>
        <NavLink to="/leaderboard" className={({isActive})=> isActive? 'text-white': 'hover:text-white'}>Leaderboard</NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'text-white': 'hover:text-white'}>Profile</NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
          <span>🔥</span>
          <span>{progress?.streak ?? 0} day streak</span>
        </div>
        <button onClick={logout} className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md border border-white/30">Logout</button>
      </div>
    </header>
  );
}


