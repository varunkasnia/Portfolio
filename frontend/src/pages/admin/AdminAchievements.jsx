import { useEffect, useState } from 'react'
import { FiAward } from 'react-icons/fi'
import CrudManager from '../../components/admin/CrudManager'
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../../utils/api'
import { getImageCollection } from '../../utils/imageCollections'

const FIELDS = [
  { key: 'title', label: 'Achievement Title', type: 'text', placeholder: '1st Place — Hackathon' },
  { key: 'date', label: 'Date', type: 'text', placeholder: 'March 2024' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'images', label: 'Achievement Images', type: 'images' },
  { key: 'tags', label: 'Tags (press Enter)', type: 'tags' },
]

const AchievementCard = (item) => {
  const images = getImageCollection(item)

  return (
    <div>
      <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #0a0e1a, #0f172a)' }}>
        {images[0]
          ? <img src={images[0]} alt={item.title} className="w-full h-full object-cover opacity-70" />
          : <div className="w-full h-full flex items-center justify-center"><FiAward size={36} className="text-aurora opacity-20" /></div>
        }
        {images.length > 1 ? (
          <span className="absolute bottom-2 left-2 font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white/80 border border-white/10">
            {images.length} slides
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex gap-1 flex-wrap mb-2">
          {(item.tags || []).slice(0, 2).map(t => (
            <span key={t} className="font-mono text-xs px-1.5 py-0.5 rounded bg-aurora/10 text-aurora">{t}</span>
          ))}
        </div>
        <h3 className="font-display text-sm font-bold text-starlight mb-1 line-clamp-2">{item.title}</h3>
        <div className="font-mono text-xs text-dim">{item.date}</div>
      </div>
    </div>
  )
}

const AdminAchievements = () => {
  const [items, setItems] = useState([])
  const load = () => getAchievements().then(r => setItems(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  return (
    <CrudManager
      title="Achievements"
      items={items}
      fields={FIELDS}
      onAdd={async d => { await createAchievement(d); load() }}
      onUpdate={async (id, d) => { await updateAchievement(id, d); load() }}
      onDelete={async id => { await deleteAchievement(id); load() }}
      renderCard={AchievementCard}
      accentColor="#f472b6"
    />
  )
}

export default AdminAchievements
