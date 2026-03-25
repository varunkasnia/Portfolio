import { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    const { token } = res.data
    localStorage.setItem('admin_token', token)
    setUser({ token })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
