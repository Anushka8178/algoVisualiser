import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from '../components/ToastProvider';

const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return 'Name can only contain letters and spaces';
  }
  if (name !== trimmed) {
    return 'Name cannot have leading or trailing spaces';
  }
  return null;
};

const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  if (/\s/.test(email)) {
    return 'Email cannot contain spaces';
  }
  if (!email.includes('@')) {
    return 'Email must contain @';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address (e.g., user@domain.com)';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password does not meet all requirements';
  }
  return null;
};

export default function Register(){
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'educator' ? 'educator' : 'student';
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [errors, setErrors] = useState({ name:'', email:'', password:'', confirm:'' });
  const [touched, setTouched] = useState({ name:false, email:false, password:false, confirm:false });
  const [role, setRole] = useState(defaultRole);
  const [submitting, setSubmitting] = useState(false);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    if (field === 'name') {
      error = validateName(value) || '';
    } else if (field === 'email') {
      error = validateEmail(value) || '';
    } else if (field === 'password') {
      error = validatePassword(value) || '';
    } else if (field === 'confirm') {
      if (!value) {
        error = 'Please confirm your password';
      } else if (value !== form.password) {
        error = 'Passwords do not match';
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
      if (field === 'password' && touched.confirm) {
        validateField('confirm', form.confirm);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ name: true, email: true, password: true, confirm: true });
    
    const nameValid = validateField('name', form.name);
    const emailValid = validateField('email', form.email);
    const passwordValid = validateField('password', form.password);
    const confirmValid = validateField('confirm', form.confirm);

    if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    if(form.password !== form.confirm){
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    const res = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, role });
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
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Name <span className="text-red-400">*</span>
            </label>
            <input 
              value={form.name} 
              onChange={e=>handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.name && errors.name
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`} 
              placeholder="Your name" 
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
            {touched.name && !errors.name && form.name && (
              <p className="mt-1 text-xs text-green-400">✓ Valid name</p>
            )}
            {!touched.name && (
              <p className="mt-1 text-xs text-cyan-300/60">Only letters and spaces, min 2 characters</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Email <span className="text-red-400">*</span>
            </label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e=>handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.email && errors.email
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`} 
              placeholder="you@email.com" 
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
            {touched.email && !errors.email && form.email && (
              <p className="mt-1 text-xs text-green-400">✓ Valid email</p>
            )}
            {!touched.email && (
              <p className="mt-1 text-xs text-cyan-300/60">Must contain @ and valid domain (e.g., .com, .in, .edu)</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Password <span className="text-red-400">*</span>
            </label>
            <input 
              type="password" 
              value={form.password} 
              onChange={e=>handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.password && errors.password
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`} 
              placeholder="••••••••" 
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
            {touched.password && !errors.password && form.password && (
              <p className="mt-1 text-xs text-green-400">✓ Valid password</p>
            )}
            {!touched.password && (
              <div className="mt-1 text-xs text-cyan-300/60 space-y-0.5">
                <p>Requirements:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>Minimum 6 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (@$!%*?&)</li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input 
              type="password" 
              value={form.confirm} 
              onChange={e=>handleChange('confirm', e.target.value)}
              onBlur={() => handleBlur('confirm')}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.confirm && errors.confirm
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`} 
              placeholder="••••••••" 
            />
            {touched.confirm && errors.confirm && (
              <p className="mt-1 text-xs text-red-400">{errors.confirm}</p>
            )}
            {touched.confirm && !errors.confirm && form.confirm && form.password === form.confirm && (
              <p className="mt-1 text-xs text-green-400">✓ Passwords match</p>
            )}
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

