import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { chatCompletion, embedText } from '../_shared/openai.ts';
import { createAdminClient } from '../_shared/supabaseAdmin.ts';

const OFFICE = '2821 Northup Way, Suite 100, Bellevue, WA 98004';
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_CHARS = 1500;

type HistoryMessage = { role: 'user' | 'assistant'; content: string };

async function checkRateLimit(supabase: ReturnType<typeof createAdminClient>, bucketKey: string): Promise<boolean> {
  const now = new Date();
  const { data: row } = await supabase.from('chat_rate_limits').select('*').eq('bucket_key', bucketKey).maybeSingle();

  if (!row) {
    await supabase.from('chat_rate_limits').insert({
      bucket_key: bucketKey,
      request_count: 1,
      window_start: now.toISOString(),
    });
    return true;
  }

  const windowStart = new Date(row.window_start).getTime();
  if (now.getTime() - windowStart > RATE_WINDOW_MS) {
    await supabase.from('chat_rate_limits').upsert({
      bucket_key: bucketKey,
      request_count: 1,
      window_start: now.toISOString(),
    });
    return true;
  }

  if (row.request_count >= RATE_LIMIT) return false;

  await supabase
    .from('chat_rate_limits')
    .update({ request_count: row.request_count + 1 })
    .eq('bucket_key', bucketKey);
  return true;
}

function buildSystemPrompt(settings: {
  phone: string;
  hubspot_meeting_url: string;
  system_prompt_append: string;
}, contextBlock: string): string {
  return `You are the in-house concierge assistant for John Buchan Homes — a family-owned custom home builder serving Bellevue and the Greater Eastside since 1961. You help prospective clients the way a knowledgeable team member would: clear, warm, and grounded in what the company actually does.

Voice:
- Warm, polished, and professional — never stiff, never salesy, never generic brochure language.
- Write like a trusted guide: short paragraphs, plain English, specific details when you have them.
- Prefer concrete facts from CONTEXT (neighborhoods, process steps, services, history, people) over vague praise.
- Avoid filler such as "trusted name in the industry," "rich history," "personalized to unique needs," or "commitment to quality" unless you are restating a specific fact from context.
- Do not say you are an AI, a bot, a language model, or "just an assistant." Do not claim to be a named person on the team either.
- Never invent pricing, timelines, warranties, policies, or project details.

Answering:
- Use CONTEXT and the contact facts below as your source of truth.
- If CONTEXT has relevant detail, lead with it and be specific.
- If CONTEXT is thin or missing the answer, say so honestly in one short line, then suggest a call with Mischelle as the way to get a real answer.
- For "who is Buchan / tell me about you" questions, cover founding year, Eastside focus, custom homes & renovations, and the experience of building with the team, using whatever specifics CONTEXT provides.
- Context lines may start with "Source: <title> (<url>)". Share a page link only when it genuinely helps the visitor dig deeper.
- Keep replies concise: usually 2–4 short sentences, or a brief numbered list when it helps clarity.
- Never use Markdown. No asterisks, no **bold**, no _italics_, no # headings, no backticks.
- For numbered steps write "1. Title — explanation" in plain text. Put each step on its own line.
- Write URLs as full https:// links, never markdown like [here](url).

Guiding the conversation (your goal is a call with Mischelle McCall, Client Concierge):
- Always answer the visitor's question first. Then, if you don't know it yet, ask ONE short, friendly question to understand their project. In order of usefulness: what they're planning (custom home on their own lot, major renovation, ADU, something else); the city the property is in; whether they already own the lot or home; their timing. Never ask more than one question in a reply and never ask for something they already told you.
- The chat window already has buttons to book a call and to phone the office. Do NOT paste the booking link or phone number in every reply; only share them if the visitor asks how to reach someone.
- Offer the call when the visitor has shared at least two project details, asks about cost, budget, timeline, availability or next steps, or asks to speak with someone. Make the offer in one sentence that refers to their project (for example: "Mischelle can walk through your Medina renovation and a realistic budget range on a short call."), then put the token [[BOOK]] on its own final line. The website turns [[BOOK]] into a booking button.
- Use [[BOOK]] at most once every three replies, and not in your first reply unless they ask to talk to someone.
- If they don't want to book, mention that Mischelle can call them instead using the "leave your number" option in the chat. Never pressure.

Contact facts (always accurate):
- Phone: ${settings.phone}
- Book a meeting with Mischelle (Client Concierge): ${settings.hubspot_meeting_url}
- Office: ${OFFICE}

${settings.system_prompt_append ? `Additional instructions:\n${settings.system_prompt_append}` : ''}

CONTEXT:
${contextBlock || '(No matching knowledge base excerpts.)'}`;
}

/** User-safe message; full detail stays in Edge Function logs. */
function toPublicChatError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('insufficient_quota') || lower.includes('billing') || lower.includes('exceeded your current quota')) {
    return 'Chat is temporarily unavailable. Please call us or book a meeting using the buttons above.';
  }
  if (lower.includes('invalid_api_key') || lower.includes('incorrect api key')) {
    return 'Chat is not available right now. Please call us or book a meeting.';
  }
  if (lower.includes('rate_limit') || lower.includes('too many requests')) {
    return 'We are receiving many questions right now. Please try again in a moment or call us.';
  }
  if (raw.startsWith('OpenAI')) {
    return 'We could not reach our assistant. Please call us or book a meeting using the buttons above.';
  }
  return 'Something went wrong. Please call us or book a meeting using the buttons above.';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) return jsonResponse({ error: 'Chat is not configured' }, 503);

    const supabase = createAdminClient();
    const { data: settingsRows } = await supabase.from('chatbot_settings').select('*').limit(1);
    const settings = settingsRows?.[0];
    if (!settings?.enabled) {
      return jsonResponse({ error: 'Chat is disabled' }, 503);
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const body = await req.json();
    const { message, sessionId, history } = body as {
      message?: string;
      sessionId?: string;
      history?: HistoryMessage[];
    };

    if (typeof message !== 'string' || !message.trim()) return jsonResponse({ error: 'message required' }, 400);
    if (message.length > MAX_MESSAGE_CHARS) {
      return jsonResponse({ error: `Please keep questions under ${MAX_MESSAGE_CHARS} characters.` }, 400);
    }

    // Limit per visitor IP. (The session id comes from the browser, so it must not be
    // part of the key: changing it would otherwise reset the limit.)
    const bucketKey = `chat:${ip}`.slice(0, 120);
    const allowed = await checkRateLimit(supabase, bucketKey);
    if (!allowed) return jsonResponse({ error: 'Too many requests. Please call us or try again later.' }, 429);

    const sid = typeof sessionId === 'string' && sessionId ? sessionId.slice(0, 64) : crypto.randomUUID();
    await supabase.from('chat_logs').insert({ session_id: sid, role: 'user', message: message.trim() });

    const queryEmbedding = await embedText(openaiKey, message.trim());
    const { data: matches, error: matchErr } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 12,
    });
    if (matchErr) throw matchErr;

    const sourceIds = [...new Set((matches ?? []).map((m: { source_id: string }) => m.source_id))];
    const { data: sources } = await supabase.from('knowledge_sources').select('id, title').in('id', sourceIds);
    const titleById = new Map((sources ?? []).map((s: { id: string; title: string }) => [s.id, s.title]));

    const contextBlock = (matches ?? [])
      .map((m: { content: string; source_id: string; similarity: number }) => {
        const title = titleById.get(m.source_id) ?? 'Source';
        return `[${title}]\n${m.content}`;
      })
      .join('\n\n');

    const system = buildSystemPrompt(settings, contextBlock);
    const trimmedHistory = (Array.isArray(history) ? history : [])
      .slice(-6)
      .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CHARS) }));
    const rawReply = await chatCompletion(openaiKey, system, [
      ...trimmedHistory,
      { role: 'user', content: message.trim() },
    ]);
    // The model marks "offer a booking now" with [[BOOK]]; strip it and send a flag instead.
    const BOOK_MARK = /\[\[\s*BOOK\s*\]\]/gi;
    const suggestBooking = /\[\[\s*BOOK\s*\]\]/i.test(rawReply);
    const reply = rawReply.replace(BOOK_MARK, '').trim();

    await supabase
      .from('chat_logs')
      .insert({ session_id: sid, role: 'assistant', message: suggestBooking ? `${reply}\n[offered booking]` : reply });

    const citations = (matches ?? []).slice(0, 3).map((m: { source_id: string }) => ({
      sourceId: m.source_id,
      title: titleById.get(m.source_id) ?? 'Source',
    }));

    return jsonResponse({
      reply,
      suggestBooking,
      sessionId: sid,
      citations,
      ctas: {
        phone: settings.phone,
        phoneHref: settings.phone_href,
        hubspotMeetingUrl: settings.hubspot_meeting_url,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Chat failed';
    console.error('chat error:', message);
    return jsonResponse({ error: toPublicChatError(message) }, 500);
  }
});
