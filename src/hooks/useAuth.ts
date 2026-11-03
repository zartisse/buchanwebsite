import { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Admin role check (database is_admin(), added in migration 012). The database
  // policies are the real protection; this only decides what the admin UI shows.
  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }
    let cancelled = false;
    setRoleLoading(true);
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (cancelled) return;
      // If migration 012 has not been applied yet the function is missing:
      // fall back to the previous behaviour so existing admins are not locked out.
      setIsAdmin(error ? true : data === true);
      setRoleLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading: loading || (user !== null && roleLoading),
    isAdmin,
    signIn,
    signOut,
    isConfigured: isSupabaseConfigured,
  };
}
