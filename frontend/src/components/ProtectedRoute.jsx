import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030508' }}>
        <div className="w-8 h-8 border-2 border-aurora/20 border-t-aurora rounded-full animate-spin" />
      </div>
    )
  }

  return user ? children : <Navigate to="/admin" replace />
}

export default ProtectedRoute
