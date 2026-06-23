import { Link } from 'react-router-dom'
import { timeAgo, scoreColor } from '../../utils/helpers'
import Badge from '../ui/Badge'

export default function RecentReviews({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        No reviews yet.{' '}
        <Link to="/review/new" style={{ color: 'var(--accent-light)' }}>Submit your first →</Link>
      </div>
    )
  }

  return (
    <div>
      {reviews.map((r) => (
        <Link key={r.id} to={`/review/${r.id}`} style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto auto',
          alignItems: 'center', gap: 16, padding: '14px 20px',
          borderBottom: '1px solid var(--border)', transition: 'background 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
          onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.language} · {timeAgo(r.created_at)}</div>
          </div>
          <Badge label={r.language} severity="info" />
          {r.critical_count > 0 && <Badge label={`${r.critical_count} critical`} severity="critical" />}
          <div style={{ fontWeight: 700, fontSize: 18, color: scoreColor(r.score), minWidth: 36, textAlign: 'right' }}>
            {r.score}
          </div>
        </Link>
      ))}
    </div>
  )
}