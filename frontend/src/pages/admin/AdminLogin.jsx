import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #030508, #0a0e1a)' }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-10 w-full max-w-md relative z-10"
        style={{ boxShadow: '0 0 60px rgba(6,182,212,0.08)' }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-2xl font-bold text-starlight">Admin Portal</h1>
          <p className="font-mono text-xs text-dim mt-2 tracking-widest">PORTFOLIO CONTROL SYSTEM</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={15} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={15} />
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-aurora transition-colors"
              >
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 mt-2 py-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a href="/" className="font-mono text-xs text-dim hover:text-aurora transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
