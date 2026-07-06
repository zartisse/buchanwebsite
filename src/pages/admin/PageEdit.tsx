import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSitePage, useSitePages } from '../../hooks/useSitePage';
import { SitePageEditor } from '../../components/admin/SitePageEditor';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import { SITE_PAGE_LABELS, SITE_PAGE_SLUGS, type SitePageSlug } from '../../types';
import styles from '../../styles/admin.module.css';

const VALID_SLUGS = new Set<string>(SITE_PAGE_SLUGS);

export function AdminPageEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { saveSitePage } = useSitePages();

  if (!slug || !VALID_SLUGS.has(slug)) {
    return (
      <>
        <PageMeta title="Page not found" />
        <p>Unknown page.</p>
        <Link to="/admin/pages" className={styles.btn}>Back to Pages</Link>
      </>
    );
  }

  const pageSlug = slug as SitePageSlug;
  const { page, loading } = useSitePage(pageSlug);

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div className={styles.toolbar} style={{ marginBottom: 16 }}>
        <Link to="/admin/pages" className={styles.btn}>← All Pages</Link>
        <span style={{ fontSize: 13, color: 'rgba(26,36,32,0.5)' }}>{SITE_PAGE_LABELS[pageSlug]}</span>
      </div>
      <SitePageEditor
        slug={pageSlug}
        page={page}
        onSave={async (data) => {
          await saveSitePage(data);
          toast('Saved ✓');
          navigate('/admin/pages');
        }}
        onCancel={() => navigate('/admin/pages')}
      />
    </>
  );
}
