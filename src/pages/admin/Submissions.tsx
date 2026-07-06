import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import { fmtDateTime, initials } from '../../lib/utils';
import type { Submission } from '../../types';
import styles from '../../styles/admin.module.css';

type Filter = 'all' | 'new' | 'archived';

export function AdminSubmissions() {
  const { submissions, loading, updateSubmissionStatus, deleteSubmission } = useSubmissions(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filter === 'new') return s.status === 'New';
    if (filter === 'archived') return s.status === 'Archived';
    return s.status !== 'Archived';
  });

  const openSub = submissions.find((s) => s.id === openId);

  const handleOpen = async (sub: Submission) => {
    setOpenId(sub.id);
    if (sub.status === 'New') {
      await updateSubmissionStatus(sub.id, 'Read');
    }
  };

  return (
    <>
      <PageMeta title="Submissions" />
      <h1 className={styles.pageTitle}>Submissions</h1>
      <p className={styles.pageSub}>Contact form inquiries from the website.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['all', 'new', 'archived'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={styles.btn}
            style={filter === f ? { background: '#1A2420', color: '#F5F0E8' } : undefined}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Inbox' : f === 'new' ? 'New' : 'Archived'}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: openSub ? '1fr 1.2fr' : '1fr', gap: 24 }}>
          <div>
            {filtered.length === 0 ? (
              <p style={{ color: 'rgba(26,36,32,0.5)' }}>No submissions in this view.</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleOpen(s)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: openId === s.id ? '#FBF9F5' : '#fff',
                    border: '1px solid rgba(26,36,32,0.1)',
                    borderLeft: s.status === 'New' ? '3px solid #B0824C' : '1px solid rgba(26,36,32,0.1)',
                    padding: '16px 18px',
                    marginBottom: 8,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{s.name}</strong>
                    <span style={{ fontSize: 12, color: 'rgba(26,36,32,0.45)' }}>{fmtDateTime(s.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(26,36,32,0.6)', marginTop: 4 }}>{s.subject}</div>
                </button>
              ))
            )}
          </div>

          {openSub && (
            <div className={styles.form}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#B0824C', color: '#1A2420', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)' }}>
                  {initials(openSub.name)}
                </div>
                <div>
                  <strong>{openSub.name}</strong>
                  <div style={{ fontSize: 13, color: 'rgba(26,36,32,0.55)' }}>{openSub.email}</div>
                </div>
              </div>
              <p><strong>Subject:</strong> {openSub.subject}</p>
              <p><strong>Source:</strong> {openSub.source}</p>
              {openSub.phone && <p><strong>Phone:</strong> {openSub.phone}</p>}
              <p style={{ lineHeight: 1.7, marginTop: 16 }}>{openSub.message}</p>
              <div className={styles.formActions}>
                <a
                  href={`mailto:${openSub.email}?subject=${encodeURIComponent(`Re: ${openSub.subject} — John Buchan Homes`)}`}
                  className={styles.btnPrimary}
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Reply by Email
                </a>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={async () => {
                    await updateSubmissionStatus(openSub.id, openSub.status === 'Archived' ? 'Read' : 'Archived');
                    toast(openSub.status === 'Archived' ? 'Moved to inbox' : 'Archived');
                  }}
                >
                  {openSub.status === 'Archived' ? 'Move to Inbox' : 'Archive'}
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={async () => {
                    await updateSubmissionStatus(openSub.id, 'New');
                    toast('Marked unread');
                  }}
                >
                  Mark Unread
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={async () => {
                    if (window.confirm(`Delete inquiry from ${openSub.name}?`)) {
                      await deleteSubmission(openSub.id);
                      setOpenId(null);
                      toast('Inquiry deleted');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
