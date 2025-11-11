import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
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

  const filteredAlgorithms = algorithms.filter(algo =>
    algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algo.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold drop-shadow">My Algorithms</h1>
            <p className="text-white/90 mt-2">Manage and edit your published algorithms</p>
          </div>
          <Link
            to="/educator/algorithms/new"
            className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition shadow-lg"
          >
            + Add New Algorithm
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search algorithms..."
            className="w-full sm:w-96 px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {loading && (
          <div className="text-center py-20 text-white/80">Loading algorithms...</div>
        )}

        {error && (
          <div className="text-center py-20 text-red-200">{error}</div>
        )}

        {!loading && !error && (
          <>
            {filteredAlgorithms.length === 0 ? (
              <div className="text-center py-20 text-white/80">
                {searchQuery ? 'No algorithms match your search.' : 'No algorithms published yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlgorithms.map((algo, index) => (
                  <motion.div
                    key={algo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-[1.02] transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{algo.title}</h3>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {algo.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {algo.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <span>Complexity: {algo.complexity}</span>
                      <span>Slug: {algo.slug}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/educator/algorithms/edit?slug=${algo.slug}`}
                          className="flex-1 bg-white text-purple-700 px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 transition text-center text-xs"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/material/${algo.slug}`}
                          target="_blank"
                          className="flex-1 bg-white/20 text-white px-3 py-2 rounded-lg font-semibold hover:bg-white/30 transition text-center text-xs"
                        >
                          View
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDelete(algo)}
                        disabled={deletingId === algo.id}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition text-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === algo.id ? 'Deleting...' : 'Delete Algorithm'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

