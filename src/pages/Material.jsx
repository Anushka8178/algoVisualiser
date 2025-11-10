import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const content = {
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
  }
};

export default function Material(){
  const { id } = useParams();
  const { hasCompleted, completeAlgorithm } = useAuth();
  const navigate = useNavigate();

  const info = content[id] || { title: id, body: 'Learn the core idea, steps, and complexity before visualizing.' };

  console.log('Material page - ID:', id, 'Content found:', !!content[id], 'Title:', info.title);

  const onDone = () => {
    completeAlgorithm(id);
    navigate(`/visualize/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">{info.title} — Material</h1>
          <Link
            to={`/notes/${id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-cyan-500/50"
          >
            <span>📝</span>
            <span>Notes</span>
          </Link>
        </div>
        <motion.div className="mt-6 bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
          <p className="leading-7 text-slate-200">{info.body}</p>
          <ul className="mt-4 list-disc pl-6 text-cyan-100/90 space-y-1">
            <li>Understand the algorithm idea</li>
            <li>Go through step-by-step example</li>
            <li>Review time and space complexity</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link to={`/dashboard`} className="bg-slate-700/50 border border-cyan-500/30 px-4 py-3 rounded-xl hover:bg-slate-700/70 hover:border-cyan-400/50 text-cyan-100 transition-all">Back</Link>
            {!hasCompleted(id) ? (
              <motion.button onClick={onDone} className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-cyan-500/50 transition-all" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                Mark Done → Visualize
              </motion.button>
            ) : (
              <Link to={`/visualize/${id}`} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-cyan-500/50 transition-all">Continue to Visualize</Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

