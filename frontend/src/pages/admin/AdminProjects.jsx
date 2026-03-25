import { useEffect, useState } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import CrudManager from '../../components/admin/CrudManager'
import { getProjects, createProject, updateProject, deleteProject } from '../../utils/api'

const getProjectImages = (project) => {
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : []
  if (images.length > 0) return images
  return project.image ? [project.image] : []
}

const FIELDS = [
  { key: 'title', label: 'Project Title', type: 'text', placeholder: 'My Awesome Project' },
  { key: 'category', label: 'Category', type: 'select', options: ['Deep Learning', 'Machine Learning', 'NLP', 'Data Analysis', 'Web Dev', 'Other'] },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What does this project do?' },
  { key: 'techStack', label: 'Tech Stack (press Enter)', type: 'tags' },
  { key: 'images', label: 'Project Images', type: 'images' },
  { key: 'github', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
  { key: 'live', label: 'Live Demo URL', type: 'text', placeholder: 'https://...' },
  { key: 'featured', label: 'Featured?', type: 'select', options: ['true', 'false'] },
]

const ProjectCard = (project) => {
  const images = getProjectImages(project)

  return (
    <div>
      <div className="h-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e1a, #0f172a)' }}>
        {images[0]
          ? <img src={images[0]} alt={project.title} className="w-full h-full object-cover opacity-70" />
          : <div className="w-full h-full flex items-center justify-center text-lg font-display tracking-[0.3em] text-dim/40 uppercase">PR</div>
        }
        {project.featured === 'true' || project.featured === true
          ? <span className="absolute top-2 right-2 font-mono text-xs px-2 py-0.5 rounded bg-aurora/20 text-aurora border border-aurora/30">Featured</span>
          : null
        }
        {images.length > 1 ? (
          <span className="absolute bottom-2 left-2 font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white/80 border border-white/10">
            {images.length} slides
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <div className="font-mono text-xs text-aurora mb-1">{project.category}</div>
        <h3 className="font-display text-sm font-bold text-starlight mb-1 truncate">{project.title}</h3>
        <p className="text-dim text-xs line-clamp-2 mb-3">{project.description}</p>
        <div className="flex gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="text-dim hover:text-aurora transition-colors">
              <FiGithub size={13} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="text-dim hover:text-aurora transition-colors">
              <FiExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const AdminProjects = () => {
  const [items, setItems] = useState([])

  const load = () => getProjects().then(r => setItems(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handleAdd = async (data) => { await createProject(data); load() }
  const handleUpdate = async (id, data) => { await updateProject(id, data); load() }
  const handleDelete = async (id) => { await deleteProject(id); load() }

  return (
    <CrudManager
      title="Projects"
      items={items}
      fields={FIELDS}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      renderCard={ProjectCard}
      accentColor="#06b6d4"
    />
  )
}

export default AdminProjects
