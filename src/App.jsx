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
            <Route path="/visualize/:id" element={<ProtectedRoute><Visualize /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
