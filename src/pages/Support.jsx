import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SUPPORT_EMAIL } from '../config';
import PublicHeader from '../components/PublicHeader';

const faqs = [
  {
    q: 'How does UrlPulse decide a check failed?',
    a: 'A check fails if the request times out, the connection errors, the status code is 4xx/5xx, or — if you set a "must contain" value on the job — the response body doesn\'t include that text, even on a 200.',
  },
  {
    q: 'What happens after repeated failures?',
    a: "After 3 consecutive failures you get an alert email. After 5, the job auto-pauses so it stops wasting requests against a dead target — fix the issue, then hit Resume on the job to clear the streak and start checking again.",
  },
  {
    q: 'Why did my SSL certificate alert only arrive once?',
    a: "You get one email when a certificate enters its warning window (14 days left, by default), not one on every single check. It resets automatically once the certificate is renewed, so a future renewal approaching will alert you again.",
  },
  {
    q: "Why can't I set a custom check interval?",
    a: 'Custom intervals are a Pro-plan feature. Everyone gets the fixed presets (1m–30m); an admin can move your account to Pro from the Admin panel if you need something outside those.',
  },
  {
    q: "Why was my URL rejected when I tried to add it?",
    a: "UrlPulse blocks targets that resolve to private, loopback, or internal network addresses — this protects both you and the service itself from being used to probe internal infrastructure. Only public http:// or https:// addresses are accepted.",
  },
  {
    q: "I didn't get my verification or password reset email.",
    a: 'Check spam first. You can request a new verification email from your Account page, or start a fresh password reset from the sign-in screen — previous reset links expire after 30 minutes and can only be used once.',
  },
];

export default function Support() {
  const { user } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PublicHeader />

      <div className="public-content" style={{ maxWidth: 720, margin: '0 auto', padding: '20px 40px 100px' }}>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Support</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 36 }}>
          Answers to the questions that come up most. Setting up your first job? See the{' '}
          <Link to={user ? '/guide' : '/register'} style={{ color: 'var(--signal)' }}>
            setup guide
          </Link>{' '}
          instead — this page is for troubleshooting once something's already running.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    padding: '16px 20px',
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {item.q}
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <p style={{ padding: '0 20px 18px', margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 24, marginTop: 32 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Still stuck?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Send us the details and we'll take a look.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Report a problem
            </Link>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              or email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--text-muted)' }}>
                {SUPPORT_EMAIL}
              </a>{' '}
              directly
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}