import { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { PostEditor } from '../../components/admin/PostEditor';
import { StatusPill } from '../../components/ui/StatusPill';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import { fmtDate } from '../../lib/utils';
import type { Post } from '../../types';
import styles from '../../styles/admin.module.css';

export function AdminPosts() {
  const { posts, loading, savePost, deletePost } = usePosts({ admin: true });
  const [editing, setEditing] = useState<Post | null | 'new'>(null);

  if (editing !== null) {
    return (
      <PostEditor
        post={editing === 'new' ? undefined : editing}
        onSave={async (data) => {
          await savePost(data);
          toast('Saved ✓');
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <>
      <PageMeta title="Blog Posts" />
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSub}>Manage journal entries and company news.</p>
        </div>
        <button type="button" className={styles.btnPrimary} onClick={() => setEditing('new')}>New Post</button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td><StatusPill status={p.status} /></td>
                <td>{fmtDate(p.date)}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className={styles.btn} onClick={() => setEditing(p)}>Edit</button>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={async () => {
                      if (window.confirm(`Delete "${p.title}"?`)) {
                        await deletePost(p.id);
                        toast('Post deleted');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
