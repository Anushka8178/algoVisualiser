import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EducatorLayout from '../../components/EducatorLayout';
import { useAuth } from '../../context/AuthContext';

export default function EducatorProfile() {
  const { user, token } = useAuth();
  const [algorithmCount, setAlgorithmCount] = useState(0);
  const [openRequestCount, setOpenRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [algorithmsRes, requestsRes] = await Promise.all([
          fetch('http://localhost:5000/api/algorithms', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (algorithmsRes.ok) {
          const data = await algorithmsRes.json();
          if (isMounted) {
            setAlgorithmCount(Array.isArray(data) ? data.length : 0);
          }
        }
        if (requestsRes.ok) {
          const data = await requestsRes.json();
          if (isMounted) {
            const requests = data.requests || [];
            setOpenRequestCount(requests.filter((r) => r.status !== 'completed').length);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <EducatorLayout
      heading="Educator Profile"
      subheading="Personalise your teaching workspace and keep an eye on pending actions that need your attention."
      accent="teal"
    >
      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-cyan-500/40">
              {user?.username?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{user?.username ?? 'Educator'}</h2>
              <p className="text-xs uppercase tracking-wide text-slate-300/70">{user?.email}</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-200/80">
            <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-medium text-slate-100">Role</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
                {user?.role ?? 'educator'}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-medium text-slate-100">Algorithms published</span>
              <span className="text-base font-semibold text-white">{loading ? '…' : algorithmCount}</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-medium text-slate-100">Open requests</span>
              <span className="text-base font-semibold text-white">{loading ? '…' : openRequestCount}</span>
            </li>
          </ul>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-200/70">
            <p className="font-semibold uppercase tracking-wide text-slate-300/70">Next steps</p>
            <p className="mt-2">
              Finish pending algorithm requests before this week&apos;s session. Consider adding notes or personalised
              resources for students who recently dropped streaks.
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/30">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200/80">Quick actions</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <QuickAction
                title="Manage resources"
                description="Attach fresh reading or upload PDF notes before learners reach the visualisation."
                to="/educator/resources"
              />
              <QuickAction
                title="Review requests"
                description="Check which algorithms students ask for and mark them completed once ready."
                to="/educator/requests"
              />
              <QuickAction
                title="View algorithms"
                description="Edit copy, complexity, or D3 code for existing algorithms."
                to="/educator/algorithms"
              />
              <QuickAction
                title="Message a student"
                description="Send encouragement or follow-ups to keep streaks alive."
                to="/educator/messages"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-sm text-slate-100/85">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200/80">Workspace tips</h3>
            <ul className="mt-3 space-y-2 text-slate-200/70">
              <li>• Educators are hidden from the public leaderboard; streaks shown are student-only.</li>
              <li>• D3 uploads run in a sandbox—avoid imports and rely on the provided svg, width, and height variables.</li>
              <li>• Upload supporting PDFs or context notes so learners mark material complete before visualising.</li>
            </ul>
          </div>
        </section>
      </section>
    </EducatorLayout>
  );
}

function QuickAction({ title, description, to }) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-5 text-left text-slate-100/90 shadow shadow-slate-900/25 transition hover:-translate-y-1 hover:border-cyan-200/60"
    >
      <div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-2 text-xs text-slate-300/80">{description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-cyan-100 transition group-hover:text-white">
        Open
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}


