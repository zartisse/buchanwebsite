import { Link } from 'react-router-dom';
import { useSitePages } from '../../hooks/useSitePage';
import { SITE_PAGE_LABELS, SITE_PAGE_SLUGS } from '../../types';
import { PageMeta } from '../../components/ui/PageMeta';
import { fmtDate } from '../../lib/utils';
import styles from '../../styles/admin.module.css';

export function AdminPages() {
  const { pages, loading } = useSitePages();

  const getPage = (slug: string) => pages.find((p) => p.slug === slug);

  return (
    <>
      <PageMeta title="Pages" />
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.pageTitle}>Pages</h1>
          <p className={styles.pageSub}>Edit marketing page content, images, and SEO.</p>
        </div>
      </div>

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
            {SITE_PAGE_SLUGS.map((slug) => {
              const page = getPage(slug);
              return (
                <tr key={slug}>
                  <td>{SITE_PAGE_LABELS[slug]}</td>
                  <td>/{slug === 'home' ? '' : slug}</td>
                  <td>{page?.updated_at ? fmtDate(page.updated_at.slice(0, 10)) : '—'}</td>
                  <td>
                    <Link to={`/admin/pages/${slug}`} className={styles.btn}>Edit</Link>
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
