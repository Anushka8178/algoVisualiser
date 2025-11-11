import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastProvider';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const categories = ['Sorting', 'Searching', 'Graph', 'Dynamic Programming', 'Data Structures', 'Other'];

export default function AddAlgorithm() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('slug') || '';
  const isEditMode = Boolean(editSlug);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState('');
  const [slug, setSlug] = useState('');
  const [material, setMaterial] = useState('');
  const [visualizationUrl, setVisualizationUrl] = useState('');
  const [visualizationCode, setVisualizationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load algorithm data if editing
  useEffect(() => {
    if (isEditMode && editSlug) {
      const fetchAlgorithm = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/algorithms/${editSlug}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title || '');
            setCategory(data.category || categories[0]);
            setDescription(data.description || '');
            setComplexity(data.complexity || '');
            setSlug(data.slug || '');
            setMaterial(data.material || '');
            setVisualizationUrl(data.visualizationUrl || '');
            setVisualizationCode(data.visualizationCode || '');
          } else {
            showToast('Failed to load algorithm', 'error');
            navigate('/educator/algorithms');
          }
        } catch (error) {
          showToast('Error loading algorithm', 'error');
          navigate('/educator/algorithms');
        } finally {
          setLoading(false);
        }
      };
      fetchAlgorithm();
    }
  }, [isEditMode, editSlug, token, navigate, showToast]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !description || !complexity) {
      showToast('Please fill the required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const url = isEditMode
        ? `http://localhost:5000/api/algorithms/${editSlug}`
        : 'http://localhost:5000/api/algorithms';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          description,
          complexity,
          slug: slug || undefined,
          material,
          visualizationUrl,
          visualizationCode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast(isEditMode ? 'Algorithm updated successfully' : 'Algorithm created successfully', 'success');
        navigate('/educator/algorithms');
      } else {
        showToast(data.error || `Failed to ${isEditMode ? 'update' : 'create'} algorithm`, 'error');
      }
    } catch (error) {
      showToast(error.message || `Failed to ${isEditMode ? 'update' : 'create'} algorithm`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold drop-shadow">
              {isEditMode ? 'Edit Algorithm' : 'Add New Algorithm'}
            </h1>
            <p className="text-white/80 mt-2">
              {isEditMode
                ? 'Update algorithm details and visualization.'
                : 'Publish algorithm details and visualization links so students can learn and explore.'}
            </p>
          </div>
          {isEditMode && (
            <Link
              to="/educator/algorithms"
              className="text-white/80 hover:text-white underline text-sm"
            >
              ← Back to Algorithms
            </Link>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-5">
          <div>
            <label className="block text-sm mb-1">Title*</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
              placeholder="e.g. Topological Sort"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Category*</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-black placeholder-black/40"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Time Complexity*</label>
              <input
                value={complexity}
                onChange={e => setComplexity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
                placeholder="e.g. O(n log n)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Slug {isEditMode ? '' : '(optional)'}</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
              placeholder={isEditMode ? "algorithm-slug" : "leave blank to auto-generate"}
              disabled={isEditMode}
            />
            <p className="text-xs text-white/60 mt-1">
              {isEditMode
                ? 'Slug cannot be changed after creation.'
                : 'Slug should be URL friendly (lowercase letters, digits, hyphen).'}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Description*</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
              placeholder="Short summary of the algorithm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Learning Material (shown on Material page)</label>
            <textarea
              value={material}
              onChange={e => setMaterial(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
              placeholder="Explain the algorithm, steps, examples, etc."
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Visualization URL (optional)</label>
            <input
              value={visualizationUrl}
              onChange={e => setVisualizationUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
              placeholder="Link to interactive visualization or video"
            />
            <p className="text-xs text-white/60 mt-1">Provide a link to an interactive demo, shared visualization, or video (YouTube, Loom, etc.).</p>
          </div>

          <div>
            <label className="block text-sm mb-1">D3 Visualization Code (optional)</label>
            <textarea
              value={visualizationCode}
              onChange={e => setVisualizationCode(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/30 font-mono text-sm"
              placeholder={`// Paste your D3.js visualization code here
// IMPORTANT: 
// - DO NOT use: const svg = d3.select("svg"); (svg is already provided)
// - DO NOT use: const width = svg.attr("width"); (width is already provided)
// - DO NOT use: const height = svg.attr("height"); (height is already provided)
// - DO NOT use import statements - d3 is already available!
// 
// Example: Simple bar chart
// const data = [10, 20, 30, 40, 50];
// const barWidth = width / data.length;
// svg.selectAll("rect")
//   .data(data)
//   .enter()
//   .append("rect")
//   .attr("x", (d, i) => i * barWidth)
//   .attr("y", d => height - d * 5)
//   .attr("width", barWidth - 2)
//   .attr("height", d => d * 5)
//   .attr("fill", "#3b82f6");
// 
// Available variables (use directly):
// - svg: D3 selection of SVG (already selected, ready to use)
// - width, height: canvas dimensions (800x400 default)
// - d3: D3 library (use d3.select(), d3.scaleLinear(), etc.)
// - index: current step index (0 for static)
// - actions: array of steps (empty for static)`}
            />
            <p className="text-xs text-white/60 mt-1">
              Write D3.js code to create an interactive visualization. The <code className="bg-white/20 px-1 rounded">svg</code> variable is already a D3 selection of the SVG element.
              <br />
              <strong className="text-yellow-300">⚠️ Do NOT use import statements</strong> - d3 is already available. Just use <code className="bg-white/20 px-1 rounded">d3.select()</code>, <code className="bg-white/20 px-1 rounded">d3.scaleLinear()</code>, etc.
              <br />
              <a href="https://d3js.org" target="_blank" rel="noopener noreferrer" className="underline">Learn D3.js →</a>
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-white/80">Loading algorithm...</div>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 disabled:opacity-60"
            >
              {submitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Algorithm' : 'Save Algorithm')}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}


