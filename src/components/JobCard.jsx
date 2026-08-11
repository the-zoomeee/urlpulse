import { Link } from 'react-router-dom';
import PulseLine from './PulseLine';
import { jobStatus, jobStatusLabel, formatInterval, timeAgo } from '../utils/jobStatus';

export default function JobCard({ job, onToggle, onDelete }) {
  const status = jobStatus(job);
  const badgeClass = status === 'signal' ? 'badge-signal' : status === 'warn' ? 'badge-warn' : status === 'danger' ? 'badge-danger' : '';

  return (
    <div className="card job-card">
      <div className="job-card-top">
        <PulseLine status={status} width={56} height={20} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{job.name || 'Untitled job'}</div>
          </Link>
          <div className="mono job-card-url">{job.targetUrl}</div>
        </div>
      </div>

      <div className="job-card-meta">
        <span className="badge mono">{formatInterval(job)}</span>
        <span className={`badge ${badgeClass}`}>{jobStatusLabel(job)}</span>
        <span className="mono job-card-timeago">{timeAgo(job.lastHitAt)}</span>

        <div className="job-card-actions">
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onToggle(job)}>
            {job.isActive ? 'Pause' : 'Resume'}
          </button>
          <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onDelete(job)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}