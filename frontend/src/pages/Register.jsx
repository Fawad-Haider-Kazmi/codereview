import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { getErrorMessage } from '../utils/helpers'
import { AuthLayout, Field, SubmitBtn } from './Login'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm]       = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.register(form)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Start reviewing code for free">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Full name" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
        <Field label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
        <Field label="Password (min 8 characters)" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} />
        <SubmitBtn loading={loading}>Create account</SubmitBtn>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Have an account? <Link to="/login" style={{ color: 'var(--accent-light)' }}>Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}