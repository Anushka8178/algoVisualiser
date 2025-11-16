import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function MessagesInbox() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [marking, setMarking] = useState(false);

  const fetchMessages = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to load messages');
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  const markAsRead = async (messageId) => {
    if (!token) return;
    setMarking(messageId);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to mark as read');
      }
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 sm:px-6">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Inbox</h1>
          <p className="text-sm text-slate-300/80 sm:text-base">
            Messages from your educators appear here. Unread messages are highlighted for quick follow up.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl shadow-slate-900/30">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-300/70">
              Messages {unreadCount > 0 ? `• ${unreadCount} unread` : ''}
            </div>
            <button
              onClick={fetchMessages}
              className="text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:text-cyan-100"
            >
              Refresh
            </button>
          </div>

          {loading && <div className="px-6 py-10 text-sm text-slate-300/80">Loading messages…</div>}
          {error && !loading && <div className="px-6 py-6 text-sm text-rose-200">{error}</div>}

          {!loading && !error && messages.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-300/70">
              Your inbox is clear. Educator messages will appear here when they reach out.
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <ul className="divide-y divide-white/5">
              {messages.map((msg) => {
                const isActive = activeMessageId === msg.id;
                return (
                  <li
                    key={msg.id}
                    className={`flex flex-col gap-3 px-6 py-5 transition ${
                      msg.isRead ? 'bg-transparent' : 'bg-cyan-500/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMessageId(isActive ? null : msg.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{msg.subject}</p>
                        <p className="text-xs text-slate-300/70">
                          From {msg.educator?.username || 'Educator'} •{' '}
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-cyan-200">
                        {isActive ? 'Hide' : 'View'}
                      </span>
                    </button>

                    {isActive && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-relaxed text-slate-100">
                        <p className="whitespace-pre-wrap">{msg.body}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300/70">
                          <span>
                            {msg.isRead
                              ? `Read ${msg.readAt ? new Date(msg.readAt).toLocaleString() : ''}`
                              : 'Unread'}
                          </span>
                          {!msg.isRead && (
                            <button
                              onClick={() => markAsRead(msg.id)}
                              disabled={marking === msg.id}
                              className="rounded-full border border-cyan-300/60 bg-cyan-500/20 px-4 py-2 font-semibold text-cyan-100 transition hover:border-cyan-200/80 hover:bg-cyan-500/25 disabled:opacity-60"
                            >
                              {marking === msg.id ? 'Marking…' : 'Mark as read'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}


