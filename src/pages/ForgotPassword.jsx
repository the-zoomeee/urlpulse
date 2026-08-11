import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import PublicHeader from '../components/PublicHeader';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.forgotPassword(email);
      // Always show the same success state regardless of whether the email
      // was registered - the backend deliberately returns a generic message
      // either way, so the UI shouldn't reveal anything the API doesn't.
      setSubmitted(true);
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


          {submitted ? (
            <>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
                If an account exists for <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>, we've sent
                a link to reset the password. It expires in 30 minutes.
              </p>
              <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', marginTop: 16, width: '100%' }}>
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              {error && <div className="banner banner-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                <Link to="/login" style={{ color: 'var(--signal)' }}>
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
