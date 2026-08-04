import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function VerifyEmailBanner() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) return null;

  async function handleResend() {
    setError('');
    setSending(true);
    try {
      await api.resendVerification();
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '10px 16px',
        marginBottom: 20,
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--warn-dim)',
        background: 'rgba(242, 169, 59, 0.08)',
        fontSize: 13,
        color: 'var(--warn)',
      }}
    >
      <span>
        {sent
          ? "Verification email sent — check your inbox."
          : error
            ? error
            : `Verify ${user.email} so alert emails actually reach you.`}
      </span>
      {!sent && (
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 10px', fontSize: 12, flexShrink: 0, color: 'var(--warn)' }}
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? 'Sending…' : 'Resend email'}
        </button>
      )}
    </div>
  );
}
