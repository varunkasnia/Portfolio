import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import API from '../../utils/api'

const AdminSettings = () => {
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <div className="p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-starlight mb-1">Settings</h1>
        <p className="text-dim text-sm">Manage your admin account security.</p>
      </motion.div>

      {/* Change Password */}
      <div className="glass rounded-2xl p-8">
        <h2 className="font-display text-lg font-bold text-starlight mb-6 flex items-center gap-2">
          <FiAlertTriangle className="text-aurora" size={18} />
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">{label}</label>
              <input
                type="password"
                value={pwForm[key]}
                onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder="••••••••"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          ))}

          <button type="submit" disabled={saving} className="btn-primary flex items-center justify-center gap-2 mt-2">
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><FiSave size={14} /> Update Password</>
            }
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl p-6 mt-5 border border-amber-500/20">
        <p className="font-mono text-xs text-amber-400/80">
          Default credentials: admin@portfolio.com / admin123 - Change these immediately.
        </p>
      </div>
    </div>
  )
}

export default AdminSettings
