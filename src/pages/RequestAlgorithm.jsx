import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RequestAlgorithm(){
  const { token } = useAuth();
  const [algorithmSlug, setAlgorithmSlug] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ algorithmSlug, note })
    });
    const data = await res.json().catch(()=>({}));
    setStatus(res.ok ? 'Request submitted' : (data.error || 'Failed'));
    if(res.ok){ setAlgorithmSlug(''); setNote(''); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Request an Algorithm</h1>
        <form onSubmit={submit} className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-4">
          <div>
            <label className="block text-sm mb-1">Algorithm Slug</label>
            <input value={algorithmSlug} onChange={e=>setAlgorithmSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" placeholder="e.g. dijkstra, bubble-sort" />
          </div>
          <div>
            <label className="block text-sm mb-1">Note (optional)</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" />
          </div>
          <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50">Send Request</button>
          {status && <div className="text-sm text-white/90">{status}</div>}
        </form>
      </div>
    </div>
  );
}


