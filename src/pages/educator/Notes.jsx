import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

export default function EducatorNotes() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/educator/notes', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <EducatorLayout
      heading="Educator Notes"
      subheading="Keep your observations, teaching plans, or follow-up reminders in one neatly organised space."
      accent="violet"
    >
      <div className="space-y-4">
        {loading && <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-slate-200/80">Loading notes…</div>}

        {!loading && notes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center text-slate-200/70">
            No notes yet. Draft quick observations after sessions to revisit later.
          </div>
        )}

        {!loading &&
          notes.map((note) => (
            <article
              key={note.id}
              className="rounded-3xl border border-white/10 bg-slate-900/50 px-6 py-6 shadow-lg shadow-slate-900/25 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">{note.title || 'Untitled note'}</h2>
                {note.updatedAt && (
                  <span className="text-xs uppercase tracking-wide text-slate-300/70">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-100/85">{note.content}</p>
            </article>
          ))}
      </div>
    </EducatorLayout>
  );
}


