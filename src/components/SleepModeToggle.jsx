const browserTimezone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
})();

export default function SleepModeToggle({ sleepMode, onChange }) {
  const enabled = sleepMode?.enabled || false;

  function toggleEnabled() {
    if (enabled) {
      onChange({ enabled: false, startTime: sleepMode?.startTime, endTime: sleepMode?.endTime, timezone: sleepMode?.timezone });
    } else {
      onChange({
        enabled: true,
        startTime: sleepMode?.startTime || '00:00',
        endTime: sleepMode?.endTime || '06:00',
        timezone: sleepMode?.timezone || browserTimezone,
      });
    }
  }

  return (
    <div className="field">
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleEnabled}
          style={{ width: 'auto', accentColor: 'var(--signal)' }}
        />
        Sleep mode — pause checks during a daily quiet window
      </label>

      {enabled && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-hairline-strong)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <div style={{ flex: '1 1 120px' }}>
              <label htmlFor="sleep-start" style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                From
              </label>
              <input
                id="sleep-start"
                type="time"
                value={sleepMode.startTime || '00:00'}
                onChange={(e) => onChange({ ...sleepMode, startTime: e.target.value })}
              />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label htmlFor="sleep-end" style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                To
              </label>
              <input
                id="sleep-end"
                type="time"
                value={sleepMode.endTime || '06:00'}
                onChange={(e) => onChange({ ...sleepMode, endTime: e.target.value })}
              />
            </div>
          </div>

          <label htmlFor="sleep-tz" style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            Timezone
          </label>
          <input
            id="sleep-tz"
            type="text"
            value={sleepMode.timezone || browserTimezone}
            onChange={(e) => onChange({ ...sleepMode, timezone: e.target.value })}
            placeholder="e.g. Asia/Kolkata, America/New_York"
          />
          <span className="hint" style={{ display: 'block', marginTop: 8 }}>
            Times wrap past midnight fine — "22:00 to 06:00" means overnight, not just before midnight. Detected
            your timezone as <strong className="mono">{browserTimezone}</strong>; change it if this job's server
            lives somewhere else.
          </span>
        </div>
      )}
    </div>
  );
}