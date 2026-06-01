import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Search, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import {
  conversationsAPI,
  type Conversation,
  type MessageResponse,
} from '../../lib/api';

function initials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function fmtTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function Messages() {
  const { user } = useAuth();
  const myId = user?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadList = useCallback(async () => {
    try {
      const list = await conversationsAPI.list();
      setConversations(list);
      setActiveId((cur) => cur ?? (list.length > 0 ? list[0].id : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load conversations');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadThread = useCallback(async (id: number) => {
    setLoadingThread(true);
    try {
      const msgs = await conversationsAPI.getMessages(id);
      setMessages(msgs);
      await conversationsAPI.markRead(id).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load messages');
    } finally {
      setLoadingThread(false);
    }
  }, []);

  // Initial + polling refresh of the conversation list.
  useEffect(() => {
    loadList();
    const t = setInterval(loadList, 8000);
    return () => clearInterval(t);
  }, [loadList]);

  // Load thread whenever the active conversation changes.
  useEffect(() => {
    if (activeId != null) loadThread(activeId);
  }, [activeId, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || activeId == null) return;
    setSending(true);
    try {
      const msg = await conversationsAPI.send(activeId, content);
      setMessages((m) => [...m, msg]);
      setDraft('');
      loadList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  const visible = conversations.filter((c) =>
    !search || (c.counterparty_name || '').toLowerCase().includes(search.toLowerCase())
  );
  const active = conversations.find((c) => c.id === activeId) || null;

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversation list */}
      <aside className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : visible.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No conversations yet.</p>
          ) : (
            visible.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 ${
                  c.id === activeId ? 'bg-[#0A2463]/5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {initials(c.counterparty_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">{c.counterparty_name || 'Unknown'}</span>
                    {c.unread_count > 0 && (
                      <span className="ml-2 bg-[#0A2463] text-white text-xs rounded-full px-2 py-0.5">{c.unread_count}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.last_message || 'No messages'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Thread */}
      <section className="flex-1 flex flex-col bg-gray-50">
        {error && <div className="m-3 p-2 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
        {active ? (
          <>
            <header className="px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="font-semibold text-gray-900">{active.counterparty_name || 'Unknown'}</h2>
              <p className="text-xs text-gray-500 capitalize">{active.counterparty_role}</p>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loadingThread ? (
                <div className="flex justify-center pt-10"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              ) : messages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center pt-10">No messages in this conversation yet.</p>
              ) : (
                messages.map((m) => {
                  const mine = myId != null && m.sender_id === myId;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${mine ? 'bg-[#0A2463] text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                        {m.file_url ? (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className="underline text-sm">
                            {m.file_name || 'Attachment'}
                          </a>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        )}
                        <p className={`text-[10px] mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>{fmtTime(m.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30"
              />
              <button
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                className="bg-[#0A2463] text-white p-2.5 rounded-lg hover:bg-[#0A2463]/90 disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-10 h-10 mb-2" />
            <p>Select a conversation</p>
          </div>
        )}
      </section>
    </div>
  );
}
