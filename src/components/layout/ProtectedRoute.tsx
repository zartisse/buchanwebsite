import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  if (!isConfigured) {
    return (
      <div className="page-error" style={{ minHeight: '100vh', background: '#EFEBE3', color: '#1A2420' }}>
        Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
