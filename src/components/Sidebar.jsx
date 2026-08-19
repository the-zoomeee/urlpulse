import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PulseLine from './PulseLine';
import ThemeToggleButton from './ThemeToggleButton';

const navItems = [
  { to: '/app', label: 'Jobs', end: true, icon: '⊞' },
  { to: '/guide', label: 'Setup guide', icon: '⬡' },
  { to: '/account', label: 'Account', icon: '◎' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === 'true'; } catch { return false; }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('sidebar_collapsed', String(next)); } catch { }
  }

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? 0 : 10,
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '10px 0' : '9px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--bg-elevated)' : 'transparent',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  });

  const sidebarContent = (mobile = false) => (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !mobile ? 'center' : 'space-between',
          padding: '0 8px',
          marginBottom: 32,
        }}
      >
        {(!collapsed || mobile) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PulseLine status="signal" width={28} height={16} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>UrlPulse</span>
          </div>
        )}
        {collapsed && !mobile && (
          <PulseLine status="signal" width={22} height={14} />
        )}
        {!mobile && (
          <button
            onClick={toggleCollapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {collapsed ? '→' : '←'}
          </button>
        )}
        {mobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed && !mobile ? item.label : undefined}
            style={mobile ? ({ isActive }) => ({
              ...navLinkStyle({ isActive }),
              justifyContent: 'flex-start',
              gap: 10,
              padding: '9px 12px',
            }) : navLinkStyle}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {(!collapsed || mobile) && item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            title={collapsed && !mobile ? 'Admin' : undefined}
            style={mobile ? ({ isActive }) => ({
              ...navLinkStyle({ isActive }),
              justifyContent: 'flex-start',
              gap: 10,
              padding: '9px 12px',
            }) : navLinkStyle}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚙</span>
            {(!collapsed || mobile) && 'Admin'}
          </NavLink>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-hairline)' }}>
        {(!collapsed || mobile) && (
          <div style={{ padding: '0 8px', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }} className="mono">
              {user?.plan === 'pro' ? 'Pro plan' : 'Normal plan'}
              {user?.role === 'admin' ? ' · Admin' : ''}
            </div>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: collapsed && !mobile ? 'column' : 'row',
            gap: 6,
          }}
        >
          {(collapsed && !mobile) && <ThemeToggleButton style={{ width: '100%' }} />}
          <button
            className="btn btn-ghost"
            title={collapsed && !mobile ? 'Log out' : undefined}
            style={{
              flex: 1,
              justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
              padding: collapsed && !mobile ? '10px 0' : undefined,
            }}
            onClick={logout}
          >
            <span style={{ fontSize: 16 }}>⇥</span>
            {(!collapsed || mobile) && 'Log out'}
          </button>
          {!(collapsed && !mobile) && <ThemeToggleButton />}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PulseLine status="signal" width={24} height={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>UrlPulse</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: 22,
            lineHeight: 1,
            padding: '4px',
          }}
        >
          ☰
        </button>
      </div>

      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        {sidebarContent(true)}
      </div>

      <aside
        className={`desktop-sidebar ${collapsed ? 'collapsed' : ''}`}
        style={{ background: 'var(--bg-surface)' }}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}