import { supabase, isSupabaseConfigured } from './supabase';

async function functionErrorMessage(error: unknown, data: unknown): Promise<string> {
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    return String(data.error);
  }
  const err = error as { context?: Response; message?: string };
  if (err?.context && typeof err.context.json === 'function') {
    try {
      const body = await err.context.json();
      if (body && typeof body === 'object' && 'error' in body && body.error) {
        return String(body.error);
      }
    } catch {
      /* ignore */
    }
  }
  return err?.message ?? 'Request failed';
}

export function friendlyChatError(message: string): string {
  if (message.includes('Chat is disabled')) {
    return 'Chat is turned off on the site right now. Please call us or book a meeting using the buttons above, or ask an admin to enable the widget under Knowledge & Chatbot.';
  }
  if (message.includes('Chat is not configured')) {
    return 'Chat is not set up yet. Please call us or book a meeting using the buttons above.';
  }
  return message;
}

export async function invokeIndexKnowledge(body: {
  sourceId?: string;
  syncCms?: boolean;
  crawlStart?: string;
  crawlStep?: string;
  crawlStop?: string;
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.functions.invoke('index-knowledge-source', { body });
  if (error) throw new Error(await functionErrorMessage(error, data));
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }
  return data;
}

export async function sendChatMessage(payload: {
  message: string;
  sessionId?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.functions.invoke('chat', { body: payload });
  if (error) throw new Error(await functionErrorMessage(error, data));
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }
  return data as {
    reply: string;
    sessionId: string;
    citations?: { sourceId: string; title: string }[];
    ctas?: { phone: string; phoneHref: string; hubspotMeetingUrl: string };
  };
}
