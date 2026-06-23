import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { reviewService }   from '../services/reviewService'
import IssueCard           from '../components/review/IssueCard'
import SeverityBadge       from '../components/review/SeverityBadge'
import Spinner             from '../components/ui/Spinner'
import Badge               from '../components/ui/Badge'
import { scoreColor, formatDate, getErrorMessage } from '../utils/helpers'
import { ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewDetail() {
  const { id }                  = useParams()
  const navigate                = useNavigate()
  const [review, setReview]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    reviewService.getById(id)
      .then(({ data }) => setReview(data))
      .catch(() => { toast.error('Review not found.'); navigate('/history') })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this review permanently?')) return
    setDeleting(true)
    try {
      await reviewService.delete(id)
      toast.success('Review deleted.')
      navigate('/history')
    } catch (err) {
      toast.error(getErrorMessage(err))
      setDeleting(false)
    }
  }

  if (loading) return <Spinner />
  if (!review) return null

  const criticals = review.issues.filter(i => i.severity === 'critical')
  const warnings  = review.issues.filter(i => i.severity === 'warning')
  const infos     = review.issues.filter(i => i.severity === 'info')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link to="/history" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to History
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{review.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Badge label={review.language} severity="info" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(review.created_at)}</span>
            <SeverityBadge critical={review.critical_count} warning={review.warning_count} info={review.info_count} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: scoreColor(review.score), lineHeight: 1 }}>{review.score}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>QUALITY SCORE</div>
          </div>
          <button onClick={handleDelete} disabled={deleting} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: 'transparent', border: '1px solid var(--critical)',
            color: 'var(--critical)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13,
          }}>
            <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {review.ai_summary && (
        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-light)', marginBottom: 6, letterSpacing: '0.08em' }}>AI SUMMARY</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{review.ai_summary}</p>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Issues ({review.total_issues})</h2>

      {review.total_issues === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--success)', fontSize: 16, fontWeight: 600 }}>✅ No issues found. Great code!</div>
      ) : (
        <>
          {criticals.length > 0 && <IssueGroup label="Critical" issues={criticals} />}
          {warnings.length  > 0 && <IssueGroup label="Warnings" issues={warnings}  />}
          {infos.length     > 0 && <IssueGroup label="Info"     issues={infos}     />}
        </>
      )}
    </div>
  )
}

function IssueGroup({ label, issues }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        {label} ({issues.length})
      </h3>
      {issues.map(i => <IssueCard key={i.id} issue={i} />)}
    </div>
  )
}