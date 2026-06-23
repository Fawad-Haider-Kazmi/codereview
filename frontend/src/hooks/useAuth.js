import { useAuthStore } from '../store/authStore'
import { authService }  from '../services/authService'
import { useNavigate }  from 'react-router-dom'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = async (formData) => {
    try {
      const { data } = await authService.login(formData)
      setAuth(data.user, data.access_token)
      toast.success(`Welcome back, ${data.user.full_name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const register = async (formData) => {
    try {
      await authService.register(formData)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearAuth()
      navigate('/login')
      toast.success('Logged out.')
    }
  }

  return { user, token, login, register, logout }
}