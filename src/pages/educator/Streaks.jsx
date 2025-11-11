import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Streaks(){
  const { token } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(()=> {
    (async ()=>{
      const res = await fetch('http://localhost:5000/api/educator/streaks', { headers: { Authorization: `Bearer ${token}` }});
      if(res.ok){ const data = await res.json(); setRows(data.students || []); }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Learning Streaks</h1>
        <div className="mt-6 bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-2 px-4 py-3 text-sm text-white/80 border-b border-white/20">
            <div>Student</div>
            <div className="text-right">Streak</div>
          </div>
          <div className="divide-y divide-white/10">
            {rows.map(r => (
              <div key={r.id} className="grid grid-cols-2 px-4 py-3">
                <div>{r.username}</div>
                <div className="text-right">🔥 {r.streak}</div>
              </div>
            ))}
            {!rows.length && <div className="px-4 py-3 text-white/80">No data.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}


