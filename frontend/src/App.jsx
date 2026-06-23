import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import NewReview    from './pages/NewReview'
import ReviewDetail from './pages/ReviewDetail'
import History      from './pages/History'

export default function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/"         element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/review/new" element={<NewReview />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/history"    element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}