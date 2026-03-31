import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { uploadImage } from '../../utils/api'

// Generic CRUD manager - used by projects, achievements, workshops
const CrudManager = ({
  title,
  items,
  fields, // [{key, label, type:'text'|'textarea'|'image'|'images'|'tags'|'select', options:[]}]
  onAdd,
  onUpdate,
  onDelete,
  renderCard,
  accentColor = '#06b6d4',
}) => {
  const [modal, setModal] = useState(null) // null | { mode:'add'|'edit', data:{} }
  const [form, setForm] = useState({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const buildFormState = (source = {}) => fields.reduce((acc, field) => {
    if (field.type === 'tags') {
      acc[field.key] = Array.isArray(source[field.key]) ? [...source[field.key]] : []
      return acc
    }

    if (field.type === 'images') {
      const images = Array.isArray(source[field.key]) ? source[field.key].filter(Boolean) : []
      acc[field.key] = images.length ? images : source.image ? [source.image] : []
      return acc
    }

    acc[field.key] = source[field.key] ?? ''
    return acc
  }, {})

  const openAdd = () => {
    setForm(buildFormState())
    setModal({ mode: 'add' })
  }

  const openEdit = (item) => {
    setForm(buildFormState(item))
    setModal({ mode: 'edit', id: item._id })
  }

  const closeModal = () => setModal(null)

  const handleField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const MAX_UPLOAD_BYTES = 200 * 1024 * 1024 // 200 MB — must match backend

  const handleImageUpload = async (e, key, multiple = false) => {
    const files = Array.from(e.target.files || [])

    const oversized = files.filter((f) => f.size > MAX_UPLOAD_BYTES)
    if (oversized.length > 0) {
      toast.error(`File too large. Maximum allowed size is 200 MB.`)
      e.target.value = ''
      return
    }
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadedUrls = await Promise.all(files.map(async (file) => {
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImage(fd)
        return res.data.url
      }))

      if (multiple) {
        setForm((currentForm) => ({ ...currentForm, [key]: [...(currentForm[key] || []), ...uploadedUrls] }))
        toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded!`)
      } else {
        handleField(key, uploadedUrls[0])
        toast.success('Image uploaded!')
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleTagInput = (key, e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !form[key]?.includes(val)) {
        handleField(key, [...(form[key] || []), val])
        e.target.value = ''
      }
    }
  }

  const removeTag = (key, tag) => handleField(key, (form[key] || []).filter(t => t !== tag))
  const removeImage = (key, index) => handleField(key, (form[key] || []).filter((_, i) => i !== index))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal.mode === 'add') {
        await onAdd(form)
        toast.success('Added successfully!')
      } else {
        await onUpdate(modal.id, form)
        toast.success('Updated successfully!')
      }
      closeModal()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await onDelete(id)
      toast.success('Deleted!')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-starlight">{title}</h1>
          <p className="text-dim text-sm mt-1">{items.length} items</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)` }}
        >
          <FiPlus size={15} /> Add New
        </button>
      </div>

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-dim mb-4">No Items</div>
          <p className="text-dim">No items yet. Click "Add New" to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item._id} className="glass rounded-xl overflow-hidden group">
              {renderCard(item)}
              <div className="flex gap-2 p-3 border-t border-white/5">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-dim hover:text-aurora hover:bg-aurora/10 transition-all"
                >
                  <FiEdit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass rounded-2xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
              style={{ border: `1px solid ${accentColor}20` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-starlight">
                  {modal.mode === 'add' ? 'Add New' : 'Edit'} {title.replace(/s$/, '')}
                </h2>
                <button onClick={closeModal} className="text-dim hover:text-starlight transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {fields.map(field => (
                  <div key={field.key}>
                    <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={form[field.key] || ''}
                        onChange={e => handleField(field.key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none resize-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    ) : field.type === 'image' ? (
                      <div>
                        <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:border-aurora/40"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <FiImage size={16} className="text-dim" />
                          <span className="text-sm text-dim">
                            {uploading ? 'Uploading...' : form[field.key] ? 'Change image' : 'Upload image'}
                          </span>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => handleImageUpload(e, field.key)} />
                        </label>
                        {form[field.key] && (
                          <img src={form[field.key]} alt="preview"
                            className="mt-2 w-full h-32 object-cover rounded-lg" />
                        )}
                      </div>
                    ) : field.type === 'images' ? (
                      <div>
                        <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:border-aurora/40"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <FiImage size={16} className="text-dim" />
                          <span className="text-sm text-dim">
                            {uploading ? 'Uploading...' : (form[field.key] || []).length > 0 ? 'Add more images' : 'Upload images'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleImageUpload(e, field.key, true)}
                          />
                        </label>

                        {(form[field.key] || []).length > 0 && (
                          <>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              {(form[field.key] || []).map((image, index) => (
                                <div key={`${image}-${index}`} className="relative">
                                  <img src={image} alt={`preview ${index + 1}`} className="w-full h-28 object-cover rounded-lg" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(field.key, index)}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                                  >
                                    <FiX size={12} />
                                  </button>
                                  <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-[10px] font-mono tracking-widest text-white/80 uppercase">
                                    {index === 0 ? 'Cover' : `Slide ${index + 1}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-dim leading-relaxed">
                              The first image becomes the cover image, and the rest will rotate in a sliding animation on the portfolio page.
                            </p>
                          </>
                        )}
                      </div>
                    ) : field.type === 'tags' ? (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(form[field.key] || []).map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                              style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                              {tag}
                              <button onClick={() => removeTag(field.key, tag)} className="opacity-60 hover:opacity-100">
                                <FiX size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          placeholder="Type and press Enter..."
                          onKeyDown={e => handleTagInput(field.key, e)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        value={form[field.key] || ''}
                        onChange={e => handleField(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-starlight outline-none"
                        style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <option value="">Select...</option>
                        {(field.options || []).map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={form[field.key] || ''}
                        onChange={e => handleField(field.key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/40 outline-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-7">
                <button onClick={closeModal} className="btn-ghost flex-1 text-sm">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><FiSave size={13} /> Save</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CrudManager
