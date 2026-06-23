import { Link } from 'react-router-dom'
import { Code2, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 20 }}>
          <Code2 size={24} color="var(--accent-light)" />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-light), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CodeReview AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login"    style={{ padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Log in</Link>
          <Link to="/register" style={{ padding: '8px 20px', borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600 }}>Get started</Link>
        </div>
      </nav>

      <section style={{ textAlign: 'center', padding: '100px 24px 80px' }}>
        <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--accent-light)', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          AI-Powered · Built for developers
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
          Catch bugs before{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent-light), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            they catch you
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Paste your code. Get instant AI-powered bug detection, security scanning, and actionable suggestions in seconds.
        </p>
        <Link to="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 32px', borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)', color: '#fff', fontSize: 16, fontWeight: 700,
          boxShadow: '0 0 32px var(--accent-glow)',
        }}>
          Start reviewing free <ArrowRight size={18} />
        </Link>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto', padding: '0 24px 100px' }}>
        {[
          { icon: <Zap size={24} />,       title: 'Instant Analysis',  desc: 'AI-powered reviews in under 10 seconds across 10+ languages.' },
          { icon: <Shield size={24} />,    title: 'Security Scanning', desc: 'Detect vulnerabilities, injection risks, and insecure patterns.' },
          { icon: <BarChart3 size={24} />, title: 'Quality Score',     desc: '0–100 quality score with categorized issue breakdown.' },
        ].map((f) => (
          <div key={f.title} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
            <div style={{ color: 'var(--accent-light)', marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}