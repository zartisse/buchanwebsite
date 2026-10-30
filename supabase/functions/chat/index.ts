import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { chatCompletion, embedText } from '../_shared/openai.ts';
import { createAdminClient } from '../_shared/supabaseAdmin.ts';

const OFFICE = '2821 Northup Way, Suite 100, Bellevue, WA 98004';
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 60 * 1000;

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
  return `You are the in-house concierge assistant for John Buchan Homes — a multi-generation custom home builder on the Seattle Eastside since 1961. You help prospective clients the way a knowledgeable team member would: clear, warm, and grounded in what the company actually does.

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
- If CONTEXT is thin or missing the answer, say so honestly in one short line, then offer a helpful next step (call or book with Mischelle).
- For "who is Buchan / tell me about you" questions, cover founding year, Eastside focus, custom homes & renovations, and the experience of building with the team — using whatever specifics CONTEXT provides.
- When inviting a conversation, mention Mischelle (Client Concierge) by name and offer both the booking link and phone.
- Context lines may start with "Source: <title> (<url>)". Share a page link only when it genuinely helps the visitor dig deeper.
- Keep replies concise: usually 2–4 short sentences, or a brief list when it helps clarity.

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

    if (!message?.trim()) return jsonResponse({ error: 'message required' }, 400);

    const bucketKey = `${ip}:${sessionId ?? 'anon'}`.slice(0, 120);
    const allowed = await checkRateLimit(supabase, bucketKey);
    if (!allowed) return jsonResponse({ error: 'Too many requests. Please call us or try again later.' }, 429);

    const sid = sessionId ?? crypto.randomUUID();
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
    const trimmedHistory = (history ?? []).slice(-6).filter(
      (m) => m.role === 'user' || m.role === 'assistant',
    );
    const reply = await chatCompletion(openaiKey, system, [
      ...trimmedHistory,
      { role: 'user', content: message.trim() },
    ]);

    await supabase.from('chat_logs').insert({ session_id: sid, role: 'assistant', message: reply });

    const citations = (matches ?? []).slice(0, 3).map((m: { source_id: string }) => ({
      sourceId: m.source_id,
      title: titleById.get(m.source_id) ?? 'Source',
    }));

    return jsonResponse({
      reply,
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
