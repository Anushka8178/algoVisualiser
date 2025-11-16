import { useState, useEffect, useMemo } from 'react';
import EducatorLayout from '../../components/EducatorLayout';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastProvider';

export default function MyAlgorithms() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchAlgorithms = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/algorithms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAlgorithms(data);
      } else {
        setError('Failed to load algorithms');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlgorithms();
  }, [token]);

  const filteredAlgorithms = useMemo(
    () =>
      algorithms.filter(
        (algo) =>
          algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          algo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          algo.slug.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [algorithms, searchQuery],
  );

  const handleDelete = async (algorithm) => {
    if (!window.confirm(`Are you sure you want to delete "${algorithm.title}"?\n\nThis action cannot be undone and will also delete all associated resources, progress records, and notes.`)) {
      return;
    }

    setDeletingId(algorithm.id);
    try {
      const res = await fetch(`http://localhost:5000/api/algorithms/${algorithm.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast('Algorithm deleted successfully', 'success');
        // Refresh the list
        await fetchAlgorithms();
      } else {
        showToast(data.error || 'Failed to delete algorithm', 'error');
      }
    } catch (err) {
      showToast('Error deleting algorithm', 'error');
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <EducatorLayout
      heading="My Algorithms"
      subheading="All algorithms you have published live here. Edit content, refine visualisations, or prune outdated entries."
      accent="teal"
    >
      <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, or slug"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 sm:w-72"
          />
        </div>
        <Link
          to="/educator/algorithms/new"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-500/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/80 hover:bg-cyan-500/30"
        >
          + Add new algorithm
        </Link>
      </div>

      {loading && <div className="rounded-3xl border border-white/10 bg-white/5 py-16 text-center text-slate-100/80">Loading algorithms…</div>}
      {error && <div className="rounded-3xl border border-rose-400/40 bg-rose-500/15 py-16 text-center text-rose-100">{error}</div>}

      {!loading && !error && (
        <>
          {filteredAlgorithms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 py-16 text-center text-slate-200/70">
              {searchQuery ? 'No algorithms match that search.' : 'No algorithms published yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAlgorithms.map((algo, index) => (
                <motion.article
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-slate-900/30 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-200/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{algo.title}</h3>
                        <span className="mt-1 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                          {algo.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200/80 line-clamp-3">{algo.description}</p>
                    <dl className="flex flex-wrap gap-3 text-xs text-slate-200/70">
                      <div className="rounded-full bg-white/5 px-3 py-1">Complexity: {algo.complexity}</div>
                      <div className="rounded-full bg-white/5 px-3 py-1">Slug: {algo.slug}</div>
                    </dl>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex gap-2 text-xs font-semibold">
                      <Link
                        to={`/educator/algorithms/edit?slug=${algo.slug}`}
                        className="flex-1 rounded-full border border-cyan-300/60 bg-cyan-500/25 px-4 py-2 text-center text-cyan-50 transition hover:border-cyan-200/80 hover:bg-cyan-500/30"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/material/${algo.slug}`}
                        target="_blank"
                        className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center text-white transition hover:border-white/30 hover:bg-white/15"
                      >
                        Preview material
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(algo)}
                      disabled={deletingId === algo.id}
                      className="w-full rounded-full border border-rose-400/50 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:opacity-60"
                    >
                      {deletingId === algo.id ? 'Deleting…' : 'Delete algorithm'}
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </>
      )}
    </EducatorLayout>
  );
}

