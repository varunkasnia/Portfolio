import { useEffect, useState } from 'react'
import CrudManager from '../../components/admin/CrudManager'
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../../utils/api'
import { getImageCollection } from '../../utils/imageCollections'

const FIELDS = [
  { key: 'title', label: 'Workshop Title', type: 'text', placeholder: 'Intro to Machine Learning' },
  { key: 'date', label: 'Date', type: 'text', placeholder: 'Feb 2024' },
  { key: 'location', label: 'Location', type: 'text', placeholder: 'IIT Delhi / Online' },
  { key: 'attendees', label: 'Attendees Count', type: 'text', placeholder: '120' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'images', label: 'Workshop Images', type: 'images' },
  { key: 'tags', label: 'Tags (press Enter)', type: 'tags' },
]

const WorkshopCard = (item) => {
  const images = getImageCollection(item)

  return (
    <div>
      <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #0a0e1a, #0f172a)' }}>
        {images[0]
          ? <img src={images[0]} alt={item.title} className="w-full h-full object-cover opacity-70" />
          : <div className="w-full h-full flex items-center justify-center text-lg font-display tracking-[0.25em] text-dim/40 uppercase">WS</div>
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
            <span key={t} className="font-mono text-xs px-1.5 py-0.5 rounded bg-pulsar/10 text-pulsar">{t}</span>
          ))}
        </div>
        <h3 className="font-display text-sm font-bold text-starlight mb-1 line-clamp-2">{item.title}</h3>
        <div className="flex gap-3 text-xs text-dim font-mono">
          {item.date && <span>{item.date}</span>}
          {item.attendees && <span>{item.attendees}+ attendees</span>}
        </div>
      </div>
    </div>
  )
}

const AdminWorkshops = () => {
  const [items, setItems] = useState([])
  const load = () => getWorkshops().then(r => setItems(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  return (
    <CrudManager
      title="Workshops"
      items={items}
      fields={FIELDS}
      onAdd={async d => { await createWorkshop(d); load() }}
      onUpdate={async (id, d) => { await updateWorkshop(id, d); load() }}
      onDelete={async id => { await deleteWorkshop(id); load() }}
      renderCard={WorkshopCard}
      accentColor="#34d399"
    />
  )
}

export default AdminWorkshops
