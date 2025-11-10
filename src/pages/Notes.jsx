import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const API_URL = 'http://localhost:5000/api';

export default function Notes(){
  const { token } = useAuth();
  const { showToast } = useToast();
  const params = useParams();
  const [sp] = useSearchParams();
  const paramId = params.id || sp.get('algo') || 'general';
  const [text, setText] = useState('');
  const [notes, setNotes] = useState([]);
  const [algorithm, setAlgorithm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const algoResponse = await fetch(`${API_URL}/algorithms/${paramId}`);
        if (algoResponse.ok) {
          const algoData = await algoResponse.json();
          setAlgorithm(algoData);

          const notesResponse = await fetch(`${API_URL}/notes/algorithm/${paramId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (notesResponse.ok) {
            const notesData = await notesResponse.json();
            setNotes(notesData);
          }
        } else if (algoResponse.status === 404) {

          const notesResponse = await fetch(`${API_URL}/notes`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (notesResponse.ok) {
            const notesData = await notesResponse.json();
            setNotes(notesData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error loading notes', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paramId, token, showToast]);

  const save = async () => {
    if(!text.trim() || !algorithm || !token) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithmId: algorithm.id,
          content: text.trim(),
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setText('');
        showToast('Note saved successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save note', 'error');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showToast('Error saving note', 'error');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note.id);
    setEditText(note.content);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditText('');
  };

  const updateNote = async (id) => {
    if (!editText.trim() || !token) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editText.trim(),
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(n => n.id === id ? updatedNote : n));
        setEditingNote(null);
        setEditText('');
        showToast('Note updated successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update note', 'error');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      showToast('Error updating note', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== id));
        showToast('Note deleted', 'success');
      } else {
        showToast('Failed to delete note', 'error');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      showToast('Error deleting note', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20 text-cyan-400">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.header 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Notes
          </h1>
          <p className="text-cyan-100/80 mt-2 text-sm sm:text-base">
            {algorithm ? `Algorithm: ${algorithm.title}` : `Algorithm: ${paramId}`}
          </p>
        </motion.header>
        {algorithm && (
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-xl shadow-cyan-900/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              rows={5}
              placeholder="Write your note about the algorithm..."
              className="w-full rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 p-4 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 resize-none text-sm sm:text-base"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={save}
                disabled={saving || !text.trim()}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saving ? 'Saving...' : 'Save'}
              </motion.button>
              <motion.button
                onClick={()=>setText('')}
                className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-6 py-3 rounded-xl font-semibold hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.98 }}
              >
                Clear
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="mt-6 space-y-4">
          {notes.map(n => (
            <motion.div
              key={n.id}
              className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/20 shadow-xl shadow-cyan-900/20 hover:border-cyan-400/40 transition-all"
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
            >
              {editingNote === n.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-slate-800/50 border border-cyan-500/30 text-white placeholder-cyan-200/50 p-4 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all mb-3"
                  />
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => updateNote(n.id)}
                      disabled={saving || !editText.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </motion.button>
                    <motion.button
                      onClick={cancelEdit}
                      className="bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-4 py-2 rounded-lg font-semibold hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-cyan-300/70 mb-2 flex items-center gap-2">
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                      {n.Algorithm && (
                        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                          {n.Algorithm.title}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-slate-200">{n.content}</div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(n)}
                      className="text-sm bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-3 py-1 rounded-lg hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      className="text-sm bg-slate-700/50 border border-cyan-500/30 text-cyan-100 px-3 py-1 rounded-lg hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {!notes.length && (
            <div className="text-slate-300/80 text-center py-8">
              {algorithm ? 'No notes yet. Save your first note above.' : 'Algorithm not found or no notes available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

