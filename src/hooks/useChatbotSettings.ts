import { useCallback, useEffect, useState } from 'react';
import type { ChatbotSettings } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_SETTINGS: Omit<ChatbotSettings, 'id' | 'updated_at'> = {
  enabled: true,
  phone: '425.827.2266',
  phone_href: 'tel:4258272266',
  hubspot_meeting_url: 'https://meetings-na2.hubspot.com/mischelle-mccall',
  welcome_message:
    'Hi! I can answer questions about John Buchan Homes, custom builds, and renovations. How can I help?',
  system_prompt_append: '',
};

export function useChatbotSettings(admin = false) {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setSettings({
        id: 'demo',
        updated_at: new Date().toISOString(),
        ...DEFAULT_SETTINGS,
        enabled: false,
      });
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase.from('chatbot_settings').select('*').limit(1).maybeSingle();
      if (err) throw err;
      if (data) {
        setSettings(data as ChatbotSettings);
      } else {
        setSettings({
          id: 'local',
          updated_at: new Date().toISOString(),
          ...DEFAULT_SETTINGS,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load chatbot settings');
      setSettings({
        id: 'fallback',
        updated_at: new Date().toISOString(),
        ...DEFAULT_SETTINGS,
        enabled: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (patch: Partial<ChatbotSettings>) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const current = settings;
    const payload = {
      enabled: patch.enabled ?? current?.enabled ?? DEFAULT_SETTINGS.enabled,
      phone: patch.phone ?? current?.phone ?? DEFAULT_SETTINGS.phone,
      phone_href: patch.phone_href ?? current?.phone_href ?? DEFAULT_SETTINGS.phone_href,
      hubspot_meeting_url:
        patch.hubspot_meeting_url ?? current?.hubspot_meeting_url ?? DEFAULT_SETTINGS.hubspot_meeting_url,
      welcome_message: patch.welcome_message ?? current?.welcome_message ?? DEFAULT_SETTINGS.welcome_message,
      system_prompt_append:
        patch.system_prompt_append ?? current?.system_prompt_append ?? DEFAULT_SETTINGS.system_prompt_append,
    };

    if (current?.id && current.id !== 'demo' && current.id !== 'fallback' && current.id !== 'local') {
      const { error: err } = await supabase.from('chatbot_settings').update(payload).eq('id', current.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from('chatbot_settings').insert(payload);
      if (err) throw err;
    }
    await fetchSettings();
  };

  return { settings, loading, error, refetch: fetchSettings, saveSettings, admin };
}
