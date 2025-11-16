import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

export default function Streaks() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState('streak');

  useEffect(() => {
    (async () => {
      const res = await fetch('http://localhost:5000/api/educator/streaks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRows(data.students || []);
      }
    })();
  }, [token]);

  const sortedRows = useMemo(() => {
    if (sortBy === 'streak') {
      return [...rows].sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0));
    }
    return [...rows].sort((a, b) => (b.totalEngagement ?? 0) - (a.totalEngagement ?? 0));
  }, [rows, sortBy]);

  return (
    <EducatorLayout
      heading="Learning Streak Radar"
      subheading="See who is on fire and who might need an extra nudge. Educators stay off the leaderboard by design."
      accent="teal"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-300/80">
          <span>Sort by</span>
          <button
            onClick={() => setSortBy('streak')}
            className={`rounded-full px-4 py-2 ${sortBy === 'streak' ? 'bg-cyan-500/25 text-white shadow shadow-cyan-500/30' : 'bg-white/5 text-slate-200/80 hover:bg-white/10'
              }`}
          >
            Longest streak
          </button>
          <button
            onClick={() => setSortBy('engagement')}
            className={`rounded-full px-4 py-2 ${sortBy === 'engagement' ? 'bg-cyan-500/25 text-white shadow shadow-cyan-500/30' : 'bg-white/5 text-slate-200/80 hover:bg-white/10'
              }`}
          >
            Engagement score
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-lg shadow-slate-900/25">
          <div className="grid grid-cols-[1fr,140px,160px] items-center border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-300/70">
            <span>Learner</span>
            <span className="text-center">Streak</span>
            <span className="text-center">Engagement</span>
          </div>

          <div className="divide-y divide-white/5">
            {sortedRows.length === 0 && (
              <div className="px-6 py-6 text-sm text-slate-200/70">No streak data yet.</div>
            )}
            {sortedRows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr,140px,160px] items-center px-6 py-5 text-sm text-slate-100/90 transition hover:bg-white/5"
              >
                <div className="font-medium text-white">{row.username}</div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-semibold text-orange-100">
                    🔥 {row.streak ?? 0} days
                  </span>
                </div>
                <div className="text-center text-slate-200/80">{row.totalEngagement ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EducatorLayout>
  );
}


