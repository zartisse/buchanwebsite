import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { assetUrl } from '../../lib/assets';
import { PageMeta } from '../../components/ui/PageMeta';
import styles from '../../styles/admin.module.css';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <PageMeta title="Admin Login" />
      <div className={styles.loginBox}>
        <img src={assetUrl('/assets/logo-reverse.png')} alt="" style={{ height: 38, marginBottom: 24 }} />
        <h1 className={styles.loginTitle}>Content Studio</h1>
        <p className={styles.pageSub}>Sign in to manage the Buchan Homes website.</p>
        {!isConfigured && (
          <p className={styles.error}>
            Supabase is not configured. Copy .env.example to .env.local and add your credentials.
          </p>
        )}
        {import.meta.env.DEV && isConfigured && (
          <p className={styles.pageSub} style={{ marginBottom: 16, opacity: 0.7 }}>
            Local dev login: admin@buchan.com — password in supabase/seed_admin.sql
          </p>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading || !isConfigured} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <Link to="/" style={{ display: 'block', marginTop: 24, fontSize: 12, color: 'rgba(26,36,32,0.5)' }}>← Back to site</Link>
      </div>
    </div>
  );
}
