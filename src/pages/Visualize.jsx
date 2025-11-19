import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AlgorithmNavigator from '../components/AlgorithmNavigator';
import DynamicVisualization from '../components/DynamicVisualization';
import BubbleSortViz from '../visualizations/BubbleSortViz';
import QuickSortViz from '../visualizations/QuickSortViz';
import MergeSortViz from '../visualizations/MergeSortViz';
import InsertionSortViz from '../visualizations/InsertionSortViz';
import HeapSortViz from '../visualizations/HeapSortViz';
import BinarySearchViz from '../visualizations/BinarySearchViz';
import LinearSearchViz from '../visualizations/LinearSearchViz';
import BFSSearchViz from '../visualizations/BFSSearchViz';
import DFSSearchViz from '../visualizations/DFSSearchViz';
import DijkstraViz from '../visualizations/DijkstraViz';

const API_URL = 'http://localhost:5000/api';
const BUILT_IN_ALGOS = [
  'bubble-sort',
  'quick-sort',
  'merge-sort',
  'insertion-sort',
  'heap-sort',
  'binary-search',
  'linear-search',
  'bfs',
  'dfs',
  'dijkstra',
];

export default function Visualize() {
  const { id } = useParams();
  const { hasCompleted } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [algorithm, setAlgorithm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!hasCompleted(id)) return <Navigate to={`/material/${id}`} replace />;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setAlgorithm(null);

    if (BUILT_IN_ALGOS.includes(id)) {
      setLoading(false);
      return undefined;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/algorithms/${id}`);
        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          setAlgorithm(data);
        } else if (res.status === 404) {
          setError('Algorithm not found');
        } else {
          setError('Unable to load visualization data.');
        }
      } catch (err) {
        if (!active) return;
        console.error('Visualization fetch failed:', err);
        setError('Network error while loading visualization.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const useDynamicViz = useMemo(() => {
    return !BUILT_IN_ALGOS.includes(id) && !!algorithm?.visualizationCode;
  }, [id, algorithm]);

  const renderViz = () => {
    if (BUILT_IN_ALGOS.includes(id)) {
      switch (id) {
        case 'bubble-sort': return <BubbleSortViz showNavbar={false} showNavigator={false} />;
        case 'quick-sort': return <QuickSortViz showNavbar={false} showNavigator={false} />;
        case 'merge-sort': return <MergeSortViz showNavbar={false} showNavigator={false} />;
        case 'insertion-sort': return <InsertionSortViz showNavbar={false} showNavigator={false} />;
        case 'heap-sort': return <HeapSortViz showNavbar={false} showNavigator={false} />;
        case 'binary-search': return <BinarySearchViz showNavbar={false} showNavigator={false} />;
        case 'linear-search': return <LinearSearchViz showNavbar={false} showNavigator={false} />;
        case 'bfs': return <BFSSearchViz showNavbar={false} showNavigator={false} />;
        case 'dfs': return <DFSSearchViz showNavbar={false} showNavigator={false} />;
        case 'dijkstra': return <DijkstraViz showNavbar={false} showNavigator={false} />;
        default:
          break;
      }
    }

    if (loading) {
      return (
        <div className={`text-center py-16 text-lg ${isDark ? 'text-cyan-200/80' : 'text-cyan-700/80'}`}>
          Loading visualization…
        </div>
      );
    }

    if (error) {
      return (
        <div className={`text-center py-16 text-lg ${isDark ? 'text-red-300' : 'text-red-600'}`}>
          {error}
        </div>
      );
    }

    if (useDynamicViz) {
      return (
        <DynamicVisualization
          code={algorithm.visualizationCode}
          width={900}
          height={520}
        />
      );
    }

    return (
      <div className={`text-center py-20 ${
        isDark ? 'text-cyan-400' : 'text-cyan-600'
      }`}>
        Visualization not available for this algorithm
      </div>
    );
  };

  const headerTitle = algorithm?.title || formatTitle(id);
  const timeComplexity = algorithm?.complexity || getTimeComplexity(id);
  const spaceComplexity = algorithm?.spaceComplexity || getSpaceComplexity(id);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AlgorithmNavigator currentSlug={id} />
        <motion.header 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            {headerTitle}
          </h1>
          <p className={`text-base sm:text-lg font-medium ${
            isDark ? 'text-cyan-100/80' : 'text-gray-600'
          }`}>Visualize step-by-step execution</p>
        </motion.header>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderViz()}
        </motion.div>

        {(!BUILT_IN_ALGOS.includes(id) || algorithm) && (
          <motion.div 
            className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`backdrop-blur-md rounded-xl p-5 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}>
              <div className={`text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>Time Complexity</div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {timeComplexity || 'Varies'}
              </div>
            </div>
            <div className={`backdrop-blur-md rounded-xl p-5 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}>
              <div className={`text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>Space Complexity</div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {spaceComplexity || 'Varies'}
              </div>
            </div>
            <div className={`backdrop-blur-md rounded-xl p-5 border shadow-xl hover:border-cyan-400/40 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-cyan-500/20 shadow-cyan-900/20'
                : 'bg-white/60 border-cyan-200 shadow-gray-200/20'
            }`}>
              <div className={`text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide ${
                isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'
              }`}>Algorithm</div>
              <div className={`text-lg sm:text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{headerTitle}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function formatTitle(id) {
  if (!id) return '';
  
  const specialCases = {
    'bfs': 'Breadth-First Search',
    'dfs': 'Depth-First Search',
    'dijkstra': "Dijkstra's Algorithm",
    'bubble-sort': 'Bubble Sort',
    'quick-sort': 'Quick Sort',
    'merge-sort': 'Merge Sort',
    'insertion-sort': 'Insertion Sort',
    'heap-sort': 'Heap Sort',
    'binary-search': 'Binary Search',
    'linear-search': 'Linear Search'
  };
  
  if (specialCases[id]) {
    return specialCases[id];
  }
  
  return id
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' ');
}

function getTimeComplexity(id) {
  const complexities = {
    'bubble-sort': 'O(n²)',
    'quick-sort': 'O(n log n)',
    'merge-sort': 'O(n log n)',
    'insertion-sort': 'O(n²)',
    'heap-sort': 'O(n log n)',
    'binary-search': 'O(log n)',
    'linear-search': 'O(n)',
    'bfs': 'O(V + E)',
    'dfs': 'O(V + E)',
    'dijkstra': 'O((V+E) log V)'
  };
  return complexities[id] || 'Varies';
}

function getSpaceComplexity(id) {
  const complexities = {
    'bubble-sort': 'O(1)',
    'quick-sort': 'O(n)',
    'merge-sort': 'O(n)',
    'insertion-sort': 'O(1)',
    'heap-sort': 'O(1)',
    'binary-search': 'O(1)',
    'linear-search': 'O(1)',
    'bfs': 'O(V)',
    'dfs': 'O(V)',
    'dijkstra': 'O(V)'
  };
  return complexities[id] || 'Varies';
}
