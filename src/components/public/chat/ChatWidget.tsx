import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatbotSettings } from '../../../hooks/useChatbotSettings';
import { useSubmissions } from '../../../hooks/useSubmissions';
import { friendlyChatError, sendChatMessage } from '../../../lib/chatbotApi';
import { pushEvent, trackLead } from '../../../lib/analytics';
import { BOOK_TOKEN, chatContextForPath, findEmail, meetingEmbedUrl } from './chatContext';
import styles from './ChatWidget.module.css';

const SESSION_KEY = 'buchan-chat-session-id';
const TEASER_SEEN_KEY = 'buchan-chat-teaser-seen';
const TEASER_DELAY_MS = 12_000;
const TEASER_VISIBLE_MS = 22_000;
/** If the model hasn't offered a call by this many visitor messages, offer one softly. */
const SOFT_BOOK_AFTER = 3;

const CONCIERGE = {
  name: 'Mischelle McCall',
  role: 'Client Concierge',
  hours: 'Mon–Fri, 8–4 PT',
  photo: 'https://245645669.fs1.hubspotusercontent-na2.net/hubfs/245645669/mischelle-head-shot-26-1024x768.jpg',
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  /** Show the "book a call with Mischelle" card under this reply */
  bookCard?: boolean;
};

type View = 'chat' | 'calendar' | 'callback';

type Lead = { name?: string; email?: string; phone?: string };

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

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
  const existing = readSession(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  writeSession(SESSION_KEY, id);
  return id;
}

function track(event: string, data: Record<string, unknown> = {}) {
  pushEvent({ event, chat_page: typeof window !== 'undefined' ? window.location.pathname : '', ...data });
}

const devForceEnabled = import.meta.env.VITE_CHATBOT_ENABLED === 'true';

export function ChatWidget() {
  const { settings, loading } = useChatbotSettings(false);
  const { createSubmission } = useSubmissions();
  const { pathname } = useLocation();
  const pageCtx = useMemo(() => chatContextForPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingOut, setTypingOut] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [lead, setLead] = useState<Lead>({});
  const [booked, setBooked] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackSaving, setCallbackSaving] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const typeTimerRef = useRef<number | null>(null);
  const userMessageCount = useRef(0);
  const bookOffered = useRef(false);

  const phone = settings?.phone ?? '425.827.2266';
  const phoneHref = settings?.phone_href ?? 'tel:4258272266';
  const hubspotUrl = settings?.hubspot_meeting_url ?? 'https://meetings-na2.hubspot.com/mischelle-mccall';

  const clearTypeTimer = () => {
    if (typeTimerRef.current != null) {
      window.clearTimeout(typeTimerRef.current);
      typeTimerRef.current = null;
    }
  };

  useEffect(() => () => clearTypeTimer(), []);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // ---- Page-aware teaser: appears once per page per session, after a short delay ----
  useEffect(() => {
    setTeaserVisible(false);
    if (open || !pageCtx.teaser) return;
    const seenKey = `${TEASER_SEEN_KEY}:${pageCtx.key}`;
    if (readSession(seenKey) === '1') return;
    let hideTimer: number | undefined;
    const showTimer = window.setTimeout(() => {
      setTeaserVisible(true);
      writeSession(seenKey, '1');
      track('chat_teaser_shown', { chat_context: pageCtx.key });
      hideTimer = window.setTimeout(() => setTeaserVisible(false), TEASER_VISIBLE_MS);
    }, TEASER_DELAY_MS);
    return () => {
      window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [pageCtx, open]);

  // ---- Welcome message ----
  useEffect(() => {
    if (open && settings?.welcome_message && messages.length === 0) {
      setMessages([{ role: 'assistant', content: settings.welcome_message }]);
    }
  }, [open, settings?.welcome_message, messages.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, view]);

  // ---- HubSpot calendar: detect a completed booking ----
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!/hubspot/i.test(e.origin)) return;
      const data = e.data as { meetingBookSucceeded?: boolean } | null;
      if (!data || !data.meetingBookSucceeded) return;
      setBooked(true);
      track('chat_booking_completed');
      trackLead({ form: 'Chat booking', topic: 'Call with Mischelle' });
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const openChat = useCallback((trigger: 'button' | 'teaser') => {
    setOpen(true);
    setTeaserVisible(false);
    track('chat_open', { chat_trigger: trigger, chat_context: pageCtx.key });
  }, [pageCtx.key]);

  const openCalendar = useCallback((location: string) => {
    setView('calendar');
    track('chat_book_click', { chat_cta_location: location });
  }, []);

  const openCallback = useCallback((location: string) => {
    setView('callback');
    setCallbackError(null);
    track('chat_callback_open', { chat_cta_location: location });
  }, []);

  const revealAssistantReply = useCallback((fullText: string, bookCard: boolean) => {
    const text = formatChatText(fullText);
    if (!text) {
      setSending(false);
      setTypingOut(false);
      return;
    }

    if (prefersReducedMotion()) {
      setMessages((prev) => [...prev, { role: 'assistant', content: text, bookCard }]);
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
      const done = index >= text.length;
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant' && last.streaming) {
          next[next.length - 1] = { ...last, content: slice, streaming: !done, bookCard: done ? bookCard : undefined };
        }
        return next;
      });
      if (!done) {
        typeTimerRef.current = window.setTimeout(step, 16);
      } else {
        typeTimerRef.current = null;
        setTypingOut(false);
      }
    };
    typeTimerRef.current = window.setTimeout(step, 180);
  }, []);

  const sendText = useCallback(async (raw: string, via: 'typed' | 'starter') => {
    const text = raw.trim();
    if (!text || sending || typingOut) return;
    setInput('');
    clearTypeTimer();
    setTypingOut(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSending(true);
    userMessageCount.current += 1;
    const email = findEmail(text);
    if (email) setLead((l) => ({ ...l, email }));
    track('chat_message_sent', { chat_message_index: userMessageCount.current, chat_input: via });

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: formatChatText(m.content) + (m.bookCard ? '\n[Offered a call with Mischelle]' : ''),
        }));
      const data = await sendChatMessage({ message: text, sessionId, history });
      if (data.sessionId) {
        writeSession(SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
      }
      const reply = String(data.reply ?? '');
      const modelOffered = Boolean(data.suggestBooking) || BOOK_TOKEN.test(reply);
      BOOK_TOKEN.lastIndex = 0;
      const softOffer = !bookOffered.current && userMessageCount.current >= SOFT_BOOK_AFTER;
      const showCard = !booked && (modelOffered || softOffer);
      if (showCard) {
        bookOffered.current = true;
        track('chat_book_offered', { chat_offer: modelOffered ? 'assistant' : 'auto' });
      }
      revealAssistantReply(reply.replace(BOOK_TOKEN, '').trim(), showCard);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      revealAssistantReply(friendlyChatError(message), false);
    }
  }, [sending, typingOut, messages, sessionId, booked, revealAssistantReply]);

  const submitCallback = useCallback(async (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const phoneValue = String(fd.get('phone') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const bestTime = String(fd.get('best_time') ?? '').trim();
    if (!name || !phoneValue) {
      setCallbackError('Please add your name and a phone number.');
      return;
    }
    setCallbackSaving(true);
    setCallbackError(null);
    const visitorNotes = messages
      .filter((m) => m.role === 'user')
      .map((m) => `• ${m.content}`)
      .slice(-8)
      .join('\n');
    try {
      await createSubmission({
        name,
        email,
        phone: phoneValue,
        subject: 'Chat: please call me back',
        message: [
          `Best time to call: ${bestTime || 'Any time'}`,
          `Page: ${pathname}`,
          visitorNotes ? `\nWhat they asked in the chat:\n${visitorNotes}` : '',
        ].filter(Boolean).join('\n'),
        source: 'Chat callback',
      });
      setLead({ name, email: email || lead.email, phone: phoneValue });
      setCallbackSent(true);
      track('chat_callback_submitted', { chat_best_time: bestTime || 'Any time' });
    } catch {
      setCallbackError(`That didn't go through. Please call ${phone} instead.`);
    } finally {
      setCallbackSaving(false);
    }
  }, [createSubmission, messages, pathname, phone, lead.email]);

  if (loading) return null;
  if (!settings) return null;
  if (!settings.enabled && !devForceEnabled) return null;

  const showStarters = view === 'chat' && messages.length <= 1 && !sending && !typingOut;
  const calendarSrc = meetingEmbedUrl(hubspotUrl, lead);

  return (
    <div className={styles.root} aria-live="polite">
      {open && (
        <div
          className={`${styles.panel} ${view === 'calendar' ? styles.panelWide : ''}`}
          role="dialog"
          aria-label="Chat with John Buchan Homes"
        >
          <header className={styles.header}>
            <div>
              <h2 className={styles.headerTitle}>Ask Buchan Homes</h2>
              <p className={styles.headerSub}>Custom homes &amp; renovations · Bellevue &amp; the Greater Eastside</p>
            </div>
            <button type="button" className={styles.headerClose} onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className={styles.concierge}>
            <span className={styles.avatar} aria-hidden>
              {!photoFailed ? (
                <img src={CONCIERGE.photo} alt="" loading="lazy" onError={() => setPhotoFailed(true)} />
              ) : (
                'MM'
              )}
            </span>
            <span className={styles.conciergeText}>
              <strong>{CONCIERGE.name}</strong>
              <span>{CONCIERGE.role} · {CONCIERGE.hours}</span>
            </span>
            <span className={styles.conciergeActions}>
              <button type="button" className={styles.conciergeBtnPrimary} onClick={() => openCalendar('header')}>
                Book a call
              </button>
              <a
                className={styles.conciergeIconBtn}
                href={phoneHref}
                onClick={() => track('chat_call_click')}
                aria-label={`Call ${phone}`}
                title={`Call ${phone}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6.6 3.5h2.6l1.4 4-1.9 1.3a11 11 0 0 0 5.5 5.5l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </a>
            </span>
          </div>

          {view === 'calendar' && (
            <div className={styles.calendarView}>
              <div className={styles.subBar}>
                <button type="button" className={styles.backBtn} onClick={() => setView('chat')}>← Back to chat</button>
                <a
                  className={styles.subBarLink}
                  href={meetingEmbedUrl(hubspotUrl, lead, false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('chat_calendar_new_tab')}
                >
                  Open in new tab
                </a>
              </div>
              {booked ? (
                <div className={styles.confirm}>
                  <strong>You&apos;re booked with Mischelle.</strong>
                  <p>A confirmation email is on its way with the details. If anything changes, call {phone}.</p>
                  <button type="button" className={styles.backBtn} onClick={() => setView('chat')}>Back to chat</button>
                </div>
              ) : (
                <iframe
                  title="Book a call with Mischelle McCall"
                  src={calendarSrc}
                  className={styles.calendarFrame}
                  onLoad={() => track('chat_calendar_view')}
                />
              )}
            </div>
          )}

          {view === 'callback' && (
            <div className={styles.callbackView}>
              <div className={styles.subBar}>
                <button type="button" className={styles.backBtn} onClick={() => setView('chat')}>← Back to chat</button>
              </div>
              {callbackSent ? (
                <div className={styles.confirm}>
                  <strong>Thank you. Mischelle will call you.</strong>
                  <p>She&apos;ll reach out during business hours ({CONCIERGE.hours}). Prefer to pick a time yourself?</p>
                  <button type="button" className={styles.conciergeBtnPrimary} onClick={() => openCalendar('callback_done')}>
                    Choose a time
                  </button>
                </div>
              ) : (
                <form
                  className={styles.callbackForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submitCallback(e.currentTarget);
                  }}
                >
                  <p className={styles.callbackIntro}>
                    Leave your number and Mischelle will call you to talk through your project. No obligation.
                  </p>
                  <label className={styles.cbLabel}>
                    Name
                    <input name="name" className={styles.cbInput} autoComplete="name" required defaultValue={lead.name ?? ''} />
                  </label>
                  <label className={styles.cbLabel}>
                    Phone
                    <input name="phone" type="tel" className={styles.cbInput} autoComplete="tel" required defaultValue={lead.phone ?? ''} />
                  </label>
                  <label className={styles.cbLabel}>
                    Email <span>(optional)</span>
                    <input name="email" type="email" className={styles.cbInput} autoComplete="email" defaultValue={lead.email ?? ''} />
                  </label>
                  <label className={styles.cbLabel}>
                    Best time to call
                    <select name="best_time" className={styles.cbInput} defaultValue="Any time">
                      <option>Any time</option>
                      <option>Morning</option>
                      <option>Midday</option>
                      <option>Afternoon</option>
                    </select>
                  </label>
                  {callbackError && <p className={styles.cbError} role="alert">{callbackError}</p>}
                  <button type="submit" className={styles.conciergeBtnPrimary} disabled={callbackSaving}>
                    {callbackSaving ? 'Sending…' : 'Have Mischelle call me'}
                  </button>
                </form>
              )}
            </div>
          )}

          {view === 'chat' && (
            <>
              <div className={styles.messages} ref={listRef}>
                {messages.map((m, i) => (
                  <div key={`${m.role}-${i}`} className={styles.messageGroup}>
                    <div
                      className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant} ${m.streaming ? styles.bubbleStreaming : ''}`}
                    >
                      {m.content}
                    </div>
                    {m.bookCard && !booked && (
                      <div className={styles.bookCard}>
                        <span className={styles.bookCardAvatar} aria-hidden>
                          {!photoFailed ? <img src={CONCIERGE.photo} alt="" loading="lazy" /> : 'MM'}
                        </span>
                        <div className={styles.bookCardBody}>
                          <strong>Talk it through with Mischelle</strong>
                          <span>A short call to talk through your project, budget range and next steps.</span>
                          <div className={styles.bookCardActions}>
                            <button type="button" className={styles.conciergeBtnPrimary} onClick={() => openCalendar('reply_card')}>
                              Pick a time
                            </button>
                            <button type="button" className={styles.linkBtn} onClick={() => openCallback('reply_card')}>
                              Or have her call me
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
                {showStarters && (
                  <div className={styles.starters}>
                    {pageCtx.starters.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={styles.starter}
                        onClick={() => {
                          track('chat_starter_click', { chat_starter: q });
                          void sendText(q, 'starter');
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.callbackStrip}>
                <button type="button" className={styles.linkBtn} onClick={() => openCallback('strip')}>
                  Prefer a call back? Leave your number
                </button>
              </div>
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendText(input, 'typed');
                }}
              >
                <textarea
                  className={styles.input}
                  rows={1}
                  maxLength={1000}
                  placeholder="Tell us about your project…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void sendText(input, 'typed');
                    }
                  }}
                  disabled={sending || typingOut}
                  aria-label="Your message"
                />
                <button type="submit" className={styles.send} disabled={sending || typingOut || !input.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
      {!open && teaserVisible && pageCtx.teaser && (
        <div className={styles.teaser}>
          <button type="button" className={styles.teaserText} onClick={() => openChat('teaser')}>
            {pageCtx.teaser}
          </button>
          <button
            type="button"
            className={styles.teaserClose}
            onClick={() => setTeaserVisible(false)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      <div className={`${styles.togglePulse} ${!open && teaserVisible ? styles.togglePulseActive : ''}`}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => (open ? setOpen(false) : openChat('button'))}
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
