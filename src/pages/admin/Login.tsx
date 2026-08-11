import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/96b34018-b8d2-464d-a26d-868e5a862d9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'787a69'},body:JSON.stringify({sessionId:'787a69',location:'Login.tsx:handleSubmit',message:'login success',data:{configured:isConfigured},timestamp:Date.now(),runId:'browser',hypothesisId:'H12'})}).catch(()=>{});
      // #endregion
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/96b34018-b8d2-464d-a26d-868e5a862d9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'787a69'},body:JSON.stringify({sessionId:'787a69',location:'Login.tsx:handleSubmit',message:'login failed',data:{error:msg,configured:isConfigured},timestamp:Date.now(),runId:'browser',hypothesisId:'H12'})}).catch(()=>{});
      // #endregion
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <PageMeta title="Admin Login" />
      <div className={styles.loginBox}>
        <img src="/assets/logo-reverse.png" alt="" style={{ height: 38, marginBottom: 24 }} />
        <h1 className={styles.loginTitle}>Content Studio</h1>
        <p className={styles.pageSub}>Sign in to manage the Buchan Homes website.</p>
        {!isConfigured && (
          <p className={styles.error}>
            Supabase is not configured. Copy .env.example to .env.local and add your credentials.
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
