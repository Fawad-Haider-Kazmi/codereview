export default function Button({ children, variant = 'primary', loading, onClick, disabled, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 'var(--radius-sm)',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    border: '1px solid transparent', transition: 'all 0.15s ease',
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost:   { background: 'transparent',   color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    danger:  { background: 'transparent',   color: 'var(--critical)',       border: '1px solid var(--critical)' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ ...base, ...variants[variant], opacity: (loading || disabled) ? 0.5 : 1, ...style }}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}