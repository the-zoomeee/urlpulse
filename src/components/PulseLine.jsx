export default function PulseLine({ status = 'idle', width = 64, height = 20 }) {
  const paths = {
    signal: 'M0,10 L14,10 L18,3 L22,17 L26,10 L120,10',
    warn: 'M0,10 L10,10 L13,2 L16,18 L19,4 L22,16 L25,10 L120,10',
    danger: 'M0,10 L40,10 L44,1 L48,19 L52,10 L120,10',
    idle: 'M0,10 L120,10',
  };

  return (
    <svg
      className={`pulse-line ${status}`}
      width={width}
      height={height}
      viewBox="0 0 120 20"
      preserveAspectRatio="none"
      role="img"
      aria-label={`status: ${status}`}
    >
      <path d={paths[status]} strokeDasharray={status === 'idle' || status === 'danger' ? '0' : '6 4'} />
    </svg>
  );
}
