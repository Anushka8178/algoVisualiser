import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import About from './components/About'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Visualize from './pages/Visualize'
import Notes from './pages/Notes'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Material from './pages/Material'
import NotFound from './components/NotFound'
import { ToastProvider } from './components/ToastProvider'
import BubbleSortViz from "./visualizations/BubbleSortViz";
import QuickSortViz from "./visualizations/QuickSortViz";
import MergeSortViz from "./visualizations/MergeSortViz";
import InsertionSortViz from "./visualizations/InsertionSortViz";
import BinarySearchViz from "./visualizations/BinarySearchViz";
import LinearSearchViz from "./visualizations/LinearSearchViz";
import BFSSearchViz from "./visualizations/BFSSearchViz";
import DFSSearchViz from "./visualizations/DFSSearchViz";
import DijkstraViz from "./visualizations/DijkstraViz";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/material/:id" element={<ProtectedRoute><Material /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/visualize/bubble-sort" element={<BubbleSortViz />} />
            <Route path="/visualize/quick-sort" element={<QuickSortViz />} />
            <Route path="/visualize/merge-sort" element={<MergeSortViz />} />
            <Route path="/visualize/insertion-sort" element={<InsertionSortViz />} />
            <Route path="/visualize/binary-search" element={<BinarySearchViz />} />
            <Route path="/visualize/linear-search" element={<LinearSearchViz />} />
            <Route path="/visualize/bfs" element={<BFSSearchViz />} />
            <Route path="/visualize/dfs" element={<DFSSearchViz />} />
            <Route path="/visualize/dijkstra" element={<DijkstraViz />} />
            <Route path="/visualize/:id" element={<ProtectedRoute><Visualize /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
