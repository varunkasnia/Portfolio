import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSave } from 'react-icons/fi'
import { getAbout, updateAbout, uploadImage } from '../../utils/api'
import toast from 'react-hot-toast'

const Field = ({ label, children }) => (
  <div>
    <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">{label}</label>
    {children}
  </div>
)

const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
const getAvatarFallback = (name) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('')
  .slice(0, 2)

const AdminAbout = () => {
  const [form, setForm] = useState({
    name: '', title: '', tagline: '', description: '',
    email: '', github: '', linkedin: '', twitter: '',
    resumeUrl: '', avatar: '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const avatarFallback = getAvatarFallback(form.name || 'Your Name')

  useEffect(() => {
    getAbout().then(r => setForm(f => ({ ...f, ...r.data }))).catch(() => {})
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await uploadImage(fd)
      set('avatar', res.data.url)
      toast.success('Avatar uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateAbout(form)
      toast.success('About section updated!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-starlight mb-1">Hero / About</h1>
        <p className="text-dim text-sm">Edit your personal information shown in the hero section.</p>
      </motion.div>

      <div className="glass rounded-2xl p-8 flex flex-col gap-6">
        {/* Avatar */}
        <Field label="Profile Avatar">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-aurora/20"
              style={{ background: '#0a0e1a' }}>
              {form.avatar
                ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-display text-xl font-bold tracking-[0.2em] text-starlight/70">{avatarFallback || 'AI'}</div>
              }
            </div>
            <label className="btn-ghost text-xs cursor-pointer">
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name">
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Your Name" className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Professional Title">
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="AI/ML Engineer" className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <Field label="Tagline">
          <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
            placeholder="Building intelligent systems..." className={inputClass} style={inputStyle} />
        </Field>

        <Field label="Bio / Description">
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Tell visitors about yourself..."
            className={`${inputClass} resize-none`} style={inputStyle} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Email">
            <input value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="hello@example.com" className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Resume URL">
            <input value={form.resumeUrl} onChange={e => set('resumeUrl', e.target.value)}
              placeholder="https://..." className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="GitHub URL">
            <input value={form.github} onChange={e => set('github', e.target.value)}
              placeholder="https://github.com/..." className={inputClass} style={inputStyle} />
          </Field>
          <Field label="LinkedIn URL">
            <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
              placeholder="https://linkedin.com/..." className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Twitter URL">
            <input value={form.twitter} onChange={e => set('twitter', e.target.value)}
              placeholder="https://twitter.com/..." className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><FiSave size={14} /> Save Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAbout
