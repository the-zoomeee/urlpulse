import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';
import { jobStatus } from '../utils/jobStatus';

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: '16px 18px', flex: 1 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export default function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [statsData, usersData, jobsData] = await Promise.all([
        api.adminStats(),
        api.adminListUsers(),
        api.adminListJobs(),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setJobs(jobsData.jobs);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function togglePlan(u) {
    try {
      setError('');
      await api.adminSetPlan(u.id, u.plan === 'pro' ? 'normal' : 'pro');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleRole(u) {
    if (u.id === currentUser.id) return; // guarded server-side too
    try {
      setError('');
      await api.adminSetRole(u.id, u.role === 'admin' ? 'user' : 'admin');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(u) {
    try {
      setError('');
      if (u.isActive) await api.adminDeactivate(u.id);
      else await api.adminReactivate(u.id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeUser(u) {
    if (!confirm(`Permanently delete ${u.email} and all their jobs? This can't be undone.`)) return;
    try {
      setError('');
      await api.adminDeleteUser(u.id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleJob(j) {
    try {
      setError('');
      await api.adminToggleJob(j._id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admin</h1>
          <p>System-wide view — every user and every job.</p>
        </div>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {stats && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Active users" value={stats.activeUsers} />
          <StatCard label="Pro users" value={stats.proUsers} />
          <StatCard label="Jobs" value={stats.totalJobs} />
          <StatCard label="Active jobs" value={stats.activeJobs} />
          <StatCard label="Auto-paused jobs" value={stats.autoPausedJobs} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className="btn"
          onClick={() => setTab('users')}
          style={{
            background: tab === 'users' ? 'var(--bg-elevated)' : 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-hairline-strong)',
          }}
        >
          Users
        </button>
        <button
          className="btn"
          onClick={() => setTab('jobs')}
          style={{
            background: tab === 'jobs' ? 'var(--bg-elevated)' : 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-hairline-strong)',
          }}
        >
          All jobs
        </button>
      </div>

      {tab === 'users' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.plan === 'pro' ? 'badge-signal' : ''}`}>{u.plan}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-warn' : ''}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-signal' : 'badge-danger'}`}>
                      {u.isActive ? 'active' : 'deactivated'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => togglePlan(u)}>
                        {u.plan === 'pro' ? 'Set normal' : 'Set pro'}
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: '4px 8px' }}
                        onClick={() => toggleRole(u)}
                        disabled={u.id === currentUser.id}
                        title={u.id === currentUser.id ? "You can't change your own role" : ''}
                      >
                        {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => toggleActive(u)}>
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: '4px 8px', color: 'var(--danger)' }}
                        onClick={() => removeUser(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Job</th>
                <th>Owner</th>
                <th>Interval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>
                    <PulseLine status={jobStatus(j)} width={40} height={16} />
                  </td>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {j.targetUrl}
                  </td>
                  <td>{j.userId?.email || '—'}</td>
                  <td>{j.interval === 'custom' ? `${j.customIntervalMinutes}m` : j.interval}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => toggleJob(j)}>
                      {j.isActive ? 'Force pause' : 'Force resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
