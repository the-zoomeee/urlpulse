import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { user, setUser } = useAuth();

  const [status, setStatus] = useState('pending'); // 'pending' | 'success' | 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('This link is missing its verification token.');
      return;
    }

    api
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
        // If they're already logged in on this device/tab, reflect the
        // change immediately instead of waiting for a future /auth/me call.
        if (user) setUser({ ...user, emailVerified: true });
      })
      .catch((err) => {
        setStatus('error');
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="auth-shell">
      <div className="card" style={{ width: 380, padding: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <PulseLine status={status === 'error' ? 'danger' : 'signal'} width={32} height={18} />
          <h1 style={{ fontSize: 20 }}>UrlPulse</h1>
        </div>

        {status === 'pending' && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Verifying your email…</p>}

        {status === 'success' && (
          <>
            <p style={{ color: 'var(--signal)', fontSize: 14, marginBottom: 16 }}>Your email is verified.</p>
            <Link to={user ? '/app' : '/login'} className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
              {user ? 'Go to your jobs' : 'Sign in'}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="banner banner-error" style={{ textAlign: 'left' }}>{error}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {user
                ? 'You can request a new verification email from your account page.'
                : 'Sign in and request a new verification email from your account page.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
