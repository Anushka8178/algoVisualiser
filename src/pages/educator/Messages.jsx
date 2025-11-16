import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

export default function Messages() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
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
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (student) =>
        student.username?.toLowerCase().includes(term) || student.email?.toLowerCase().includes(term),
    );
  }, [students, search]);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!message.trim()) {
      setStatus('Enter a message before sending.');
      return;
    }

    if (!selectedStudentId && !search.trim()) {
      setStatus('Select a student by name or email.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/educator/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          studentId: selectedStudentId || undefined,
          studentIdentifier: search.trim() || undefined,
          subject,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('Message queued for delivery ✅');
        setMessage('');
        setSubject('');
      } else {
        setStatus(data.error || 'Failed to send message');
      }
    } catch (err) {
      setStatus(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <EducatorLayout
      heading="Nudge Learners"
      subheading="Select a student by name or email and send a personalised encouragement or quick reminder."
      accent="violet"
    >
      <form
        onSubmit={submit}
        className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl shadow-slate-900/30 backdrop-blur"
      >
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
          <label className="block text-sm font-semibold text-slate-100">
            Search by name or email
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Start typing a learner name or email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-100">
            Choose student
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              <option value="">-- Select learner --</option>
              {loading && <option>Loading students…</option>}
              {!loading &&
                filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.username} ({student.email})
                  </option>
                ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-100">
          Subject (optional)
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Celebrating your streak!"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-100">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Share feedback, reminders, or motivation."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={sending}
            className="rounded-full border border-cyan-300/60 bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/80 hover:bg-cyan-500/25 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Queue message'}
          </button>
          {status && <span className="text-sm text-slate-100/90">{status}</span>}
        </div>
      </form>
    </EducatorLayout>
  );
}

