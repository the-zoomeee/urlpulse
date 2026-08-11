import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';
import IntervalPicker from '../components/IntervalPicker';
import { jobStatus, jobStatusLabel, formatInterval, sslDaysRemaining } from '../utils/jobStatus';
import SleepModeToggle from '../components/SleepModeToggle';

function StatCard({ label, value, sub, valueColor }) {
  return (
    <div className="card" style={{ padding: '16px 18px', flex: 1 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: valueColor || 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [interval, setInterval_] = useState('5m');
  const [customMinutes, setCustomMinutes] = useState('');
  const [expectedContent, setExpectedContent] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const [sleepMode, setSleepMode] = useState({ enabled: false });

  async function load() {
    try {
      const [jobData, logsData] = await Promise.all([api.getJob(id), api.getJobLogs(id, 100)]);
      setJob(jobData.job);
      setLogs(logsData.logs);
      setName(jobData.job.name || '');
      setTargetUrl(jobData.job.targetUrl);
      setInterval_(jobData.job.interval);
      setCustomMinutes(jobData.job.customIntervalMinutes || '');
      setExpectedContent(jobData.job.expectedContent || '');
      setSleepMode(jobData.job.sleepMode || { enabled: false });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleToggle() {
    try {
      setActionError('');
      await api.toggleJob(id);
      await load();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    try {
      setActionError('');
      await api.deleteJob(id);
      navigate('/app');
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const body = { name, targetUrl, interval, expectedContent: expectedContent.trim() || '', sleepMode };
      if (interval === 'custom') body.customIntervalMinutes = Number(customMinutes);
      await api.updateJob(id, body);
      setEditing(false);
      await load();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <div className="banner banner-error">{error}</div>;
  if (!job) return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;

  const total = logs.length;
  const successes = logs.filter((l) => l.success).length;
  const uptimePct = total > 0 ? ((successes / total) * 100).toFixed(1) : '—';
  const avgResponse =
    total > 0 ? Math.round(logs.reduce((sum, l) => sum + (l.responseTimeMs || 0), 0) / total) : '—';

  const status = jobStatus(job);

  const sslDays = sslDaysRemaining(job);
  const sslColor =
    sslDays == null
      ? 'var(--text-primary)'
      : sslDays <= 0
        ? 'var(--danger)'
        : sslDays <= 14
          ? 'var(--warn)'
          : 'var(--text-primary)';

  return (
    <div className="detail-page">
      <div className="detail-page-top">
        <Link to="/app" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← All jobs
        </Link>

        <div className="page-header" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PulseLine status={status} width={64} height={22} />
            <div>
              <h1>{job.name || 'Untitled job'}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <p className="mono" style={{ margin: 0 }}>{job.targetUrl}</p>
                {job.expectedContent && (
                  <span className="badge" title={`Must contain: ${job.expectedContent}`}>
                    content check
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setEditing((e) => !e)}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="btn btn-secondary" onClick={handleToggle}>
              {job.isActive ? 'Pause' : 'Resume'}
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {actionError && <div className="banner banner-error">{actionError}</div>}

        {job.autoPaused && (
          <div className="banner banner-error">
            This job auto-paused after repeated failures. Fix the endpoint, then hit Resume to clear the failure
            streak and start again.
          </div>
        )}

        {!job.autoPaused && job.isActive && job.isAsleep && job.sleepMode?.enabled && (
          <div className="banner" style={{ borderColor: 'var(--border-hairline-strong)', color: 'var(--text-secondary)' }}>
            Sleeping until {job.sleepMode.endTime} ({job.sleepMode.timezone}) — no checks run during this window.
          </div>
        )}

        {editing && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            {saveError && <div className="banner banner-error">{saveError}</div>}
            <form onSubmit={handleSave}>
              <div className="field">
                <label htmlFor="edit-name">Label</label>
                <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="edit-url">Endpoint URL</label>
                <input id="edit-url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required />
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
                <label htmlFor="edit-content">Response must contain (optional)</label>
                <input
                  id="edit-content"
                  value={expectedContent}
                  onChange={(e) => setExpectedContent(e.target.value)}
                  placeholder='e.g. "status":"ok"'
                  maxLength={500}
                />
              </div>
              <SleepModeToggle sleepMode={sleepMode} onChange={setSleepMode} />
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard label="Status" value={jobStatusLabel(job)} sub={`Checks every ${formatInterval(job)}`} />
          <StatCard
            label="Uptime (last 100 checks)"
            value={total > 0 ? `${uptimePct}%` : '—'}
            sub={`${successes}/${total} succeeded`}
          />
          <StatCard label="Avg response time" value={total > 0 ? `${avgResponse}ms` : '—'} />
          <StatCard label="Total hits" value={job.totalHits} sub={`${job.totalFailures} failed`} />
          {job.targetUrl.toLowerCase().startsWith('https://') && (
            <StatCard
              label="SSL certificate"
              value={
                sslDays == null
                  ? 'Checking…'
                  : sslDays <= 0
                    ? 'Expired'
                    : `${sslDays} day${sslDays === 1 ? '' : 's'} left`
              }
              valueColor={sslColor}
              sub={job.sslExpiresAt ? new Date(job.sslExpiresAt).toLocaleDateString() : undefined}
            />
          )}
        </div>

        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Recent checks</h3>
      </div>

      <div className="detail-page-scroll">
        <div className="card">
          {logs.length === 0 ? (
            <div className="empty-state">
              <h3>No checks yet</h3>
              <p>Results will show up here after the first scheduled hit.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Result</th>
                  <th>Status code</th>
                  <th>Response time</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.hitAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${log.success ? 'badge-signal' : 'badge-danger'}`}>
                        {log.success ? 'OK' : 'Failed'}
                      </span>
                    </td>
                    <td>{log.statusCode ?? '—'}</td>
                    <td>{log.responseTimeMs != null ? `${log.responseTimeMs}ms` : '—'}</td>
                    <td>{log.error || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
