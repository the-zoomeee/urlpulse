import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import PublicHeader from '../components/PublicHeader';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.resetPassword(token, newPassword);
      setDone(true);
      // Resetting the password revokes every existing session server-side
      // (including any on this device) - send them to a fresh login rather
      // than trying to auto-sign-in with a token that's now invalid anyway.
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
    <div className="auth-shell">
      <div className="card" style={{ width: 380, padding: 32 }}>

        {!token ? (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 16 }}>
              This link is missing its reset token. Request a new one below.
            </p>
            <Link to="/forgot-password" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 16, width: '100%' }}>
              Request a new link
            </Link>
          </>
        ) : done ? (
          <p style={{ color: 'var(--signal)', fontSize: 14, marginTop: 16 }}>
            Password updated. Taking you to sign in…
          </p>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              Choose a new password. Every other session on this account will be signed out.
            </p>
            {error && <div className="banner banner-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                  autoFocus
                />
                <span className="hint">At least 8 characters.</span>
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm new password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </div>
  );
}
