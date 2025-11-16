import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/educator', label: 'Overview' },
  { to: '/educator/students', label: 'Students' },
  { to: '/educator/requests', label: 'Requests' },
  { to: '/educator/algorithms', label: 'Algorithms' },
  { to: '/educator/resources', label: 'Resources' },
  { to: '/educator/messages', label: 'Messages' },
  { to: '/educator/notes', label: 'Notes' },
  { to: '/educator/profile', label: 'Profile' },
];

export default function EducatorNavbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-slate-900/70 backdrop-blur-md px-4 sm:px-8">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between text-slate-100">
        <Link to="/educator" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-lg font-bold shadow-lg shadow-cyan-500/40">
            Ed
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-wide text-slate-100">Educator Hub</span>
            <span className="text-xs text-slate-300/80">Algo Visualizer</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 transition-all duration-200',
                  isActive
                    ? 'bg-white/15 text-cyan-200 shadow shadow-slate-900/40'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-sm text-slate-300/80">Hi, {user?.username ?? 'Educator'}</span>
          <button
            onClick={logout}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-slate-100 transition hover:bg-white/10 sm:hidden"
          aria-label="Toggle educator menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:hidden"
          >
            <div className="flex flex-col gap-1 pb-4 text-sm font-medium text-slate-100">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'mx-4 rounded-lg px-4 py-3 transition-all',
                      isActive
                        ? 'bg-white/15 text-cyan-200'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="mx-4 mt-2 rounded-lg border border-white/15 px-4 py-3 text-left text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Logout
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}


