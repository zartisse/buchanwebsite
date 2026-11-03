import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatbotSettings } from '../../../hooks/useChatbotSettings';
import { friendlyChatError, sendChatMessage } from '../../../lib/chatbotApi';
import styles from './ChatWidget.module.css';

const SESSION_KEY = 'buchan-chat-session-id';
const ATTENTION_DISMISSED_KEY = 'buchan-chat-attention-dismissed';
const ATTENTION_CAP_MS = 120_000;

function isAttentionDismissed(): boolean {
  try {
    return sessionStorage.getItem(ATTENTION_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function dismissAttention(): void {
  try {
    sessionStorage.setItem(ATTENTION_DISMISSED_KEY, '1');
  } catch {
    /* ignore */
  }
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
};

function formatChatText(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n').trim();
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');
  text = text.replace(/__(.+?)__/g, '$1');
  text = text.replace(/(^|[^\w])\*(.+?)\*(?=[^\w]|$)/g, '$1$2');
  text = text.replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, '$1$2');
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/^[-*]\s+/gm, '• ');
  return text.trim();
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const devForceEnabled = import.meta.env.VITE_CHATBOT_ENABLED === 'true';

export function ChatWidget() {
  const { settings, loading } = useChatbotSettings(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingOut, setTypingOut] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showAttention, setShowAttention] = useState(() => !isAttentionDismissed());
  const listRef = useRef<HTMLDivElement>(null);
  const typeTimerRef = useRef<number | null>(null);

  const clearTypeTimer = () => {
    if (typeTimerRef.current != null) {
      window.clearTimeout(typeTimerRef.current);
      typeTimerRef.current = null;
    }
  };

  useEffect(() => () => clearTypeTimer(), []);

  const revealAssistantReply = useCallback((fullText: string) => {
    const text = formatChatText(fullText);
    if (!text) {
      setSending(false);
      setTypingOut(false);
      return;
    }

    if (prefersReducedMotion()) {
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
      setSending(false);
      setTypingOut(false);
      return;
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: '', streaming: true }]);
    setSending(false);
    setTypingOut(true);

    let index = 0;
    const step = () => {
      index = Math.min(text.length, index + (text.length > 280 ? 3 : 2));
      const slice = text.slice(0, index);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant' && last.streaming) {
          next[next.length - 1] = { ...last, content: slice, streaming: index < text.length };
        }
        return next;
      });
      if (index < text.length) {
        typeTimerRef.current = window.setTimeout(step, 16);
      } else {
        typeTimerRef.current = null;
        setTypingOut(false);
      }
    };
    typeTimerRef.current = window.setTimeout(step, 180);
  }, []);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    if (!showAttention) return;
    const cap = window.setTimeout(() => setShowAttention(false), ATTENTION_CAP_MS);
    return () => window.clearTimeout(cap);
  }, [showAttention]);

  useEffect(() => {
    if (!open) return;
    dismissAttention();
    setShowAttention(false);
  }, [open]);

  useEffect(() => {
    if (open && settings?.welcome_message && messages.length === 0) {
      setMessages([{ role: 'assistant', content: settings.welcome_message }]);
    }
  }, [open, settings?.welcome_message, messages.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const phone = settings?.phone ?? '425.827.2266';
  const phoneHref = settings?.phone_href ?? 'tel:4258272266';
  const hubspotUrl =
    settings?.hubspot_meeting_url ?? 'https://meetings-na2.hubspot.com/mischelle-mccall';

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending || typingOut) return;
    setInput('');
    clearTypeTimer();
    setTypingOut(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSending(true);
    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, content: formatChatText(m.content) }));
      const data = await sendChatMessage({
        message: text,
        sessionId,
        history,
      });
      if (data.sessionId) {
        sessionStorage.setItem(SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
      }
      revealAssistantReply(data.reply);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Something went wrong.';
      revealAssistantReply(friendlyChatError(raw));
    }
  }, [input, sending, typingOut, messages, sessionId, revealAssistantReply]);

  if (loading) return null;
  if (!settings) return null;
  if (!settings.enabled && !devForceEnabled) return null;

  return (
    <div className={styles.root} aria-live="polite">
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat with John Buchan Homes">
          <header className={styles.header}>
            <h2 className={styles.headerTitle}>Ask Buchan Homes</h2>
            <p className={styles.headerSub}>Custom homes &amp; renovations in the Pacific Northwest</p>
          </header>
          <div className={styles.quickActions}>
            <a className={styles.quickBtn} href={phoneHref}>
              Call {phone}
            </a>
            <a className={styles.quickBtn} href={hubspotUrl} target="_blank" rel="noopener noreferrer">
              Book with Mischelle
            </a>
          </div>
          <div className={styles.messages} ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant} ${m.streaming ? styles.bubbleStreaming : ''}`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div
                className={`${styles.bubble} ${styles.bubbleAssistant} ${styles.typingBubble}`}
                aria-live="polite"
                aria-label="Writing a reply"
              >
                <span className={styles.typingDots} aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
          >
            <textarea
              className={styles.input}
              rows={1}
              maxLength={1000}
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              disabled={sending || typingOut}
              aria-label="Your message"
            />
            <button type="submit" className={styles.send} disabled={sending || typingOut || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
      {!open && showAttention && (
        <div className={styles.teaser} aria-hidden="true">
          Questions? Ask us
        </div>
      )}
      <div
        className={`${styles.togglePulse} ${!open && showAttention ? styles.togglePulseActive : ''}`}
      >
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5v-3.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M8 10.5h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
