import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import JobCard from '../components/JobCard';
import IntervalPicker from '../components/IntervalPicker';
import SleepModeToggle from '../components/SleepModeToggle';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [interval, setInterval_] = useState('5m');
  const [customMinutes, setCustomMinutes] = useState('');
  const [expectedContent, setExpectedContent] = useState('');
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  const [sleepMode, setSleepMode] = useState({ enabled: false });

  async function loadJobs() {
    try {
      const data = await api.listJobs();
      setJobs(data.jobs);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      const body = { name, targetUrl, interval };
      if (interval === 'custom') body.customIntervalMinutes = Number(customMinutes);
      if (expectedContent.trim()) body.expectedContent = expectedContent.trim();
      if (sleepMode.enabled) body.sleepMode = sleepMode;
      await api.createJob(body);
      setName('');
      setTargetUrl('');
      setInterval_('5m');
      setCustomMinutes('');
      setExpectedContent('');
      setShowForm(false);
      setSleepMode({ enabled: false });
      await loadJobs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(job) {
    try {
      await api.toggleJob(job._id);
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(job) {
    if (!confirm(`Delete "${job.name || job.targetUrl}"? This can't be undone.`)) return;
    try {
      await api.deleteJob(job._id);
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p>Every URL being watched, and how it's doing right now.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add URL'}
        </button>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Add a URL to watch</h3>
          {formError && <div className="banner banner-error">{formError}</div>}
          <form onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="job-name">Label (optional)</label>
              <input id="job-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Payments API health" />
            </div>
            <div className="field">
              <label htmlFor="job-url">Endpoint URL</label>
              <input
                id="job-url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://your-app.com/api/ping"
                required
              />
              <span className="hint">
                This must be a route your server actually responds to. Not sure? See the{' '}
                <Link to="/guide" style={{ color: 'var(--signal)' }}>
                  setup guide
                </Link>
                .
              </span>
            </div>
            <IntervalPicker
              interval={interval}
              customMinutes={customMinutes}
              isPro={user?.plan === 'pro'}
              onChange={({ interval: i, customMinutes: c }) => {
                setInterval_(i);
                setCustomMinutes(c);
              }}
            />
            <div className="field">
              <label htmlFor="job-content">Response must contain (optional)</label>
              <input
                id="job-content"
                value={expectedContent}
                onChange={(e) => setExpectedContent(e.target.value)}
                placeholder='e.g. "status":"ok"'
                maxLength={500}
              />
              <span className="hint">
                If set, a check only counts as healthy when this text appears in the response body — catches a
                server that responds 200 but is actually broken underneath.
              </span>
            </div>
            <SleepModeToggle sleepMode={sleepMode} onChange={setSleepMode} />
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create job'}
            </button>
          </form>
        </div>
      )}

      {jobs === null && !error && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}

      {jobs?.length === 0 && (
        <div className="empty-state card">
          <h3>Nothing being watched yet</h3>
          <p style={{ marginBottom: 20 }}>Add your first URL, or walk through the setup guide first.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add URL
            </button>
            <Link to="/guide" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Read the guide
            </Link>
          </div>
        </div>
      )}

      {jobs?.length > 0 &&
        jobs.map((job) => <JobCard key={job._id} job={job} onToggle={handleToggle} onDelete={handleDelete} />)}
    </>
  );
}
