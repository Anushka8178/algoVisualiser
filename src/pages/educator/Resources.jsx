import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EducatorLayout from '../../components/EducatorLayout';

export default function Resources() {
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
    <EducatorLayout
      heading="Resource Library"
      subheading="Attach rich reading paths before learners visualise algorithms. Upload links, quick primers, or full PDFs."
      accent="violet"
    >
      <form
        onSubmit={submit}
        className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl shadow-slate-900/30 backdrop-blur"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Algorithm">
            <select
              value={algorithmSlug}
              onChange={(e) => setAlgorithmSlug(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              {loading && <option>Loading...</option>}
              {!loading &&
                algorithms.map((algo) => (
                  <option key={algo.slug} value={algo.slug}>
                    {algo.title}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="Resource title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short descriptor (optional)"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </Field>
        </div>

        <Field label="PDF or external link">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://resource.example.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field label="Text primer (optional)">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Add quick refreshers, bullet notes, or contextual tips for students."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field label="Upload file (optional)">
          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx"
            className="mt-2 w-full cursor-pointer rounded-2xl border border-dashed border-white/20 bg-slate-900/60 px-4 py-6 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-cyan-100 hover:border-cyan-300/60"
          />
          {file && <div className="mt-3 text-xs text-slate-200/80">Selected: {file.name}</div>}
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full border border-cyan-300/60 bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/80 hover:bg-cyan-500/25"
          >
            Save resource
          </button>
          {status && <span className="text-sm text-slate-100/90">{status}</span>}
        </div>
      </form>
    </EducatorLayout>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      {children}
    </label>
  );
}

