import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PulseLine from './PulseLine';
import ThemeToggleButton from './ThemeToggleButton';

export default function PublicHeader({ maxWidth = 1080 }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        zIndex: 100,
      }}
    >
      <header
        className="public-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          maxWidth,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <PulseLine status="signal" width={28} height={16} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
            UrlPulse
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ThemeToggleButton />
          {pathname !== '/support' && (
            <Link to="/support" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Support
            </Link>
          )}

          {user ? (
            <Link to="/app" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Go to your jobs
            </Link>
          ) : (
            <>
              {pathname !== '/login' && (
                <Link to="/login" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Sign in
                </Link>
              )}
              {pathname !== '/register' && (
                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Get started
                </Link>
              )}
            </>
          )}
        </nav>
      </header>
    </div>
  );
}