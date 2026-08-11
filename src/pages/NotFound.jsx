import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';
import PublicHeader from '../components/PublicHeader';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <div className="auth-shell" style={{ flex: 1, minHeight: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <PulseLine status="danger" width={100} height={28} />
          <h1 style={{ marginTop: 16, marginBottom: 8 }}>Page not found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Nothing is listening at this address.</p>
          <Link to={user ? '/app' : '/login'} className="btn btn-primary" style={{ textDecoration: 'none' }}>
            {user ? 'Back to jobs' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}