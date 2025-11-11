import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Students(){
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');

  useEffect(()=>{
    (async ()=>{
      const res = await fetch('http://localhost:5000/api/educator/students', { headers: { Authorization: `Bearer ${token}` }});
      if(res.ok){ const data = await res.json(); setStudents(data.students || []); }
    })();
  }, [token]);

  const filtered = students.filter(s => s.username?.toLowerCase().includes(q.toLowerCase()) || s.email?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold">Students</h1>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or email..." className="mt-4 w-full sm:w-96 px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/70" />
        <div className="mt-6 bg-white/10 rounded-2xl border border-white/20 divide-y divide-white/10">
          {filtered.map(s => (
            <div key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.username}</div>
                <div className="text-sm text-white/80">{s.email}</div>
              </div>
              <div className="text-sm">🔥 {s.streak} • Engagement {s.totalEngagement}</div>
            </div>
          ))}
          {!filtered.length && <div className="p-4 text-white/80">No students found.</div>}
        </div>
      </div>
    </div>
  );
}


