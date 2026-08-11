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

function TabButton({ active, onClick, children }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{
        background: active ? 'var(--bg-elevated)' : 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-hairline-strong)',
      }}
    >
      {children}
    </button>
  );
}

const categoryLabels = {
  bug: 'Bug',
  feature_request: 'Feature request',
  billing: 'Billing',
  other: 'Other',
};

export default function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState('open');
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [statsData, usersData, jobsData, messagesData] = await Promise.all([
        api.adminStats(),
        api.adminListUsers(),
        api.adminListJobs(),
        api.adminListContactMessages(),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setJobs(jobsData.jobs);
      setMessages(messagesData.messages);
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

  async function setMessageStatus(m, status) {
    try {
      setError('');
      await api.adminUpdateContactMessageStatus(m._id, status);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeMessage(m) {
    if (!confirm('Delete this report/message permanently?')) return;
    try {
      setError('');
      await api.adminDeleteContactMessage(m._id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleMessages = messageFilter === 'all' ? messages : messages.filter((m) => m.status === messageFilter);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admin</h1>
          <p>System-wide view — every user, every job, every report.</p>
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
          <StatCard label="Open reports" value={stats.openReports} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <TabButton active={tab === 'users'} onClick={() => setTab('users')}>
          Users
        </TabButton>
        <TabButton active={tab === 'jobs'} onClick={() => setTab('jobs')}>
          All jobs
        </TabButton>
        <TabButton active={tab === 'reports'} onClick={() => setTab('reports')}>
          Reports{stats?.openReports > 0 ? ` (${stats.openReports})` : ''}
        </TabButton>
      </div>

      {tab === 'users' && (
        <div className="card table-scroll">
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
        <div className="card table-scroll">
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

      {tab === 'reports' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['open', 'in_progress', 'resolved', 'all'].map((f) => (
              <button
                key={f}
                className="btn btn-ghost"
                onClick={() => setMessageFilter(f)}
                style={{
                  fontSize: 12,
                  padding: '5px 10px',
                  color: messageFilter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: messageFilter === f ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                {f === 'in_progress' ? 'In progress' : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {visibleMessages.length === 0 ? (
            <div className="card empty-state">
              <h3>Nothing here</h3>
              <p>No {messageFilter === 'all' ? '' : messageFilter} reports right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visibleMessages.map((m) => {
                const open = expandedMessage === m._id;
                return (
                  <div key={m._id} className="card" style={{ padding: 18 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 16,
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedMessage(open ? null : m._id)}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</span>
                          <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {m.email}
                          </span>
                          <span className="badge">{categoryLabels[m.category] || m.category}</span>
                          {m.userId && <span className="badge badge-signal">has account</span>}
                        </div>
                        <p
                          style={{
                            margin: '8px 0 0',
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            whiteSpace: open ? 'pre-wrap' : 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: open ? 'none' : 520,
                          }}
                        >
                          {m.message}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          m.status === 'resolved' ? 'badge-signal' : m.status === 'in_progress' ? 'badge-warn' : ''
                        }`}
                        style={{ flexShrink: 0 }}
                      >
                        {m.status === 'in_progress' ? 'in progress' : m.status}
                      </span>
                    </div>

                    {open && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: '1px solid var(--border-hairline)',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
                        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 'auto' }}>
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                        {m.status !== 'in_progress' && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() => setMessageStatus(m, 'in_progress')}
                          >
                            Mark in progress
                          </button>
                        )}
                        {m.status !== 'resolved' && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() => setMessageStatus(m, 'resolved')}
                          >
                            Mark resolved
                          </button>
                        )}
                        {m.status !== 'open' && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() => setMessageStatus(m, 'open')}
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 11, padding: '4px 8px', color: 'var(--danger)' }}
                          onClick={() => removeMessage(m)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}