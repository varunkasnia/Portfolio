import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { getSkills } from '../../utils/api'

const CATEGORY_CONFIG = {
  'AI/ML': { color: '#f5f5f5', glow: 'rgba(255,255,255,0.18)', shortLabel: 'ML' },
  'Data Analysis': { color: '#e5e5e5', glow: 'rgba(229,229,229,0.16)', shortLabel: 'DA' },
  'Programming': { color: '#d4d4d4', glow: 'rgba(212,212,212,0.14)', shortLabel: 'DEV' },
  'Tools': { color: '#bdbdbd', glow: 'rgba(189,189,189,0.14)', shortLabel: 'OPS' },
  'Other': { color: '#a3a3a3', glow: 'rgba(163,163,163,0.12)', shortLabel: 'GEN' },
}

const DEFAULT_SKILLS = [
  { name: 'Python', category: 'Programming' },
  { name: 'Machine Learning', category: 'AI/ML' },
  { name: 'Deep Learning', category: 'AI/ML' },
  { name: 'TensorFlow', category: 'AI/ML' },
  { name: 'PyTorch', category: 'AI/ML' },
  { name: 'SQL', category: 'Data Analysis' },
  { name: 'Pandas', category: 'Data Analysis' },
  { name: 'NumPy', category: 'Data Analysis' },
  { name: 'Power BI', category: 'Data Analysis' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'React', category: 'Programming' },
  { name: 'Node.js', category: 'Programming' },
  { name: 'Docker', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
  { name: 'AWS', category: 'Tools' },
]

const getSkillBadge = (skillName) => skillName
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('')
  .slice(0, 2)

const SkillCard = ({ skill, idx, config }) => {
  const [hovered, setHovered] = useState(false)
  const badge = getSkillBadge(skill.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="skill-card"
      style={{
        boxShadow: hovered ? `0 8px 32px ${config.glow}, 0 0 0 1px ${config.color}30` : undefined,
        borderColor: hovered ? `${config.color}40` : undefined,
      }}
    >
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-xs font-bold tracking-widest text-starlight border"
        style={{ borderColor: `${config.color}40`, background: `${config.color}16` }}
      >
        {badge || config.shortLabel}
      </span>
      <span
        className="font-display text-xs font-semibold text-center leading-tight"
        style={{ color: hovered ? config.color : '#bdbdbd' }}
      >
        {skill.name}
      </span>
    </motion.div>
  )
}

const CategorySection = ({ category, skills }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other']
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.25em] uppercase border"
          style={{ color: config.color, borderColor: `${config.color}30`, background: `${config.color}10` }}
        >
          {config.shortLabel}
        </span>
        <h3
          className="font-display font-bold text-base tracking-wider uppercase"
          style={{ color: config.color }}
        >
          {category}
        </h3>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${config.color}40, transparent)` }} />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {skills.map((skill, i) => (
          <SkillCard key={skill._id || skill.name} skill={skill} idx={i} config={config} />
        ))}
      </div>
    </motion.div>
  )
}

const SkillsSection = () => {
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getSkills()
      .then(r => { if (r.data?.length) setSkills(r.data) })
      .catch(() => {})
  }, [])

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <section id="skills" className="relative py-28">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-label">What I work with</div>
          <h2 className="section-title">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto mt-5" />
        </motion.div>

        <div className="glass rounded-2xl p-8">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <CategorySection key={category} category={category} skills={catSkills} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
