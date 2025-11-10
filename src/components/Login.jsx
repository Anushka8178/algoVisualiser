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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-cyan-500 rounded-full opacity-20 blur-3xl"
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
        className="absolute bottom-20 right-10 w-60 h-60 bg-teal-500 rounded-full opacity-20 blur-3xl"
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
        className="absolute top-6 left-6 text-cyan-300/80 hover:text-cyan-200 transition-colors flex items-center gap-2 z-10"
      >
        <span>←</span> Back to Home
      </Link>

      {/* Login Form */}
      <motion.div
        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 md:p-12 w-full max-w-md border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-center mb-8 text-cyan-100/80"
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
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e=>setForm(f=>({ ...f, email:e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e=>setForm(f=>({ ...f, password:e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {submitting? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-sm text-cyan-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-300 hover:text-cyan-200 underline font-medium">
            Sign up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

