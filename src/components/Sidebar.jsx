import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Compass, Settings, LogOut, X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PulseLine from './PulseLine';
import ThemeToggleButton from './ThemeToggleButton';

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { to: '/app', label: 'Jobs', end: true, icon: LayoutGrid },
      { to: '/guide', label: 'Setup guide', icon: Compass },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
    ],
  },
];

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
}

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

  // Fixed-size square nav item when collapsed, so the active/hover
  // background is a tidy centered box rather than a stretched bar.
  const navLinkStyle = (mobile) => ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed && !mobile ? 0 : 10,
    justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
    width: collapsed && !mobile ? 40 : '100%',
    height: collapsed && !mobile ? 40 : 'auto',
    margin: collapsed && !mobile ? '0 auto' : 0,
    padding: collapsed && !mobile ? 0 : '9px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--bg-elevated)' : 'transparent',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    boxSizing: 'border-box',
  });

  const sidebarContent = (mobile = false) => {
    const isCollapsed = collapsed && !mobile;

    return (
      <>
        {/* Header: logo + collapse toggle */}
        <div
          style={{
            display: 'flex',
            flexDirection: isCollapsed ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: isCollapsed ? 10 : 8,
            padding: isCollapsed ? '0' : '0 8px',
            marginBottom: 32,
          }}
        >
          {(!isCollapsed) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PulseLine status="signal" width={28} height={16} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>UrlPulse</span>
            </div>
          )}
          {isCollapsed && (
            <PulseLine status="signal" width={22} height={14} />
          )}
          {!mobile && (
            <button
              onClick={toggleCollapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-hairline-strong)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                lineHeight: 1,
                flexShrink: 0,
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav items, grouped */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: isCollapsed ? 14 : 20 }}>
          {navGroups.map((group, gi) => {
            const visibleItems = group.items.filter((item) => !item.adminOnly || user?.role === 'admin');
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isCollapsed ? 'center' : 'stretch' }}>
                {isCollapsed ? (
                  gi > 0 && (
                    <div
                      style={{
                        width: 24,
                        height: 1,
                        background: 'var(--border-hairline)',
                        margin: '0 auto 10px',
                      }}
                    />
                  )
                ) : (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      padding: '0 12px',
                      marginBottom: 4,
                    }}
                  >
                    {group.label}
                  </div>
                )}
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={isCollapsed ? item.label : undefined}
                    style={navLinkStyle(mobile)}
                  >
                    <item.icon size={16} style={{ flexShrink: 0 }} />
                    {!isCollapsed && item.label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Footer: user info + theme toggle + logout */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-hairline)' }}>
          {!isCollapsed && (
            <NavLink
              to="/account"
              title="Account settings"
              style={({ isActive }) => ({
                display: 'block',
                padding: '6px 8px',
                margin: '0 0 12px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                transition: 'background 0.15s ease',
              })}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }} className="mono">
                {user?.plan === 'pro' ? 'Pro plan' : 'Normal plan'}
                {user?.role === 'admin' ? ' · Admin' : ''}
              </div>
            </NavLink>
          )}

          {isCollapsed && (
            <NavLink
              to="/account"
              title={`${user?.name || ''} · Account settings`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isActive ? 'var(--bg-elevated-hover)' : 'var(--bg-elevated)',
                border: isActive ? '1px solid var(--signal-dim)' : '1px solid var(--border-hairline-strong)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                margin: '0 auto 14px',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              })}
            >
              {getInitials(user?.name)}
            </NavLink>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: isCollapsed ? 'column' : 'row',
              alignItems: isCollapsed ? 'center' : 'stretch',
              gap: 6,
            }}
          >
            <ThemeToggleButton style={isCollapsed ? { width: 40, height: 40, justifyContent: 'center' } : { flexShrink: 0 }} />
            <button
              className="btn btn-ghost"
              title={isCollapsed ? 'Log out' : undefined}
              style={{
                flex: isCollapsed ? 'none' : 1,
                width: isCollapsed ? 40 : 'auto',
                height: isCollapsed ? 40 : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? 0 : 10,
                padding: isCollapsed ? 0 : undefined,
              }}
              onClick={logout}
            >
              <LogOut size={16} />
              {!isCollapsed && 'Log out'}
            </button>
          </div>
        </div>
      </>
    );
  };

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
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Menu size={22} />
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