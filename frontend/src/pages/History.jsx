import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reviewService } from '../services/reviewService'
import Badge   from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { scoreColor, timeAgo } from '../utils/helpers'
import { LANGUAGES } from '../utils/constants'
import { Filter } from 'lucide-react'

const select = { padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', outline: 'none' }
const row    = { display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 80px 100px', alignItems: 'center', gap: 16, padding: '13px 20px', borderBottom: '1px solid var(--border)' }

export default function History() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState({ language: '', status: '' })
  const LIMIT = 10

  const fetch = async (p = 1, f = filters, append = false) => {
    setLoading(true)
    try {
      const params = { page: p, limit: LIMIT }
      if (f.language) params.language = f.language
      if (f.status)   params.status   = f.status
      const { data } = await reviewService.getHistory(params)
      setReviews(prev => append ? [...prev, ...data.reviews] : data.reviews)
      setHasMore(data.reviews.length === LIMIT)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch(1, filters) }, [filters])

  const loadMore = () => { const next = page + 1; setPage(next); fetch(next, filters, true) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Review History</h1>
        <Link to="/review/new" style={{ padding: '9px 18px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>+ New Review</Link>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select value={filters.language} onChange={e => { setPage(1); setFilters(p => ({ ...p, language: e.target.value })) }} style={select}>
          <option value="">All languages</option>
          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select value={filters.status} onChange={e => { setPage(1); setFilters(p => ({ ...p, status: e.target.value })) }} style={select}>
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ ...row, background: 'var(--bg-elevated)', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span>Title</span><span>Language</span><span>Issues</span><span>Score</span><span>Date</span>
        </div>

        {loading && reviews.length === 0 ? <Spinner /> : reviews.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            No reviews yet. <Link to="/review/new" style={{ color: 'var(--accent-light)' }}>Submit one →</Link>
          </div>
        ) : reviews.map(r => (
          <Link key={r.id} to={`/review/${r.id}`} style={{ ...row, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
            onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{r.title}</span>
            <Badge label={r.language} severity="info" />
            <span>
              {r.critical_count > 0
                ? <Badge label={`${r.total_issues} (${r.critical_count} crit)`} severity="critical" />
                : <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.total_issues}</span>}
            </span>
            <span style={{ fontWeight: 700, color: scoreColor(r.score) }}>{r.score}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(r.created_at)}</span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={loadMore} disabled={loading} style={{ padding: '9px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13 }}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}