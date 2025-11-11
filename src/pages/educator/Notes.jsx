import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function EducatorNotes(){
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(()=> {
    (async ()=>{
      const res = await fetch('http://localhost:5000/api/educator/notes', { headers: { Authorization: `Bearer ${token}` }});
      if(res.ok){ const data = await res.json(); setNotes(data.notes || []); }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Educator Notes</h1>
        <div className="mt-6 bg-white/10 rounded-2xl border border-white/20 divide-y divide-white/10">
          {notes.map(n => (
            <div key={n.id} className="p-4">
              <div className="font-semibold">{n.title || 'Untitled'}</div>
              <pre className="whitespace-pre-wrap text-white/90 mt-1">{n.content}</pre>
            </div>
          ))}
          {!notes.length && <div className="p-4 text-white/80">No notes found.</div>}
        </div>
      </div>
    </div>
  );
}


