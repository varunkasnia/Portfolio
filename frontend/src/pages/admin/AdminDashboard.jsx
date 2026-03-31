import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiAward, FiBook, FiZap } from 'react-icons/fi'
import { getProjects, getSkills, getAchievements, getWorkshops } from '../../utils/api'

const StatCard = ({ icon: Icon, label, count, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass rounded-2xl p-6 flex items-center gap-5"
    style={{ border: `1px solid ${color}20` }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <div className="font-display text-3xl font-bold text-starlight">{count}</div>
      <div className="font-mono text-xs text-dim tracking-wider mt-0.5">{label}</div>
    </div>
  </motion.div>
)

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, achievements: 0, workshops: 0 })

  useEffect(() => {
    Promise.allSettled([getProjects(), getSkills(), getAchievements(), getWorkshops()])
      .then(([p, s, a, w]) => {
        setCounts({
          projects: p.value?.data?.length || 0,
          skills: s.value?.data?.length || 0,
          achievements: a.value?.data?.length || 0,
          workshops: w.value?.data?.length || 0,
        })
      })
  }, [])

  const stats = [
    { icon: FiCode, label: 'PROJECTS', count: counts.projects, color: '#06b6d4', delay: 0.1 },
    { icon: FiZap, label: 'SKILLS', count: counts.skills, color: '#8b5cf6', delay: 0.2 },
    { icon: FiAward, label: 'ACHIEVEMENTS', count: counts.achievements, color: '#f472b6', delay: 0.3 },
    { icon: FiBook, label: 'WORKSHOPS', count: counts.workshops, color: '#34d399', delay: 0.4 },
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl font-bold text-starlight mb-2">Dashboard</h1>
        <p className="text-dim font-body text-sm">Welcome back! Here's an overview of your portfolio content.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <div className="font-mono text-xs tracking-[0.35em] uppercase text-aurora mb-4">Live</div>
        <h2 className="font-display text-xl font-bold text-starlight mb-2">Your portfolio is live!</h2>
        <p className="text-dim text-sm mb-6">Use the sidebar to manage your projects, skills, achievements, and workshops.</p>
        <a href="/" target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 text-sm">
          View Portfolio
        </a>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
