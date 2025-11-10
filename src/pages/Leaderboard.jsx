import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Leaderboard(){
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">Leaderboard</h1>
          <p className="text-cyan-100/80 mt-2">Top performers by streak and engagement</p>
        </header>
        {loading ? (
          <div className="text-center py-20 text-cyan-400">Loading leaderboard...</div>
        ) : (
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-900/20 overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-3 text-sm text-cyan-300/70 border-b border-cyan-500/20 font-semibold">
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">🔥 Streak</div>
              <div className="text-right">📊 Engagement</div>
            </div>
            <div className="divide-y divide-cyan-500/10">
              {leaderboard.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-300/80">No users yet. Be the first!</div>
              ) : (
                leaderboard.map(row => {
                  const isYou = user && row.id === user.id;
                  return (
                    <div key={row.rank} className={`grid grid-cols-4 px-4 py-3 ${isYou ? 'bg-cyan-500/20 font-semibold text-cyan-100' : 'text-slate-200'}`}>
                      <div className="text-cyan-300/90">{medal(row.rank)} {row.rank}</div>
                      <div className={isYou ? 'font-semibold text-cyan-100' : 'text-slate-200'}>{row.username} {isYou && <span className="text-cyan-400">(You)</span>}</div>
                      <div className="text-right text-cyan-300/90">🔥 {row.streak}</div>
                      <div className="text-right text-cyan-300/90">📊 {row.engagement}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function medal(rank){
  if(rank===1) return '🥇';
  if(rank===2) return '🥈';
  if(rank===3) return '🥉';
  return '';
}


