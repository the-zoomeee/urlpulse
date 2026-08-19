import { useTheme } from '../hooks/useTheme';

export default function ThemeToggleButton({ style }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-hairline-strong)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        width: 32,
        height: 32,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        lineHeight: 1,
        ...style,
      }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}