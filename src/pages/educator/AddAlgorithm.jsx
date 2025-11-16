import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastProvider';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import EducatorLayout from '../../components/EducatorLayout';

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
    <EducatorLayout
      heading={isEditMode ? 'Edit Algorithm' : 'Add New Algorithm'}
      subheading={
        isEditMode
          ? 'Update algorithm metadata, learning material, or interactive visualisation code.'
          : 'Publish algorithm details and provide material students must complete before visualising.'
      }
      accent="violet"
    >
      <div className="mb-6 flex items-center justify-end">
        {isEditMode && (
          <Link to="/educator/algorithms" className="text-sm text-cyan-100 underline decoration-dotted underline-offset-4">
            ← Back to algorithms
          </Link>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl shadow-slate-900/30 backdrop-blur"
      >
        <Field label="Title*" description="Learners see this prominently on cards and material screens.">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Topological Sort"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Category*">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Time complexity*" description="Share the primary Big-O or average case.">
            <input
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              placeholder="e.g. O(n log n)"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </Field>
        </div>

        <Field label={`Slug ${isEditMode ? '' : '(optional)'}`} description={isEditMode ? 'Slug cannot be changed after creation.' : 'Leave blank to auto-generate a URL friendly slug.'}>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={isEditMode ? 'algorithm-slug' : 'auto generated if left blank'}
            disabled={isEditMode}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 disabled:opacity-70 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field label="Description*" description="Displayed on algorithm cards in the student dashboard.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Summarise what this algorithm does and why it matters."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field label="Learning material" description="Students must mark the material done before visualising. Support Markdown.">
          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            rows={6}
            placeholder="Outline the concept, paired exercises, or external references."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field label="Visualisation URL" description="Optional link to a standalone demo (YouTube, Observable, etc.).">
          <input
            value={visualizationUrl}
            onChange={(e) => setVisualizationUrl(e.target.value)}
            placeholder="https://"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </Field>

        <Field
          label="D3 visualisation code"
          description="Paste raw D3.js compatible code. Imports are stripped automatically. Use provided svg, width, height variables."
        >
          <textarea
            value={visualizationCode}
            onChange={(e) => setVisualizationCode(e.target.value)}
            rows={14}
            placeholder={`// Paste your D3.js visualisation code here
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
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 font-mono text-xs text-emerald-100 focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          />
          <p className="mt-3 text-xs text-emerald-100/80">
            The <code className="rounded bg-white/10 px-1">svg</code> selection plus <code className="rounded bg-white/10 px-1">width</code> and{' '}
            <code className="rounded bg-white/10 px-1">height</code> are injected automatically. Avoid import/export statements.
          </p>
          <a
            className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-100 underline decoration-dotted underline-offset-4"
            href="https://d3js.org"
            target="_blank"
            rel="noreferrer"
          >
            D3.js documentation ↗
          </a>
        </Field>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-200/80">Loading algorithm…</div>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full border border-cyan-300/60 bg-cyan-500/25 px-8 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/80 hover:bg-cyan-500/30 disabled:opacity-60"
          >
            {submitting
              ? isEditMode
                ? 'Updating…'
                : 'Saving…'
              : isEditMode
              ? 'Update algorithm'
              : 'Save algorithm'}
          </button>
        )}
      </form>
    </EducatorLayout>
  );
}

function Field({ label, description, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-100">
      <span>{label}</span>
      {description && <p className="mt-1 text-xs font-normal text-slate-300/80">{description}</p>}
      {children}
    </label>
  );
}

