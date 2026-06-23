import { useState } from 'react'
import Badge from '../ui/Badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function IssueCard({ issue }) {
  const [open, setOpen] = useState(false)

  const borderColor = issue.severity === 'critical' ? 'var(--critical)' : issue.severity === 'warning' ? 'var(--warning)' : 'var(--info)'

  return (
    <div style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', marginBottom: 8, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: 'var(--bg-surface)',
        border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)',
      }}>
        <Badge label={issue.severity} severity={issue.severity} />
        <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{issue.title}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>{issue.category}</span>
        {issue.line_number && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', marginRight: 8 }}>L{issue.line_number}</span>
        )}
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {open && (
        <div style={{ padding: 16, background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>{issue.description}</p>
          {issue.suggestion && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>SUGGESTION</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{issue.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}