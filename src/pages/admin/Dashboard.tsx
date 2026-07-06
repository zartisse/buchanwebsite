import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { useProperties } from '../../hooks/useProperties';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import { fmtDate } from '../../lib/utils';
import styles from '../../styles/admin.module.css';

export function AdminDashboard() {
  const { posts } = usePosts({ admin: true });
  const { properties } = useProperties({ admin: true });
  const { submissions } = useSubmissions(true);

  const published = posts.filter((p) => p.status === 'Published').length;
  const available = properties.filter((p) => p.status === 'Available').length;
  const newInquiries = submissions.filter((s) => s.status === 'New').length;

  const exportJSON = () => {
    const data = JSON.stringify({ posts, properties }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buchan-content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Exported buchan-content.json');
  };

  return (
    <>
      <PageMeta title="Dashboard" />
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Overview of your website content and inquiries.</p>
        </div>
        <button type="button" className={styles.btn} onClick={exportJSON}>Export JSON</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{posts.length}</div>
          <div className={styles.statLabel}>Blog Posts</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{published}</div>
          <div className={styles.statLabel}>Published</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{properties.length}</div>
          <div className={styles.statLabel}>Properties</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{available}</div>
          <div className={styles.statLabel}>Available</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{newInquiries}</div>
          <div className={styles.statLabel}>New Inquiries</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <section>
          <div className={styles.toolbar}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, margin: 0 }}>Recent Posts</h2>
            <Link to="/admin/posts" className={styles.btn}>View All</Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {posts.slice(0, 4).map((p) => (
                <tr key={p.id}>
                  <td>{p.title.slice(0, 50)}{p.title.length > 50 ? '…' : ''}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <div className={styles.toolbar}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, margin: 0 }}>Recent Properties</h2>
            <Link to="/admin/properties" className={styles.btn}>View All</Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {properties.slice(0, 4).map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
