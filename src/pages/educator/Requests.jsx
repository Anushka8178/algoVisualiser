import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const statusStyles = {
  pending: 'bg-yellow-400/20 text-yellow-200 border-yellow-200/40',
  in_progress: 'bg-blue-400/20 text-blue-200 border-blue-200/40',
  completed: 'bg-emerald-400/20 text-emerald-200 border-emerald-200/40',
};

export default function Requests(){
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/requests', { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if(res.ok) setRows(data.requests || []);
      else setError(data.error || 'Failed to load');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    fetchRequests();
  }, [token]);

  const markCompleted = async (id) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'completed' }),
      });
      const data = await res.json();
      if(res.ok){
        setRows(prev => prev.map(r => r.id === id ? data.request : r));
      } else {
        setError(data.error || 'Failed to update request');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Student Requests</h1>
        <p className="text-white/80 mt-2">Review requests, build new algorithms, and mark them as completed.</p>
        <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20 divide-y divide-white/10">
          {loading && <div className="p-4">Loading...</div>}
          {error && <div className="p-4 text-red-200">{error}</div>}
          {!loading && !error && !rows.length && <div className="p-4 text-white/80">No requests yet.</div>}
          {rows.map(r => (
            <div key={r.id} className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-base sm:text-lg font-semibold">{r.algorithmSlug}</div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${statusStyles[r.status || 'pending'] || statusStyles.pending}`}>
                    {r.status?.replace('_', ' ') || 'pending'}
                  </span>
                </div>
                <div className="text-white/80 text-sm whitespace-pre-wrap">{r.note || 'No details provided.'}</div>
                <div className="text-xs text-white/70">By {r.student?.username} ({r.student?.email}) • {new Date(r.createdAt).toLocaleString()}</div>
                {r.educatorNotes && (
                  <div className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <strong>Educator notes:</strong> {r.educatorNotes}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    to={`/educator/algorithms/new?slug=${encodeURIComponent(r.algorithmSlug)}`}
                    className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-2 rounded-lg hover:bg-white/30 transition"
                  >
                    Create algorithm for this request
                    <span>↗</span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 min-w-[180px]">
                {r.status !== 'completed' && (
                  <button
                    onClick={() => markCompleted(r.id)}
                    disabled={updatingId === r.id}
                    className="bg-emerald-400/20 border border-emerald-200/50 text-emerald-100 px-3 py-2 rounded-lg hover:bg-emerald-400/30 transition disabled:opacity-60"
                  >
                    {updatingId === r.id ? 'Updating...' : 'Mark Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


