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
  'bfs': {
    title: 'Breadth-First Search',
    body: 'BFS explores neighbors first, then moves to the next level. Useful for shortest paths in unweighted graphs.'
  },
  'dfs': {
    title: 'Depth-First Search',
    body: 'DFS explores as far as possible along each branch before backtracking. It uses a stack (explicit or recursion).' 
  }
};

export default function Material(){
  const { id } = useParams();
  const { hasCompleted, completeAlgorithm } = useAuth();
  const navigate = useNavigate();
  const info = content[id] || { title: id, body: 'Learn the core idea, steps, and complexity before visualizing.' };

  const onDone = () => {
    completeAlgorithm(id);
    navigate(`/visualize/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold drop-shadow">{info.title} — Material</h1>
          <Link to={`/notes/${id}`} className="text-white/90 hover:text-white underline">📝 Notes</Link>
        </div>
        <motion.div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 shadow-xl"
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
          <p className="leading-7 text-white/95">{info.body}</p>
          <ul className="mt-4 list-disc pl-6 text-white/90 space-y-1">
            <li>Understand the algorithm idea</li>
            <li>Go through step-by-step example</li>
            <li>Review time and space complexity</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link to={`/dashboard`} className="bg-white/20 border border-white/30 px-4 py-3 rounded-xl hover:bg-white/30">Back</Link>
            {!hasCompleted(id) ? (
              <motion.button onClick={onDone} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                Mark Done → Visualize
              </motion.button>
            ) : (
              <Link to={`/visualize/${id}`} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50">Continue to Visualize</Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


