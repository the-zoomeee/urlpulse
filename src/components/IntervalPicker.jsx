const PRESETS = ['1m', '5m', '10m', '15m', '20m', '25m', '30m'];

export default function IntervalPicker({ interval, customMinutes, onChange, isPro }) {
  return (
    <div className="field">
      <label>Check every</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onChange({ interval: p, customMinutes: '' })}
            className="btn"
            style={{
              padding: '8px 14px',
              fontSize: 13,
              background: interval === p ? 'var(--signal)' : 'var(--bg-elevated)',
              color: interval === p ? 'var(--signal-contrast-text)' : 'var(--text-primary)',
              border: '1px solid ' + (interval === p ? 'var(--signal)' : 'var(--border-hairline-strong)'),
            }}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => isPro && onChange({ interval: 'custom', customMinutes })}
          disabled={!isPro}
          className="btn"
          title={isPro ? 'Set a custom interval' : 'Custom intervals are a Pro feature — ask an admin to upgrade your plan'}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            background: interval === 'custom' ? 'var(--signal)' : 'var(--bg-elevated)',
            color: interval === 'custom' ? 'var(--signal-contrast-text)' : isPro ? 'var(--text-primary)' : 'var(--text-muted)',
            border: '1px solid ' + (interval === 'custom' ? 'var(--signal)' : 'var(--border-hairline-strong)'),
          }}
        >
          Custom
        </button>
      </div>

      {interval === 'custom' && (
        <div style={{ marginTop: 10, maxWidth: 200 }}>
          <input
            type="number"
            min={1}
            placeholder="Minutes"
            value={customMinutes}
            onChange={(e) => onChange({ interval: 'custom', customMinutes: e.target.value })}
          />
        </div>
      )}

      {!isPro && <span className="hint" style={{ marginTop: 8, display: 'block' }}>Custom intervals need a Pro plan — an admin can upgrade you.</span>}
    </div>
  );
}

export { PRESETS };
