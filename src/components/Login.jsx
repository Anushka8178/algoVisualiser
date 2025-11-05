import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from './ToastProvider';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.email || !form.password){
      showToast('Please enter email and password', 'error');
      return;
    }
    setSubmitting(true);
    const res = await login({ email: form.email, password: form.password });
    setSubmitting(false);
    if(res.success){
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 blur-3xl"
        animate={{ 
          y: [0, 30, 0], 
          x: [0, 20, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-300 rounded-full opacity-30 blur-3xl"
        animate={{ 
          y: [0, -40, 0], 
          x: [0, -15, 0],
          scale: [1, 1.15, 1] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors flex items-center gap-2"
      >
        <span>←</span> Back to Home
      </Link>

      {/* Login Form */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 w-full max-w-md border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-white/80 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Sign in to continue your learning journey
        </motion.p>

        <form className="space-y-6" onSubmit={onSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e=>setForm(f=>({ ...f, email:e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e=>setForm(f=>({ ...f, password:e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {submitting? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:underline font-medium">
            Sign up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

