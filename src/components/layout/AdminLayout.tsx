import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubmissions } from '../../hooks/useSubmissions';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '■' },
  { path: '/admin/pages', label: 'Pages', icon: '◻' },
  { path: '/admin/posts', label: 'Blog Posts', icon: '¶' },
  { path: '/admin/properties', label: 'Properties', icon: '□' },
  { path: '/admin/submissions', label: 'Submissions', icon: '✉' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { submissions } = useSubmissions(true);
  const newCount = submissions.filter((s) => s.status === 'New').length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src="/assets/logo-reverse.png" alt="John Buchan Homes" className={styles.logo} />
          <div className={styles.studioLabel}>Content Studio</div>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navGroup}>Manage</div>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
                {item.path === '/admin/submissions' && newCount > 0 && (
                  <span className={styles.badge}>{newCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.viewSite}>View Live Site →</Link>
          <button type="button" onClick={handleSignOut} className={styles.signOut}>Sign Out</button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
