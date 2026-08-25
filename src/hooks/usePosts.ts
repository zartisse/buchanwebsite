import { useCallback, useEffect, useState } from 'react';
import type { Post } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getSchemaCapabilities } from '../lib/schemaCapabilities';
import { DEMO_POSTS } from '../data/demo';

const POST_LIST_COLUMNS = 'id,title,slug,category,status,date,excerpt,image_url,featured';
const POST_DETAIL_COLUMNS = 'id,title,slug,category,status,date,excerpt,body,image_url,meta_title,meta_description,featured';

export function usePosts(options?: { publishedOnly?: boolean; admin?: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      let data = DEMO_POSTS;
      if (options?.publishedOnly) data = data.filter((p) => p.status === 'Published');
      setPosts(data);
      setLoading(false);
      return;
    }
    try {
      let query = options?.admin
        ? supabase.from('posts').select('*')
        : supabase.from('posts').select(POST_LIST_COLUMNS);
      query = query.order('date', { ascending: false });
      if (options?.publishedOnly && !options?.admin) {
        query = query.eq('status', 'Published');
      }
      const { data, error: err } = await query;
      if (err) throw err;
      setPosts((data as unknown as Post[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
      if (options?.admin) {
        setPosts([]);
      } else {
        let data = DEMO_POSTS;
        if (options?.publishedOnly) data = data.filter((p) => p.status === 'Published');
        setPosts(data);
      }
    } finally {
      setLoading(false);
    }
  }, [options?.publishedOnly, options?.admin]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const savePost = async (post: Partial<Post> & { title: string }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const caps = await getSchemaCapabilities();
    const payload: Record<string, unknown> = {
      title: post.title,
      slug: post.slug,
      category: post.category,
      status: post.status,
      date: post.date,
      excerpt: post.excerpt ?? '',
      body: post.body ?? '',
      image_url: post.image_url ?? '',
      meta_title: post.meta_title ?? '',
      meta_description: post.meta_description ?? '',
    };
    if (caps.postsFeatured) payload.featured = post.featured ?? false;

    const run = (data: Record<string, unknown>) =>
      post.id
        ? supabase.from('posts').update(data).eq('id', post.id)
        : supabase.from('posts').insert(data);

    let { error: err } = await run(payload);
    if (err?.message.includes('featured') && 'featured' in payload) {
      const { featured: _, ...rest } = payload;
      ({ error: err } = await run(rest));
    }
    if (err) throw err;
    await fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error: err } = await supabase.from('posts').delete().eq('id', id);
    if (err) throw err;
    await fetchPosts();
  };

  return { posts, loading, error, refetch: fetchPosts, savePost, deletePost };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setPost(DEMO_POSTS.find((p) => p.slug === slug && p.status === 'Published') ?? null);
        setLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase
          .from('posts')
          .select(POST_DETAIL_COLUMNS)
          .eq('slug', slug)
          .eq('status', 'Published')
          .single();
        if (err) throw err;
        setPost(data as Post);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Post not found');
        setPost(DEMO_POSTS.find((p) => p.slug === slug && p.status === 'Published') ?? null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { post, loading, error };
}
