import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import About from './components/About'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
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
import RoleRoute from './components/RoleRoute'
import EducatorDashboard from './pages/educator/Dashboard'
import EducatorStudents from './pages/educator/Students'
import EducatorRequests from './pages/educator/Requests'
import EducatorResources from './pages/educator/Resources'
import EducatorStreaks from './pages/educator/Streaks'
import EducatorMessages from './pages/educator/Messages'
import EducatorNotes from './pages/educator/Notes'
import AddAlgorithm from './pages/educator/AddAlgorithm'
import MyAlgorithms from './pages/educator/MyAlgorithms'
import EducatorProfile from './pages/educator/Profile'
import MessagesInbox from './pages/MessagesInbox'
import BubbleSortViz from "./visualizations/BubbleSortViz";
import QuickSortViz from "./visualizations/QuickSortViz";
import MergeSortViz from "./visualizations/MergeSortViz";
import InsertionSortViz from "./visualizations/InsertionSortViz";
import HeapSortViz from "./visualizations/HeapSortViz";
import BinarySearchViz from "./visualizations/BinarySearchViz";
import LinearSearchViz from "./visualizations/LinearSearchViz";
import BFSSearchViz from "./visualizations/BFSSearchViz";
import DFSSearchViz from "./visualizations/DFSSearchViz";
import DijkstraViz from "./visualizations/DijkstraViz";
import RequestAlgorithm from './pages/RequestAlgorithm';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/material/:id" element={<ProtectedRoute><Material /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/messages" element={<RoleRoute role="student"><MessagesInbox /></RoleRoute>} />
            <Route path="/visualize/bubble-sort" element={<BubbleSortViz />} />
            <Route path="/visualize/quick-sort" element={<QuickSortViz />} />
            <Route path="/visualize/merge-sort" element={<MergeSortViz />} />
            <Route path="/visualize/insertion-sort" element={<InsertionSortViz />} />
            <Route path="/visualize/heap-sort" element={<HeapSortViz />} />
            <Route path="/visualize/binary-search" element={<BinarySearchViz />} />
            <Route path="/visualize/linear-search" element={<LinearSearchViz />} />
            <Route path="/visualize/bfs" element={<BFSSearchViz />} />
            <Route path="/visualize/dfs" element={<DFSSearchViz />} />
            <Route path="/visualize/dijkstra" element={<DijkstraViz />} />
            <Route path="/visualize/:id" element={<ProtectedRoute><Visualize /></ProtectedRoute>} />
            <Route path="/request" element={<ProtectedRoute><RequestAlgorithm /></ProtectedRoute>} />
            {/* Educator routes */}
            <Route path="/educator" element={<RoleRoute role="educator"><EducatorDashboard /></RoleRoute>} />
            <Route path="/educator/students" element={<RoleRoute role="educator"><EducatorStudents /></RoleRoute>} />
            <Route path="/educator/requests" element={<RoleRoute role="educator"><EducatorRequests /></RoleRoute>} />
            <Route path="/educator/resources" element={<RoleRoute role="educator"><EducatorResources /></RoleRoute>} />
            <Route path="/educator/streaks" element={<RoleRoute role="educator"><EducatorStreaks /></RoleRoute>} />
            <Route path="/educator/messages" element={<RoleRoute role="educator"><EducatorMessages /></RoleRoute>} />
            <Route path="/educator/notes" element={<RoleRoute role="educator"><EducatorNotes /></RoleRoute>} />
            <Route path="/educator/profile" element={<RoleRoute role="educator"><EducatorProfile /></RoleRoute>} />
            <Route path="/educator/algorithms" element={<RoleRoute role="educator"><MyAlgorithms /></RoleRoute>} />
            <Route path="/educator/algorithms/new" element={<RoleRoute role="educator"><AddAlgorithm /></RoleRoute>} />
            <Route path="/educator/algorithms/edit" element={<RoleRoute role="educator"><AddAlgorithm /></RoleRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  )
}

export default App
