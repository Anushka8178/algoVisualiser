import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/educator/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.username?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q),
    );
  }, [students, query]);

  return (
    <EducatorLayout
      heading="Learner Directory"
      subheading="Track student momentum, search for individuals, and spot trends quickly."
      accent="teal"
    >
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200/80">Filters</h2>
          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-300/70">
            Search
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or email"
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </label>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200/80">
            <p className="font-semibold text-slate-100">At a glance</p>
            <p className="mt-2 text-slate-200/70">
              Learners listed here exclude fellow educators and reflect real streak and engagement signal from the
              leaderboard.
            </p>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200/80">
                Showing{' '}
                <span className="font-semibold text-white">
                  {loading ? '...' : filteredStudents.length}
                </span>{' '}
                {filteredStudents.length === 1 ? 'student' : 'students'}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-lg shadow-slate-900/30">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-100/90">
              <thead className="bg-white/5 uppercase tracking-wide text-xs text-slate-300/70">
                <tr>
                  <th className="px-5 py-4 font-semibold">Learner</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Streak</th>
                  <th className="px-5 py-4 font-semibold">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading && (
                  <tr>
                    <td colSpan="4" className="px-5 py-6 text-center text-slate-300/70">
                      Loading students...
                    </td>
                  </tr>
                )}
                {!loading && filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-6 text-center text-slate-300/70">
                      No students match your search right now.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="transition hover:bg-white/5">
                      <td className="px-5 py-4 font-medium text-white">{student.username}</td>
                      <td className="px-5 py-4 text-slate-200/80">{student.email}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold text-orange-200">
                          🔥 {student.streak ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-200/80">{student.totalEngagement ?? 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </EducatorLayout>
  );
}

