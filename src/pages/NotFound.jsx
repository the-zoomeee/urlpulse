import { Link } from 'react-router-dom';
import PulseLine from '../components/PulseLine';

export default function NotFound() {
  return (
    <div className="auth-shell">
      <div style={{ textAlign: 'center' }}>
        <PulseLine status="danger" width={100} height={28} />
        <h1 style={{ marginTop: 16, marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Nothing is listening at this address.</p>
        <Link to="/app" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to jobs
        </Link>
      </div>
    </div>
  );
}
