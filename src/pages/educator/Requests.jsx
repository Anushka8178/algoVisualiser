import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

const statusStyles = {
  pending: 'bg-yellow-400/20 text-yellow-200 border-yellow-200/40',
  in_progress: 'bg-blue-400/20 text-blue-200 border-blue-200/40',
  completed: 'bg-emerald-400/20 text-emerald-200 border-emerald-200/40',
};

export default function Requests() {
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
    <EducatorLayout
      heading="Algorithm Requests"
      subheading="Review student interest, collaborate on new visualisations, and track completion status at a glance."
      accent="violet"
    >
      <div className="space-y-6">
        <div className="grid gap-4 rounded-3xl border border-white/15 bg-slate-900/50 p-6 shadow-lg shadow-slate-900/30">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Open requests" value={rows.filter((r) => r.status !== 'completed').length} highlight />
            <Stat label="Completed" value={rows.filter((r) => r.status === 'completed').length} />
            <Stat
              label="Awaiting response"
              value={rows.filter((r) => (r.status || 'pending') === 'pending').length}
            />
            <Stat label="Total submitted" value={rows.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-slate-900/30 backdrop-blur">
          {loading && <div className="px-6 py-6 text-slate-100/80">Loading requests…</div>}
          {error && <div className="px-6 py-6 text-rose-200">{error}</div>}
          {!loading && !error && !rows.length && (
            <div className="px-6 py-6 text-slate-200/70">No requests yet — encourage students to submit ideas!</div>
          )}

          {!loading &&
            !error &&
            rows.map((r) => (
              <article
                key={r.id}
                className="flex flex-col gap-5 border-t border-white/5 px-6 py-6 first:border-t-0 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{r.algorithmSlug}</h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[r.status || 'pending'] || statusStyles.pending
                        }`}
                    >
                      {r.status?.replace('_', ' ') || 'pending'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-200/80">{r.note || 'No extra context provided.'}</p>
                  <p className="text-xs text-slate-300/70">
                    Requested by <strong>{r.student?.username}</strong> ({r.student?.email}) on{' '}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  {r.educatorNotes && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-100/80">
                      <strong className="text-slate-100/95">Educator notes:</strong> {r.educatorNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
                    <Link
                      to={`/educator/algorithms/new?slug=${encodeURIComponent(r.algorithmSlug)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-400/20 px-4 py-2 font-medium text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/30"
                    >
                      Create algorithm for this request
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className="flex min-w-[200px] flex-col gap-3">
                  {r.status !== 'completed' && (
                    <button
                      onClick={() => markCompleted(r.id)}
                      disabled={updatingId === r.id}
                      className="rounded-full border border-emerald-200/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:opacity-60"
                    >
                      {updatingId === r.id ? 'Updating…' : 'Mark completed'}
                    </button>
                  )}
                </div>
              </article>
            ))}
        </div>
      </div>
    </EducatorLayout>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 text-slate-100/90 transition ${highlight ? 'border-cyan-300/60 bg-cyan-500/10 shadow shadow-cyan-500/20' : 'border-white/10 bg-white/5'
        }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

