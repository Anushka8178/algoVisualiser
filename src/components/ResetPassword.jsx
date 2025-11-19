import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

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

export default function ResetPassword() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({ password: '', confirm: '' });
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast('Invalid reset link. Please request a new one.', 'error');
      navigate('/forgot-password');
    }
  }, [token, navigate, showToast]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    if (field === 'password') {
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
    
    if (!token) {
      showToast('Invalid reset token', 'error');
      return;
    }

    setTouched({ password: true, confirm: true });
    
    const passwordValid = validateField('password', form.password);
    const confirmValid = validateField('confirm', form.confirm);

    if (!passwordValid || !confirmValid) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    if (form.password !== form.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: form.password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        showToast('Password reset successfully!', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <motion.div
          className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 md:p-12 w-full max-w-md border border-cyan-500/20 shadow-xl shadow-cyan-900/20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Password Reset Successful!
          </h1>
          <p className="text-cyan-100/80 mb-6">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <Link
            to="/login"
            className="text-cyan-300 hover:text-cyan-200 underline font-medium"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
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

      <Link
        to="/login"
        className="absolute top-6 left-6 text-cyan-300/80 hover:text-cyan-200 transition-colors flex items-center gap-2 z-10"
      >
        <span>←</span> Back to Login
      </Link>

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
          Reset Password
        </motion.h1>
        <motion.p
          className="text-center mb-8 text-cyan-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Enter your new password below
        </motion.p>

        <form className="space-y-6" onSubmit={onSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              New Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.password && errors.password
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`}
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
            {touched.password && !errors.password && form.password && (
              <p className="mt-1 text-xs text-green-400">✓ Valid password</p>
            )}
            {!touched.password && (
              <p className="mt-1 text-xs text-cyan-300/60">Min 6 chars, uppercase, lowercase, number, special char</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium mb-2 text-cyan-300/70">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => handleChange('confirm', e.target.value)}
              onBlur={() => handleBlur('confirm')}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                touched.confirm && errors.confirm
                  ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50'
                  : 'border-cyan-500/30 focus:ring-cyan-400/50 focus:border-cyan-400/50'
              }`}
            />
            {touched.confirm && errors.confirm && (
              <p className="mt-1 text-xs text-red-400">{errors.confirm}</p>
            )}
            {touched.confirm && !errors.confirm && form.confirm && form.password === form.confirm && (
              <p className="mt-1 text-xs text-green-400">✓ Passwords match</p>
            )}
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
            {submitting ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-sm text-cyan-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Remember your password?{' '}
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200 underline font-medium">
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

