import IssueCard     from './IssueCard'
import SeverityBadge from './SeverityBadge'
import { scoreColor } from '../../utils/helpers'

export default function ReviewResult({ review }) {
  if (!review) return null

  const criticals = review.issues.filter(i => i.severity === 'critical')
  const warnings  = review.issues.filter(i => i.severity === 'warning')
  const infos     = review.issues.filter(i => i.severity === 'info')

  return (
    <div>
      {/* Score and summary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: scoreColor(review.score), lineHeight: 1 }}>
            {review.score}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.08em' }}>
            QUALITY SCORE
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <SeverityBadge
            critical={review.critical_count}
            warning={review.warning_count}
            info={review.info_count}
          />
          {review.ai_summary && (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.7 }}>
              {review.ai_summary}
            </p>
          )}
        </div>
      </div>

      {/* Issues list */}
      {review.total_issues === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--success)', fontSize: 16, fontWeight: 600 }}>
          ✅ No issues found. Great code!
        </div>
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
      <h3 style={{
        fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
      }}>
        {label} ({issues.length})
      </h3>
      {issues.map(i => <IssueCard key={i.id} issue={i} />)}
    </div>
  )
}