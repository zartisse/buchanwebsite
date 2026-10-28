import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CrawlProgress, KnowledgeSource, KnowledgeSourceType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { invokeIndexKnowledge } from '../lib/chatbotApi';

const STEP_RETRIES = 3;
const REFRESH_EVERY_STEPS = 4;

export type ActiveCrawl = { sourceId: string; progress: CrawlProgress | null; stopping: boolean };

export function useKnowledgeSources() {
  const [allSources, setAllSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCrawl, setActiveCrawl] = useState<ActiveCrawl | null>(null);
  const stopRequested = useRef(false);

  const fetchSources = useCallback(async () => {
    setError(null);
    if (!isSupabaseConfigured) {
      setAllSources([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('updated_at', { ascending: false });
      if (err) throw err;
      setAllSources((data as KnowledgeSource[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load knowledge sources');
      setAllSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const { sources, pagesByCrawl } = useMemo(() => {
    const top: KnowledgeSource[] = [];
    const children = new Map<string, KnowledgeSource[]>();
    for (const s of allSources) {
      if (s.parent_id) {
        const list = children.get(s.parent_id) ?? [];
        list.push(s);
        children.set(s.parent_id, list);
      } else {
        top.push(s);
      }
    }
    for (const list of children.values()) list.sort((a, b) => a.source_url.localeCompare(b.source_url));
    return { sources: top, pagesByCrawl: children };
  }, [allSources]);

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

  /** Runs a website crawl batch by batch until every discovered page is read (or Stop is pressed). */
  const runCrawl = async (sourceId: string, options: { resume?: boolean } = {}) => {
    stopRequested.current = false;
    setActiveCrawl({ sourceId, progress: null, stopping: false });
    try {
      if (!options.resume) {
        const started = (await invokeIndexKnowledge({ crawlStart: sourceId })) as CrawlProgress;
        setActiveCrawl({ sourceId, progress: started, stopping: false });
        await fetchSources();
      }

      let failures = 0;
      let steps = 0;
      let finished: CrawlProgress | null = null;
      while (!stopRequested.current) {
        try {
          const progress = (await invokeIndexKnowledge({ crawlStep: sourceId })) as CrawlProgress;
          failures = 0;
          setActiveCrawl((c) => (c ? { ...c, progress } : c));
          if (++steps % REFRESH_EVERY_STEPS === 0) await fetchSources();
          if (progress.done) {
            finished = progress;
            break;
          }
        } catch (e) {
          if (++failures >= STEP_RETRIES) throw e;
        }
      }

      if (stopRequested.current) {
        finished = (await invokeIndexKnowledge({ crawlStop: sourceId })) as CrawlProgress;
      }
      return finished;
    } finally {
      setActiveCrawl(null);
      await fetchSources();
    }
  };

  const stopCrawl = () => {
    stopRequested.current = true;
    setActiveCrawl((c) => (c ? { ...c, stopping: true } : c));
  };

  return {
    sources,
    pagesByCrawl,
    loading,
    error,
    refetch: fetchSources,
    saveSource,
    deleteSource,
    indexSource,
    syncWebsiteContent,
    activeCrawl,
    runCrawl,
    stopCrawl,
  };
}
