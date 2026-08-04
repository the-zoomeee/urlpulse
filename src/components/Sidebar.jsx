import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PulseLine from './PulseLine';

const navItems = [
  { to: '/app', label: 'Jobs', end: true },
  { to: '/guide', label: 'Setup guide' },
  { to: '/account', label: 'Account' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
        borderRight: '1px solid var(--border-hairline)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
        <PulseLine status="signal" width={28} height={16} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>UrlPulse</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              textDecoration: 'none',
            })}
          >
            {item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              textDecoration: 'none',
            })}
          >
            Admin
          </NavLink>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ padding: '0 8px', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }} className="mono">
            {user?.plan === 'pro' ? 'Pro plan' : 'Normal plan'}
            {user?.role === 'admin' ? ' · Admin' : ''}
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
