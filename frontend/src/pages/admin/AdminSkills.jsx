import { useEffect, useState } from 'react'
import CrudManager from '../../components/admin/CrudManager'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../utils/api'

const FIELDS = [
  { key: 'name', label: 'Skill Name', type: 'text', placeholder: 'e.g. TensorFlow' },
  { key: 'category', label: 'Category', type: 'select', options: ['AI/ML', 'Data Analysis', 'Programming', 'Tools', 'Other'] },
]

const CATEGORY_COLORS = {
  'AI/ML': '#06b6d4', 'Data Analysis': '#8b5cf6',
  'Programming': '#f472b6', 'Tools': '#34d399', 'Other': '#fbbf24',
}

const SkillCard = (skill) => {
  const color = CATEGORY_COLORS[skill.category] || '#06b6d4'
  const badge = skill.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2)

  return (
    <div className="p-5 flex flex-col items-center gap-3 text-center">
      <span
        className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-sm font-bold text-starlight border"
        style={{ borderColor: `${color}40`, background: `${color}14` }}
      >
        {badge || 'SK'}
      </span>
      <div>
        <div className="font-display text-sm font-bold text-starlight">{skill.name}</div>
        <div className="font-mono text-xs mt-1" style={{ color }}>{skill.category}</div>
      </div>
    </div>
  )
}

const AdminSkills = () => {
  const [items, setItems] = useState([])

  const load = () => getSkills().then(r => setItems(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handleAdd = async (d) => { await createSkill(d); load() }
  const handleUpdate = async (id, d) => { await updateSkill(id, d); load() }
  const handleDelete = async (id) => { await deleteSkill(id); load() }

  return (
    <CrudManager
      title="Skills"
      items={items}
      fields={FIELDS}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      renderCard={SkillCard}
      accentColor="#8b5cf6"
    />
  )
}

export default AdminSkills
