import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Resources(){
  const { token } = useAuth();
  const [algorithms, setAlgorithms] = useState([]);
  const [algorithmSlug, setAlgorithmSlug] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch('http://localhost:5000/api/algorithms');
        if(res.ok){
          const data = await res.json();
          setAlgorithms(data);
          if(data.length) setAlgorithmSlug(data[0].slug);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if(!algorithmSlug){
      setStatus('Select an algorithm');
      return;
    }
    if(!link && !content && !file){
      setStatus('Provide a link, text content, or upload a file');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('content', content);
    formData.append('algorithmSlug', algorithmSlug);
    if(file){
      formData.append('file', file);
    }
    
    const res = await fetch('http://localhost:5000/api/educator/resources', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json().catch(()=>({}));
    if(res.ok){
      setStatus(`Saved for ${algorithmSlug}${data.filePath ? ' (file uploaded)' : ''}`);
      setTitle('');
      setLink('');
      setContent('');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if(fileInput) fileInput.value = '';
    } else {
      setStatus(data.error || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow">Upload Resources</h1>
        <form onSubmit={submit} className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-4">
          <div>
            <label className="block text-sm mb-1">Algorithm</label>
            <select value={algorithmSlug} onChange={e=>setAlgorithmSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-black placeholder-black/40">
              {loading && <option>Loading...</option>}
              {!loading && algorithms.map(algo => (
                <option key={algo.slug} value={algo.slug}>{algo.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" placeholder="Resource title" />
          </div>
          <div>
            <label className="block text-sm mb-1">PDF/External Link (optional)</label>
            <input value={link} onChange={e=>setLink(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm mb-1">Text Content (optional)</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30" />
          </div>
          <div>
            <label className="block text-sm mb-1">Upload File (PDF, Image, or Text - optional)</label>
            <input 
              id="file-input"
              type="file" 
              onChange={e=>setFile(e.target.files[0])} 
              accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/30 file:text-white hover:file:bg-white/40"
            />
            {file && <div className="mt-2 text-sm text-white/80">Selected: {file.name}</div>}
          </div>
          <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50">Save</button>
          {status && <div className="text-sm text-white/90">{status}</div>}
        </form>
      </div>
    </div>
  );
}


