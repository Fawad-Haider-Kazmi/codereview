import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { reviewService } from '../services/reviewService'
import StatsCard     from '../components/dashboard/StatsCard'
import RecentReviews from '../components/dashboard/RecentReviews'
import Spinner       from '../components/ui/Spinner'
import { BarChart3, AlertTriangle, CheckCircle, Code2, PlusCircle } from 'lucide-react'

export default function Dashboard() {
  const { user }              = useAuthStore()
  const [stats, setStats]     = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([reviewService.getStats(), reviewService.getHistory({ limit: 5 })])
      .then(([s, h]) => { setStats(s.data); setReviews(h.data.reviews) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Good {greeting}, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's your code quality overview.</p>
        </div>
        <Link to="/review/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 14 }}>
          <PlusCircle size={16} /> New Review
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatsCard label="Total Reviews"    value={stats?.total_reviews}    icon={<Code2 size={20} />}          color="var(--accent-light)" />
        <StatsCard label="Avg Quality Score" value={stats?.avg_score}       icon={<BarChart3 size={20} />}     color="var(--success)" sub="out of 100" />
        <StatsCard label="Critical Issues"  value={stats?.critical_issues}  icon={<AlertTriangle size={20} />} color="var(--critical)" />
        <StatsCard label="Completed"        value={stats?.completed_reviews} icon={<CheckCircle size={20} />}  color="var(--info)" />
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Reviews</h2>
          <Link to="/history" style={{ fontSize: 13, color: 'var(--accent-light)' }}>View all →</Link>
        </div>
        <RecentReviews reviews={reviews} />
      </div>
    </div>
  )
}