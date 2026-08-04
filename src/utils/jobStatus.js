export function jobStatus(job) {

  if (job.autoPaused) return 'danger';
  if (!job.isActive) return 'idle';
  if (!job.lastHitAt) return 'idle';
  if (job.consecutiveFailures >= 3) return 'warn';
  if (job.consecutiveFailures > 0) return 'warn';
  if (sslDaysRemaining(job) != null && sslDaysRemaining(job) <= 14) return 'warn';
  return 'signal';
}

export function sslDaysRemaining(job) {
  if (!job.sslExpiresAt) return null;
  return Math.ceil((new Date(job.sslExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export function jobStatusLabel(job) {
  if (job.autoPaused) return 'Auto-paused';
  if (!job.isActive) return 'Paused';
  if (!job.lastHitAt) return 'Not checked yet';
  if (job.consecutiveFailures >= 3) return `${job.consecutiveFailures} failures in a row`;
  if (job.consecutiveFailures > 0) return `${job.consecutiveFailures} recent failure`;
  const sslDays = sslDaysRemaining(job);
  if (sslDays != null && sslDays <= 14) {
    return sslDays <= 0 ? 'SSL certificate expired' : `SSL certificate expires in ${sslDays}d`;
  }
  return 'Healthy';
}

export function formatInterval(job) {
  return job.interval === 'custom' ? `${job.customIntervalMinutes}m (custom)` : job.interval;
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
