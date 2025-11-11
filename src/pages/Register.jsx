import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from '../components/ToastProvider';

export default function Register(){
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'educator' ? 'educator' : 'student';
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [role, setRole] = useState(defaultRole);
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
    const res = await register({ name: form.name, email: form.email, password: form.password, role });
    setSubmitting(false);
    if(res.success){
      showToast('Registration successful. Please login.', 'success');
      navigate('/login');
    } else {
      showToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 text-cyan-300/80 hover:text-cyan-200 transition-colors">← Back to Home</Link>
      <motion.div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 md:p-12 w-full max-w-md border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
        <h1 className="text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-cyan-100/80 text-center mb-8">Join and start visualizing algorithms</p>
        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={()=>setRole('student')}
            className={`px-4 py-2 rounded-full border transition ${role==='student' ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/40' : 'bg-slate-800/60 text-cyan-200 border-cyan-500/30 hover:bg-slate-700/60'}`}
          >
            I’m a Student
          </button>
          <button
            type="button"
            onClick={()=>setRole('educator')}
            className={`px-4 py-2 rounded-full border transition ${role==='educator' ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/40' : 'bg-slate-800/60 text-cyan-200 border-cyan-500/30 hover:bg-slate-700/60'}`}
          >
            I’m an Educator
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Email</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Password</label>
            <input type="password" value={form.password} onChange={e=>setForm(f=>({ ...f, password:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e=>setForm(f=>({ ...f, confirm:e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200" placeholder="••••••••" />
          </div>
          <motion.button disabled={submitting} type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50" whileHover={{ scale: submitting?1:1.02 }} whileTap={{ scale: submitting?1:0.98 }}>
            {submitting? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>
        <div className="mt-6 text-center text-sm text-cyan-100/80">Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200 underline">Login</Link></div>
      </motion.div>
    </div>
  );
}

