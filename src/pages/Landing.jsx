import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';

const features = [
  {
    status: 'signal',
    title: 'Know the moment it goes quiet',
    body: "Pick an interval, and UrlPulse hits your endpoint on schedule. Miss three checks in a row and you get an email before your users notice anything's wrong.",
  },
  {
    status: 'warn',
    title: "Catch a 200 that's actually broken",
    body: 'Set a "must contain" string and a check only counts as healthy when the response body actually says so — not just when the status code looks fine.',
  },
  {
    status: 'danger',
    title: "Don't get caught by an expired cert",
    body: 'HTTPS targets get their certificate expiry tracked automatically. One alert when it\'s inside the warning window, not a surprise outage.',
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Top nav */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          maxWidth: 1080,
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PulseLine status="signal" width={28} height={16} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>UrlPulse</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/support" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Support
          </Link>
          {user ? (
            <Link to="/app" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Go to your jobs
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '80px 40px 60px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <PulseLine status="signal" width={120} height={32} />
        </div>
        <h1 style={{ fontSize: 44, lineHeight: 1.15, marginBottom: 16 }}>
          Know the moment your endpoint goes quiet.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
          UrlPulse pings your URLs on a schedule you set, watches for the response you actually expect — not just a
          status code — and tells you the second something's wrong.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            to={user ? '/app' : '/register'}
            className="btn btn-primary"
            style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 15 }}
          >
            {user ? 'Go to your jobs' : 'Start monitoring — free'}
          </Link>
          <Link
            to="/support"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 15 }}
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 40px 100px' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: 28, flex: '1 1 280px' }}>
              <PulseLine status={f.status} width={56} height={20} />
              <h3 style={{ fontSize: 17, margin: '16px 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-hairline)',
          padding: '24px 40px',
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}
      >
        <span>UrlPulse</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/support" style={{ color: 'var(--text-muted)' }}>
            Support
          </Link>
          <Link to="/login" style={{ color: 'var(--text-muted)' }}>
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}