import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useParams, useSearchParams } from 'react-router-dom';

export default function Notes(){
  const params = useParams();
  const [sp] = useSearchParams();
  const paramId = params.id || sp.get('algo') || 'general';
  const storageKey = useMemo(()=> `av_notes_${paramId}`, [paramId]);
  const [text, setText] = useState('');
  const [notes, setNotes] = useState(()=>{
    const raw = localStorage.getItem(storageKey);
    return raw? JSON.parse(raw) : [];
  });
  useEffect(()=>{
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);
  const save = () => {
    if(!text.trim()) return;
    setNotes(n => [{ id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }, ...n]);
    setText('');
  };
  const remove = (id) => setNotes(n => n.filter(x=> x.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold mb-1 drop-shadow">Notes</h1>
        <div className="text-white/80 mb-4 text-sm">Algorithm: {paramId}</div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 shadow-xl">
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} placeholder="Write your note about the algorithm..." className="w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 p-4 focus:outline-none focus:ring-2 focus:ring-white/50" />
          <div className="mt-4 flex gap-3">
            <motion.button onClick={save} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Save</motion.button>
            <motion.button onClick={()=>setText('')} className="bg-white/20 border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Clear</motion.button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {notes.map(n => (
            <motion.div key={n.id} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 flex items-start justify-between" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div>
                <div className="text-sm text-white/70">{new Date(n.createdAt).toLocaleString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{n.text}</div>
              </div>
              <button onClick={()=>remove(n.id)} className="text-sm bg-white/20 border border-white/30 px-3 py-1 rounded-lg hover:bg-white/30">Delete</button>
            </motion.div>
          ))}
          {!notes.length && <div className="text-white/80">No notes yet. Save your first note above.</div>}
        </div>
      </div>
    </div>
  );
}


