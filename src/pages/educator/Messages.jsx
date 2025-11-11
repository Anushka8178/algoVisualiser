import Navbar from '../../components/Navbar';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Messages(){
  const { token } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('http://localhost:5000/api/educator/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, message })
    });
    const data = await res.json().catch(()=>({}));
    setStatus(res.ok ? 'Message queued' : (data.error || 'Failed'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Send Message</h1>
        <form onSubmit={submit} className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-4">
          <div>
            <label className="block text-sm mb-1">Student ID</label>
            <input value={studentId} onChange={e=>setStudentId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" placeholder="e.g. 12" />
          </div>
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" />
          </div>
          <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50">Send</button>
          {status && <div className="text-sm text-white/90">{status}</div>}
        </form>
      </div>
    </div>
  );
}


