import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  if (!isConfigured) {
    return (
      <div className="page-error" style={{ minHeight: '100dvh', background: '#F7F5F0', color: '#2F3430' }}>
        Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="page-error" style={{ minHeight: '100dvh', background: '#F7F5F0', color: '#2F3430', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
        <div>
          <p>This account does not have admin access. Ask an administrator to grant access.</p>
          <button type="button" onClick={() => void signOut()} style={{ marginTop: 16 }}>Sign out</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
