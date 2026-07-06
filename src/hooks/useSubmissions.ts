import { useCallback, useEffect, useState } from 'react';
import type { Submission, SubmissionStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_SUBMISSIONS } from '../data/demo';

export function useSubmissions(admin = false) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setSubmissions(DEMO_SUBMISSIONS);
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setSubmissions((data as Submission[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load submissions');
      setSubmissions(DEMO_SUBMISSIONS);
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const createSubmission = async (data: Omit<Submission, 'id' | 'status' | 'created_at'>) => {
    if (!isSupabaseConfigured) {
      console.info('Demo mode: submission recorded locally', data);
      return;
    }
    const { error: err } = await supabase.from('submissions').insert({
      ...data,
      status: 'New',
    });
    if (err) throw err;
  };

  const updateSubmissionStatus = async (id: string, status: SubmissionStatus) => {
    if (!isSupabaseConfigured) {
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      return;
    }
    const { error: err } = await supabase.from('submissions').update({ status }).eq('id', id);
    if (err) throw err;
    await fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    if (!isSupabaseConfigured) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    const { error: err } = await supabase.from('submissions').delete().eq('id', id);
    if (err) throw err;
    await fetchSubmissions();
  };

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    createSubmission,
    updateSubmissionStatus,
    deleteSubmission,
  };
}
