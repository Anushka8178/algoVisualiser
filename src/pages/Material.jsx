import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastProvider';

const API_BASE = 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;

const fallbackContent = {
  'bubble-sort': {
    title: 'Bubble Sort',
    body: 'Bubble sort repeatedly swaps adjacent elements if they are in the wrong order. It is simple but inefficient for large datasets. The algorithm performs multiple passes and each pass pushes the largest remaining element to the end.'
  },
  'quick-sort': {
    title: 'Quick Sort',
    body: 'Quick sort is a divide-and-conquer algorithm. It picks a pivot and partitions the array such that elements less than pivot go left and greater go right, then recursively sorts partitions.'
  },
  'binary-search': {
    title: 'Binary Search',
    body: 'Binary search halves the search space each step by comparing the target to the middle element in a sorted array.'
  },
  'linear-search': {
    title: 'Linear Search',
    body: 'Linear search sequentially checks each element in the array from start to end until the target is found or the array is exhausted. It works on both sorted and unsorted arrays, making it simple but less efficient than binary search for large sorted datasets. Time complexity is O(n) in the worst case and O(1) in the best case (when the target is at the first position), with O(1) space complexity.'
  },
  'bfs': {
    title: 'Breadth-First Search',
    body: 'BFS explores neighbors first, then moves to the next level. Useful for shortest paths in unweighted graphs.'
  },
  'dfs': {
    title: 'Depth-First Search',
    body: 'DFS explores as far as possible along each branch before backtracking. It uses a stack (explicit or recursion).' 
  },
  'dijkstra': {
    title: "Dijkstra's Algorithm",
    body: "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue to greedily select the nearest unvisited node at each step."
  },
  'merge-sort': {
    title: 'Merge Sort',
    body: 'Merge sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves. It has stable O(n log n) time complexity and O(n) space complexity.'
  },
  'insertion-sort': {
    title: 'Insertion Sort',
    body: 'Insertion sort builds a sorted array one element at a time by taking each element and inserting it into its correct position in the already sorted portion. It is efficient for small datasets and nearly sorted arrays. Time complexity is O(n²) in the worst case and O(n) for nearly sorted arrays, with O(1) space complexity.'
  },
  'heap-sort': {
    title: 'Heap Sort',
    body: 'Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end of the sorted portion. Heap sort has a guaranteed O(n log n) time complexity in all cases and O(1) space complexity, making it efficient and stable in performance.'
  }
};

export default function Material(){
  const { id } = useParams();
  const { hasCompleted, completeAlgorithm } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [marking, setMarking] = useState(false);
  const [algorithm, setAlgorithm] = useState(null);
  const [algorithmLoading, setAlgorithmLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setAlgorithmLoading(true);

    (async () => {
      try {
        const res = await fetch(`${API_URL}/algorithms/${id}`);
        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          setAlgorithm(data);
        } else {
          setAlgorithm(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Algorithm fetch failed:', error);
          showToast('Unable to load material details right now.', 'error');
        }
      } finally {
        if (isMounted) setAlgorithmLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, showToast]);

  useEffect(() => {
    let active = true;
    setResourceLoading(true);

    (async () => {
      try {
        const res = await fetch(`${API_URL}/algorithms/${id}/resources`);
        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          setResources(Array.isArray(data.resources) ? data.resources : []);
        } else {
          setResources([]);
        }
      } catch (error) {
        if (active) {
          console.error('Resource fetch failed:', error);
          showToast('Unable to load educator resources right now.', 'error');
        }
      } finally {
        if (active) setResourceLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, showToast]);
  
  const info = useMemo(() => {
    if (algorithm) {
      const body = (algorithm.material && algorithm.material.trim()) || algorithm.description || 'Learn the core idea, steps, and complexity before visualizing.';
      return { title: algorithm.title, body };
    }
    return fallbackContent[id] || { title: id, body: 'Learn the core idea, steps, and complexity before visualizing.' };
  }, [algorithm, id]);
  
  console.log('Material page - ID:', id, 'Title:', info.title, 'Algorithm loaded:', !!algorithm);

  const onDone = async () => {
    if (marking) return;
    setMarking(true);
    const { success, message } = await completeAlgorithm(id);
    setMarking(false);

    if (success) {
      showToast('Marked as completed! Visualization unlocked.', 'success');
      navigate(`/visualize/${id}`);
    } else {
      showToast(message || 'Could not track progress. Please try again.', 'error');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            {info.title} — Material
          </h1>
          <Link
            to={`/notes/${id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2.5 rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 active:scale-95 text-sm sm:text-base"
          >
            <span>📝</span>
            <span>Notes</span>
          </Link>
        </motion.div>
        <motion.div 
          className={`backdrop-blur-md rounded-2xl p-5 sm:p-6 lg:p-8 border shadow-xl ${
            isDark
              ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
              : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
          }`}
          initial={{ opacity:0, y:10 }} 
          animate={{ opacity:1, y:0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className={`leading-7 sm:leading-8 text-sm sm:text-base ${
            isDark ? 'text-slate-200' : 'text-gray-700'
          }`}>{info.body}</p>
          {algorithm && algorithm.material && (
            <p className={`mt-4 text-xs uppercase tracking-wide ${isDark ? 'text-cyan-200/70' : 'text-cyan-700/70'}`}>
              Custom material provided by your educator
            </p>
          )}
          <ul className={`mt-4 sm:mt-6 list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base ${
            isDark ? 'text-cyan-100/90' : 'text-cyan-700'
          }`}>
            <li>Understand the algorithm idea</li>
            <li>Go through step-by-step example</li>
            <li>Review time and space complexity</li>
          </ul>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <Link 
              to={`/dashboard`} 
              className={`border px-4 py-3 rounded-xl transition-all duration-200 text-center active:scale-95 ${
                isDark
                  ? 'bg-slate-700/50 border-cyan-500/30 hover:bg-slate-700/70 hover:border-cyan-400/50 text-cyan-100'
                  : 'bg-gray-200 border-gray-300 hover:bg-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              Back
            </Link>
            {!hasCompleted(id) ? (
              <motion.button 
                onClick={onDone} 
                disabled={marking}
                className={`bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 ${
                  marking ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-teal-600'
                }`} 
                whileHover={{ scale:1.02 }} 
                whileTap={{ scale:0.98 }}
              >
                {marking ? 'Saving...' : 'Mark Done → Visualize'}
              </motion.button>
            ) : (
              <Link 
                to={`/visualize/${id}`} 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 text-center active:scale-95"
              >
                Continue to Visualize
              </Link>
            )}
          </div>
        </motion.div>
        <motion.section
          className={`mt-10 rounded-2xl border p-5 sm:p-6 lg:p-8 ${
            isDark
              ? 'border-cyan-500/20 bg-slate-900/40 shadow-lg shadow-cyan-900/20'
              : 'border-cyan-200 bg-white/70 shadow-lg shadow-cyan-200/30'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-cyan-400">Educator Resources</h2>
              <p className={`text-sm ${isDark ? 'text-cyan-100/70' : 'text-cyan-800/80'}`}>
                Extra reading, links, and files supplied by your educator team.
              </p>
            </div>
            {resourceLoading && (
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-cyan-200/70' : 'text-cyan-700/70'}`}>
                Loading…
              </span>
            )}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {!resourceLoading && resources.length === 0 && (
              <p className={`text-sm ${isDark ? 'text-slate-300/80' : 'text-gray-600'}`}>
                No educator resources have been added yet. Check back later!
              </p>
            )}
            {resources.map((resource) => (
              <article
                key={resource.id}
                className={`rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                  isDark
                    ? 'border-white/10 bg-slate-900/60 hover:border-cyan-400/40'
                    : 'border-cyan-100 bg-white hover:border-cyan-300'
                }`}
              >
                <header className="mb-2">
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-cyan-200/70' : 'text-cyan-700/80'}`}>
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {resource.title || `${info.title} resource`}
                  </h3>
                </header>
                {resource.content && (
                  <p className={`text-sm leading-6 ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {resource.content}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-4 py-2 ${
                        isDark ? 'text-cyan-100 hover:bg-cyan-500/10' : 'text-cyan-700 hover:bg-cyan-50'
                      }`}
                    >
                      Visit link
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5L21 3m0 0h-6m6 0v6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.5V21h-7.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21H3v-7.5" />
                      </svg>
                    </a>
                  )}
                  {resource.filePath && (
                    <a
                      href={`${API_BASE}${resource.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-4 py-2 ${
                        isDark ? 'text-cyan-100 hover:bg-cyan-500/10' : 'text-cyan-700 hover:bg-cyan-50'
                      }`}
                    >
                      Download file
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10l5 5 5-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15V3" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

