import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import AlgorithmNavigator from '../components/AlgorithmNavigator';
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

export default function Visualize() {
  const { id } = useParams();
  const { hasCompleted } = useAuth();
  if (!hasCompleted(id)) return <Navigate to={`/material/${id}`} replace />;

  const renderViz = () => {
    switch(id) {
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
      default: return <div className="text-center py-20 text-cyan-400">Visualization not available for this algorithm</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
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
            {formatTitle(id)}
          </h1>
          <p className="text-base sm:text-lg font-medium text-cyan-100/80">Visualize step-by-step execution</p>
        </motion.header>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderViz()}
        </motion.div>

        {!['bubble-sort', 'insertion-sort', 'heap-sort', 'merge-sort', 'quick-sort', 'binary-search', 'linear-search', 'bfs', 'dfs', 'dijkstra'].includes(id) && (
          <motion.div 
            className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide text-cyan-300/70">Time Complexity</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                {getTimeComplexity(id)}
              </div>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide text-cyan-300/70">Space Complexity</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                {getSpaceComplexity(id)}
              </div>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide text-cyan-300/70">Algorithm</div>
              <div className="text-lg sm:text-xl font-bold text-white">{formatTitle(id)}</div>
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
