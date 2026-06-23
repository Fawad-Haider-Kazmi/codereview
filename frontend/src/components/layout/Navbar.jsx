import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { Code2, LayoutDashboard, History, LogOut, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate            = useNavigate()
  const location            = useLocation()

  const handleLogout = async () => {
    try { await authService.logout() } finally {
      clearAuth()
      navigate('/login')
      toast.success('Logged out.')
    }
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(26,26,46,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 60,
    }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18 }}>
        <Code2 size={22} color="var(--accent-light)" />
        <span style={{ background: 'linear-gradient(135deg, var(--accent-light), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CodeReview AI
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink to="/dashboard"  icon={<LayoutDashboard size={15} />} label="Dashboard" active={location.pathname === '/dashboard'} />
        <NavLink to="/review/new" icon={<PlusCircle size={15} />}      label="New Review" active={location.pathname === '/review/new'} />
        <NavLink to="/history"    icon={<History size={15} />}         label="History"    active={location.pathname === '/history'} />

        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 8px' }} />

        <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>{user?.full_name}</span>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)',
          padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  )
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 'var(--radius-sm)',
      fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
      color:       active ? 'var(--accent-light)' : 'var(--text-secondary)',
      background:  active ? 'rgba(124,58,237,0.1)' : 'transparent',
    }}>
      {icon}{label}
    </Link>
  )
}