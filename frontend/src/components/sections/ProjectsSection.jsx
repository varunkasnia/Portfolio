import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'
import ImageCarousel from '../ImageCarousel'
import { getProjects } from '../../utils/api'
import { getImageCollection, normalizeImageCollection } from '../../utils/imageCollections'

const DEFAULT_PROJECTS = [
  {
    _id: '1', title: 'Neural Style Transfer', category: 'Deep Learning',
    description: 'Real-time artistic style transfer using convolutional neural networks with custom loss functions.',
    techStack: ['Python', 'TensorFlow', 'OpenCV'],
    github: 'https://github.com', live: 'https://example.com',
    image: null, featured: true,
  },
  {
    _id: '2', title: 'Stock Prediction ML', category: 'Machine Learning',
    description: 'LSTM-based time series model for predicting stock prices with 92% directional accuracy.',
    techStack: ['Python', 'PyTorch', 'Pandas'],
    github: 'https://github.com', live: null,
    image: null, featured: true,
  },
  {
    _id: '3', title: 'NLP Sentiment Engine', category: 'NLP',
    description: 'Transformer-based sentiment analysis system processing 10k+ reviews per second.',
    techStack: ['Python', 'HuggingFace', 'FastAPI'],
    github: 'https://github.com', live: 'https://example.com',
    image: null, featured: false,
  },
]

const CATEGORY_COLORS = {
  'Deep Learning': '#f5f5f5',
  'Machine Learning': '#e5e5e5',
  'NLP': '#d4d4d4',
  'Data Analysis': '#bdbdbd',
  'Web Dev': '#a3a3a3',
}

const ProjectModal = ({ project, onClose }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="glass rounded-2xl p-8 max-w-2xl w-full relative"
        onClick={e => e.stopPropagation()}
        style={{ border: `1px solid ${CATEGORY_COLORS[project.category] || '#f5f5f5'}30` }}
      >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-dim hover:text-starlight transition-colors"
          >
            <FiX size={22} />
          </button>

          {getImageCollection(project).length > 0 && (
            <div className="w-full rounded-xl overflow-hidden mb-6">
              <ImageCarousel
                images={getImageCollection(project)}
                altBase={project.title}
                containerClassName="h-56 md:h-64"
                showCount
                overlay={<div className="absolute inset-0 bg-gradient-to-t from-[#030508]/80 via-transparent to-transparent" />}
              />
            </div>
          )}

          <span
            className="font-mono text-xs tracking-widest uppercase mb-3 block"
            style={{ color: CATEGORY_COLORS[project.category] || '#f5f5f5' }}
          >
            {project.category}
          </span>

          <h3 className="font-display text-2xl font-bold text-starlight mb-3">{project.title}</h3>
          <p className="text-dim leading-relaxed mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {(project.techStack || []).map(t => (
              <span key={t} className="glass px-3 py-1 rounded-full font-mono text-xs text-aurora">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="btn-ghost flex items-center gap-2 text-xs">
                <FiGithub size={14} /> GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2 text-xs">
                <FiExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const ProjectCard = ({ project, onClick, idx }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const color = CATEGORY_COLORS[project.category] || '#f5f5f5'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(project)}
      className="project-card"
      style={{ cursor: 'pointer' }}
    >
      {/* Image / Placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'linear-gradient(135deg, #090909, #1a1a1a)' }}>
        {getImageCollection(project).length > 0 ? (
          <ImageCarousel
            images={getImageCollection(project)}
            altBase={project.title}
            containerClassName="h-44"
            imageClassName="opacity-70"
            overlay={<div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,5,8,0.8), transparent)' }} />}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
            <span className="absolute font-display text-5xl font-black opacity-10" style={{ color }}>
              {project.title[0]}
            </span>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 font-mono text-xs px-2 py-1 rounded-full"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <span className="font-mono text-xs tracking-widest uppercase mb-2 block" style={{ color }}>
          {project.category}
        </span>
        <h3 className="font-display text-lg font-bold text-starlight mb-2">{project.title}</h3>
        <p className="text-dim text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.techStack || []).slice(0, 3).map(t => (
            <span key={t} className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: `${color}10`, color: `${color}cc` }}>
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-dim hover:text-aurora transition-colors">
                <FiGithub size={16} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-dim hover:text-aurora transition-colors">
                <FiExternalLink size={16} />
              </a>
            )}
          </div>
          <span className="font-mono text-xs text-dim">View details →</span>
        </div>
      </div>
    </motion.div>
  )
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS.map(normalizeImageCollection))
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getProjects()
      .then((r) => {
        if (r.data?.length) {
          setProjects(r.data.map(normalizeImageCollection))
        }
      })
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-28">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="section-label">What I've built</div>
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto mt-5 mb-8" />

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
                  filter === cat
                    ? 'border-white/30 bg-white/10 text-starlight shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'border-white/10 text-dim hover:border-white/20 hover:text-starlight'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} onClick={setSelected} idx={i} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

export default ProjectsSection
