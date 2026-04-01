import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiAlertTriangle, FiImage, FiRotateCcw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import API, { getSettings, updateSettings, uploadBackgroundImage } from '../../utils/api'
import { normalizeBackgroundImageUrl } from '../../utils/backgroundImageUrl'

const AdminSettings = () => {
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [settingsForm, setSettingsForm] = useState({ backgroundImage: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)

  useEffect(() => {
    getSettings()
      .then((response) => {
        setSettingsForm({
          backgroundImage: normalizeBackgroundImageUrl(response.data?.backgroundImage || ''),
        })
      })
      .catch(() => {
        toast.error('Failed to load site settings')
      })
  }, [])

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
    setPasswordSaving(true)
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
      setPasswordSaving(false)
    }
  }

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingBackground(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const uploadResponse = await uploadBackgroundImage(formData)
      const nextBackgroundImage = uploadResponse.data?.url || ''

      await updateSettings({ backgroundImage: nextBackgroundImage })
      setSettingsForm({ backgroundImage: nextBackgroundImage })
      toast.success('Background updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update background')
    } finally {
      setUploadingBackground(false)
      e.target.value = ''
    }
  }

  const handleBackgroundSave = async () => {
    setSettingsSaving(true)
    try {
      const normalizedBackgroundImage = normalizeBackgroundImageUrl(settingsForm.backgroundImage)
      const response = await updateSettings({ backgroundImage: normalizedBackgroundImage })
      setSettingsForm({ backgroundImage: normalizeBackgroundImageUrl(response.data?.backgroundImage || '') })
      toast.success('Background settings saved!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save background settings')
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleResetBackground = async () => {
    setSettingsSaving(true)
    try {
      await updateSettings({ backgroundImage: '' })
      setSettingsForm({ backgroundImage: '' })
      toast.success('Background reset to default image')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset background')
    } finally {
      setSettingsSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
  const previewBackgroundImage = normalizeBackgroundImageUrl(settingsForm.backgroundImage)

  return (
    <div className="p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-starlight mb-1">Settings</h1>
        <p className="text-dim text-sm">Manage your admin account security and site background.</p>
      </motion.div>

      <div className="glass rounded-2xl p-8 mb-5">
        <h2 className="font-display text-lg font-bold text-starlight mb-6 flex items-center gap-2">
          <FiImage className="text-aurora" size={18} />
          Background Image
        </h2>

        <div className="flex flex-col gap-5">
          <div
            className="w-full h-52 rounded-2xl overflow-hidden border border-white/10 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundColor: '#030508',
              backgroundImage: previewBackgroundImage
                ? `url(${previewBackgroundImage})`
                : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            }}
          >
            {!previewBackgroundImage ? (
              <div className="w-full h-full flex items-center justify-center text-center px-6">
                <p className="text-sm text-dim">
                  Using the default bundled background image right now.
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">
              Custom Background URL
            </label>
            <input
              value={settingsForm.backgroundImage}
              onChange={(e) => setSettingsForm({ backgroundImage: e.target.value })}
              placeholder="https://... or uploaded file URL"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="btn-ghost text-xs cursor-pointer">
              {uploadingBackground ? 'Uploading...' : 'Upload New Background'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                className="hidden"
                onChange={handleBackgroundUpload}
                disabled={uploadingBackground}
              />
            </label>

            <button
              type="button"
              onClick={handleBackgroundSave}
              disabled={settingsSaving || uploadingBackground}
              className="btn-primary flex items-center gap-2"
            >
              {settingsSaving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><FiSave size={14} /> Save Background</>
              }
            </button>

            <button
              type="button"
              onClick={handleResetBackground}
              disabled={settingsSaving || uploadingBackground}
              className="btn-ghost flex items-center gap-2 text-xs"
            >
              <FiRotateCcw size={14} />
              Use Default Background
            </button>
          </div>

          <p className="text-xs text-dim">
            Uploading will immediately save the new background. Google Drive share links are converted automatically. Canva links still need a direct image URL.
          </p>
        </div>
      </div>

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

          <button type="submit" disabled={passwordSaving} className="btn-primary flex items-center justify-center gap-2 mt-2">
            {passwordSaving
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
