import { Link } from 'react-router-dom';
import PulseLine from '../components/PulseLine';

const steps = [
  {
    n: '01',
    title: 'Add an endpoint your server can answer',
    body: (
      <>
        <p>
          UrlPulse works by sending a request to a URL on a schedule. Before you add anything here, that URL
          needs to exist and return a response — a route in your own app, or any address you want checked.
        </p>
        <p style={{ marginTop: 10 }}>A lightweight route built just for this works well, since it costs nothing to run:</p>
        <CodeBlock lang="Node / Express">
{`app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});`}
        </CodeBlock>
        <p style={{ marginTop: 10 }}>Any language works the same way. In Python with Flask:</p>
        <CodeBlock lang="Python / Flask">
{`@app.route('/api/ping')
def ping():
    return {'status': 'ok'}, 200`}
        </CodeBlock>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
          Already have a page or API route you want watched instead of building a new one? Skip straight to
          step 2 — any public http:// or https:// URL works.
        </p>
      </>
    ),
  },
  {
    n: '02',
    title: 'Paste that URL into the job form',
    body: (
      <>
        <p>
          Deploy your app so the route is reachable from the internet, then copy its full address — for
          example <code className="mono">https://your-app.com/api/ping</code> — and paste it into the{' '}
          <strong>Endpoint URL</strong> field when you add a job.
        </p>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
          A few things UrlPulse won't accept: addresses without <code className="mono">http://</code> or{' '}
          <code className="mono">https://</code>, and anything pointing at a private or local network — only
          public, reachable addresses can be watched.
        </p>
      </>
    ),
  },
  {
    n: '03',
    title: 'Set how often to check it',
    body: (
      <>
        <p>
          Pick an interval — 1, 5, 10, 15, 20, 25, or 30 minutes. This is how often UrlPulse hits the URL and
          records what came back.
        </p>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
          Need something outside those presets? Custom intervals are available on the Pro plan — an admin can
          move your account to Pro from the Admin panel.
        </p>
      </>
    ),
  },
  {
    n: '04',
    title: 'Create the job',
    body: (
      <p>
        Click <strong>Create job</strong>. The first check happens automatically once the interval elapses —
        you don't need to trigger anything yourself.
      </p>
    ),
  },
  {
    n: '05',
    title: 'Read the results',
    body: (
      <>
        <p>
          Open the job from your dashboard to see uptime percentage, average response time, and a full log of
          every check — timestamp, status code, response time, and the error if one occurred.
        </p>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
          If a check fails three times in a row, you'll get an alert email. After five in a row, the job pauses
          itself automatically so it stops hitting a dead endpoint — fix the issue, then hit{' '}
          <strong>Resume</strong> to start checking again.
        </p>
      </>
    ),
  },
];

function CodeBlock({ lang, children }) {
  return (
    <div
      style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border-hairline-strong)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '6px 12px',
          fontSize: 11,
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border-hairline)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {lang}
      </div>
      <pre style={{ margin: 0, padding: '14px 16px', overflowX: 'auto' }}>
        <code className="mono" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function SetupGuide() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Setting up your first job</h1>
          <p>Five steps, start to finish — from a route in your code to a result you can read.</p>
        </div>
        <PulseLine status="signal" width={80} height={26} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {steps.map((step) => (
          <div key={step.n} className="card" style={{ padding: 24, display: 'flex', gap: 20 }}>
            <div
              className="mono"
              style={{
                fontSize: 13,
                color: 'var(--signal)',
                flexShrink: 0,
                width: 32,
                paddingTop: 2,
              }}
            >
              {step.n}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, marginBottom: 10 }}>{step.title}</h3>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>{step.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 8 }}>Ready to add one?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
          Head back to your jobs and click "Add URL" — the form is the same one described above.
        </p>
        <Link to="/app" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Go to jobs
        </Link>
      </div>
    </>
  );
}
