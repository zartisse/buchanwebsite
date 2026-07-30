import { useState } from 'react';
import type { Post, PostCategory, PostStatus } from '../../types';
import { slugify } from '../../lib/utils';
import { ImageDropzone } from './ImageDropzone';
import { PageMeta } from '../ui/PageMeta';
import styles from '../../styles/admin.module.css';

interface PostEditorProps {
  post?: Post;
  onSave: (data: Partial<Post> & { title: string }) => Promise<void>;
  onCancel: () => void;
}

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [autoSlug, setAutoSlug] = useState(!post);
  const [category, setCategory] = useState<PostCategory>(post?.category ?? 'Company Updates');
  const [status, setStatus] = useState<PostStatus>(post?.status ?? 'Draft');
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? '/assets/ph-arch-1.png');
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? '');
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (autoSlug) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: post?.id,
        title,
        slug: slug || slugify(title),
        category,
        status,
        date,
        excerpt,
        body,
        image_url: imageUrl,
        meta_title: metaTitle,
        meta_description: metaDescription,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta title={post ? 'Edit Post' : 'New Post'} />
      <h1 className={styles.pageTitle}>{post ? 'Edit Post' : 'New Post'}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Slug</label>
          <input className={styles.input} value={slug} onChange={(e) => { setAutoSlug(false); setSlug(e.target.value); }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
              <option>Company Updates</option>
              <option>Industry News</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as PostStatus)}>
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input type="date" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Body</label>
          <textarea className={styles.textarea} value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
        </div>
        <ImageDropzone
          label="Hero Image"
          folder="posts"
          value={imageUrl}
          onChange={setImageUrl}
        />
        <div className={styles.field}>
          <label className={styles.label}>Meta Title ({metaTitle.length}/60)</label>
          <input className={styles.input} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Meta Description ({metaDescription.length}/160)</label>
          <textarea className={styles.textarea} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}
