import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resending, setResending] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await api.deleteMe();
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  async function handleResendVerification() {
    setResendError('');
    setResending(true);
    try {
      await api.resendVerification();
      setResendSent(true);
    } catch (err) {
      setResendError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Account</h1>
          <p>Your details and plan.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 20, maxWidth: 480 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Name</div>
            <div>{user?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</div>
            <div className="mono">{user?.email}</div>
            <div style={{ marginTop: 6 }}>
              {user?.emailVerified ? (
                <span className="badge badge-signal">Verified</span>
              ) : resendSent ? (
                <span className="badge badge-warn">Verification email sent — check your inbox</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge-warn">Not verified</span>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px 8px', fontSize: 12 }}
                    onClick={handleResendVerification}
                    disabled={resending}
                  >
                    {resending ? 'Sending…' : 'Resend verification email'}
                  </button>
                </div>
              )}
            </div>
            {resendError && <div className="banner banner-error" style={{ marginTop: 8 }}>{resendError}</div>}
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Plan</div>
            <div>
              <span className={`badge ${user?.plan === 'pro' ? 'badge-signal' : ''}`}>
                {user?.plan === 'pro' ? 'Pro' : 'Normal'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Plan changes are handled by an admin — there's no self-serve upgrade.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 480, borderColor: 'var(--danger-dim)' }}>
        <h3 style={{ fontSize: 15, marginBottom: 8, color: 'var(--danger)' }}>Delete account</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Permanently deletes your account, every job you've created, and their check history. This can't be undone.
        </p>
        {error && <div className="banner banner-error">{error}</div>}
        {!confirming ? (
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            Delete my account
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Yes, permanently delete'}
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirming(false)} disabled={deleting}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}
