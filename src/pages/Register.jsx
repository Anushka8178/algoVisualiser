import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from '../components/ToastProvider';

export default function Register(){
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.email || !form.password){
      showToast('Please fill all required fields', 'error');
      return;
    }
    if(form.password !== form.confirm){
      showToast('Passwords do not match', 'error');
      return;
    }
    setSubmitting(true);
    const res = await register({ name: form.name, email: form.email, password: form.password });
    setSubmitting(false);
    if(res.success){
      showToast('Registration successful. Please login.', 'success');
      navigate('/login');
    } else {
      showToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 text-white/80 hover:text-white">← Back to Home</Link>
      <motion.div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 w-full max-w-md border border-white/20 shadow-2xl"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
        <h1 className="text-4xl font-extrabold mb-2 text-center">Create Account</h1>
        <p className="text-white/80 text-center mb-8">Join and start visualizing algorithms</p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={form.password} onChange={e=>setForm(f=>({ ...f, password:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e=>setForm(f=>({ ...f, confirm:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="••••••••" />
          </div>
          <motion.button disabled={submitting} type="submit" className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300" whileHover={{ scale: submitting?1:1.02 }} whileTap={{ scale: submitting?1:0.98 }}>
            {submitting? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>
        <div className="mt-6 text-center text-sm text-white/80">Already have an account? <Link to="/login" className="text-white underline">Login</Link></div>
      </motion.div>
    </div>
  );
}


