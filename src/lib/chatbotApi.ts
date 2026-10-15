import { supabase, isSupabaseConfigured } from './supabase';

export async function invokeIndexKnowledge(body: { sourceId?: string; syncCms?: boolean }) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.functions.invoke('index-knowledge-source', { body });
  if (error) throw error;
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
  if (error) throw error;
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
