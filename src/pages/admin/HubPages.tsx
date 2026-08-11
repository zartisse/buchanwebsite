import { Link } from 'react-router-dom';
import { useHubPages } from '../../hooks/useHubPage';
import { HUB_PAGE_LABELS, HUB_PAGE_SLUGS } from '../../types';
import { PageMeta } from '../../components/ui/PageMeta';
import { fmtDate } from '../../lib/utils';
import styles from '../../styles/admin.module.css';

export function AdminHubPages() {
  const { pages, loading, error } = useHubPages();

  const getPage = (slug: string) => pages.find((p) => p.slug === slug);

  return (
    <>
      <PageMeta title="Hub Pages" />
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.pageTitle}>Hub Pages</h1>
          <p className={styles.pageSub}>Edit Custom Homes, Renovations, Services, and other marketing hub pages.</p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Page</th>
              <th>Slug</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {HUB_PAGE_SLUGS.map((slug) => {
              const page = getPage(slug);
              return (
                <tr key={slug}>
                  <td>{HUB_PAGE_LABELS[slug]}</td>
                  <td>/{slug}</td>
                  <td>{page?.updated_at ? fmtDate(page.updated_at.slice(0, 10)) : '—'}</td>
                  <td>
                    <Link to={`/admin/hub-pages/${slug}`} className={styles.btn}>Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
