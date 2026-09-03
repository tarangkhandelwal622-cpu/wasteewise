'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const QUICK_PROMPTS = [
  { label: '💡 Suggest business ideas', text: 'What waste-to-business ideas do you recommend for a beginner?' },
  { label: '♻️ I have waste to give away', text: 'I have waste I want to give away. How do I post a listing?' },
  { label: '🔍 I need raw material', text: 'I need waste material for my startup. How do I find suppliers?' },
  { label: '📋 Generate a custom idea', text: 'I have sawdust from my carpentry workshop. What can I make with it?' },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0 shadow-md">
        ♻️
      </div>
      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-charcoal-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-charcoal-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-charcoal-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// Parse markdown-ish links and bold from AI response
function MessageContent({ text }) {
  // Split on markdown links [text](url) and **bold**
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;

  // Process the text to handle links
  const segments = [];
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: text.slice(last, match.index) });
    }
    segments.push({ type: 'link', label: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {segments.map((seg, i) => {
        if (seg.type === 'link') {
          const isExternal = seg.href.startsWith('http');
          return isExternal ? (
            <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" className="text-royal underline hover:text-royal-dark font-medium">
              {seg.label}
            </a>
          ) : (
            <Link key={i} href={seg.href} className="text-royal underline hover:text-royal-dark font-medium">
              {seg.label}
            </Link>
          );
        }
        // Handle **bold** within text segments
        const boldParts = seg.value.split(/\*\*([^*]+)\*\*/g);
        return (
          <span key={i}>
            {boldParts.map((p, j) =>
              j % 2 === 1 ? <strong key={j} className="font-bold text-charcoal">{p}</strong> : p
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function WasteManChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Show pulsing badge after 3 seconds
  const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowBadge(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    setShowGreeting(false);

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "Sorry, I had a hiccup! 🔧 Please try again. You can also [browse listings](/listings) or [explore ideas](/ideas) directly.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowGreeting(true);
    setInput('');
  };

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip when closed */}
        {!open && showBadge && (
          <div className="animate-fade-in-up bg-white border border-border rounded-2xl px-4 py-2.5 shadow-lg text-sm font-semibold text-charcoal flex items-center gap-2">
            <span>Ask WasteMan anything!</span>
            <span className="text-base">♻️</span>
          </div>
        )}

        <button
          onClick={() => { setOpen(!open); setShowBadge(false); }}
          className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            open
              ? 'bg-charcoal text-white rotate-0'
              : 'bg-gradient-to-br from-royal to-emerald-500 text-white'
          }`}
          aria-label="Toggle WasteMan chat"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            '♻️'
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-h-[75vh] flex flex-col bg-white rounded-3xl border border-border shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-royal to-emerald-500 px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow-sm">
              ♻️
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base leading-tight">WasteMan</div>
              <div className="text-white/80 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                Powered by Gemini AI
              </div>
            </div>
            <button
              onClick={resetChat}
              title="New chat"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-surface min-h-0">
            {/* Greeting / Quick prompts */}
            {showGreeting && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0 shadow-md">
                    ♻️
                  </div>
                  <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-[85%]">
                    <p className="text-sm text-charcoal leading-relaxed">
                      👋 Hi! I&apos;m <strong>WasteMan</strong>, your AI guide for turning waste into wealth on WasteWise.
                    </p>
                    <p className="text-sm text-charcoal-light mt-1">
                      I can suggest business ideas, help you find listings, or generate a startup plan for any waste type!
                    </p>
                  </div>
                </div>

                {/* Quick prompts */}
                <div className="pl-10 space-y-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => sendMessage(p.text)}
                      className="w-full text-left px-3 py-2.5 bg-white border border-border rounded-xl text-xs font-medium text-charcoal hover:border-royal/40 hover:bg-royal/5 hover:text-royal transition-all duration-200 shadow-sm"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0 shadow-md">
                    ♻️
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-royal text-white rounded-br-sm'
                      : 'bg-white border border-border text-charcoal rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <MessageContent text={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-border bg-white flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about waste ideas, listings, or anything circular..."
                rows={1}
                className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/60 resize-none focus:outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all max-h-32 leading-relaxed"
                style={{ minHeight: '42px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 flex-shrink-0 bg-royal text-white rounded-xl flex items-center justify-center hover:bg-royal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[10px] text-charcoal-light/60 mt-1.5 text-center">
              WasteMan is AI-powered — responses may vary. Always verify before acting.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
