import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import PulseLine from './PulseLine';
import VerifyEmailBanner from './VerifyEmailBanner';

export function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PulseLine status="signal" width={80} height={24} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="main-content-banner-slot">
          <VerifyEmailBanner />
        </div>
        <div className="main-content-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/app" replace />;
  return <Outlet />;
}

export function GuestOnlyLayout() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return <Outlet />;
}
