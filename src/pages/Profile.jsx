import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Profile(){
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const statsResponse = await fetch(`${API_URL}/progress/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        const historyResponse = await fetch(`${API_URL}/progress/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center py-20 text-cyan-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center py-20 text-slate-300">Please log in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">Your Profile</h1>
          <p className="text-cyan-100/80 mt-2">Track your progress and learning journey</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white grid place-items-center text-2xl font-bold">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="mt-3 text-xl font-semibold text-white">{user.username}</div>
            <div className="text-slate-300/80">{user.email}</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
            <div className="text-sm text-cyan-300/70 mb-2">Streak</div>
            <div className="text-3xl font-bold text-cyan-400">🔥 {stats?.streak || 0} days</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
            <div className="text-sm text-cyan-300/70 mb-2">Algorithms Completed</div>
            <div className="text-3xl font-bold text-cyan-400">{stats?.algorithmsCompleted || 0}</div>
            <div className="text-sm text-slate-300/60 mt-2">Total Engagement: {stats?.totalEngagement || 0}</div>
          </div>
        </div>
        <div className="mt-6 bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20">
          <div className="text-lg font-semibold mb-4 text-cyan-300/90">Recent Activity</div>
          {history.length === 0 ? (
            <div className="text-slate-300/80">No activity yet. Start learning algorithms!</div>
          ) : (
            <ul className="space-y-2">
              {history.map((activity, idx) => (
                <li key={idx} className="text-slate-200 flex items-center gap-2 py-2 border-b border-cyan-500/10 last:border-0">
                  <span className="text-cyan-400">
                    {activity.activityType === 'completed' && '✅'}
                    {activity.activityType === 'viewed' && '👁️'}
                    {activity.activityType === 'note_created' && '📝'}
                  </span>
                  <span className="flex-1">
                    {activity.Algorithm ? activity.Algorithm.title : 'Unknown Algorithm'}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

