import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeSource, KnowledgeSourceType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { invokeIndexKnowledge } from '../lib/chatbotApi';

export function useKnowledgeSources() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setSources([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('updated_at', { ascending: false });
      if (err) throw err;
      setSources((data as KnowledgeSource[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load knowledge sources');
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const saveSource = async (
    input: Partial<KnowledgeSource> & { type: KnowledgeSourceType; title: string },
  ) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const payload = {
      type: input.type,
      title: input.title,
      source_url: input.source_url ?? '',
      storage_path: input.storage_path ?? '',
      body_text: input.body_text ?? '',
      metadata: input.metadata ?? {},
      status: 'pending' as const,
      error_message: '',
    };

    if (input.id) {
      const { error: err } = await supabase.from('knowledge_sources').update(payload).eq('id', input.id);
      if (err) throw err;
      await fetchSources();
      return input.id;
    }

    const { data, error: err } = await supabase.from('knowledge_sources').insert(payload).select('id').single();
    if (err) throw err;
    await fetchSources();
    return data.id as string;
  };

  const deleteSource = async (id: string) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error: err } = await supabase.from('knowledge_sources').delete().eq('id', id);
    if (err) throw err;
    await fetchSources();
  };

  const indexSource = async (sourceId: string) => {
    await invokeIndexKnowledge({ sourceId });
    await fetchSources();
  };

  const syncWebsiteContent = async () => {
    await invokeIndexKnowledge({ syncCms: true });
    await fetchSources();
  };

  return {
    sources,
    loading,
    error,
    refetch: fetchSources,
    saveSource,
    deleteSource,
    indexSource,
    syncWebsiteContent,
  };
}
