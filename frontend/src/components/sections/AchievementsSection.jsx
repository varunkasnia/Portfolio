import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiAward } from 'react-icons/fi'
import ImageCarousel from '../ImageCarousel'
import { getAchievements } from '../../utils/api'
import { getImageCollection, normalizeImageCollection } from '../../utils/imageCollections'

const DEFAULT_ACHIEVEMENTS = [
  { _id: '1', title: '1st Place — National AI Hackathon', date: 'March 2024', description: 'Won first place among 500+ teams by building a real-time disaster prediction system using satellite imagery and deep learning.', image: null, tags: ['Hackathon', 'Deep Learning'] },
  { _id: '2', title: 'Google ML Certification', date: 'Jan 2024', description: 'Completed the Professional Machine Learning Engineer certification with a top 5% score globally.', image: null, tags: ['Certification', 'Google'] },
  { _id: '3', title: 'Research Paper Published', date: 'Nov 2023', description: 'Published a research paper on efficient transformer architectures for edge devices in IEEE conference.', image: null, tags: ['Research', 'IEEE'] },
  { _id: '4', title: 'Open Source Contributor', date: 'Ongoing', description: 'Active contributor to scikit-learn and Hugging Face with 200+ merged pull requests.', image: null, tags: ['Open Source', 'Community'] },
]

const AchievementCard = ({ achievement }) => (
  <div className="glass rounded-2xl overflow-hidden flex flex-col h-full"
    style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
    {/* Image */}
    <div className="h-48 relative" style={{ background: 'linear-gradient(135deg, #090909, #1a1a1a)' }}>
      <ImageCarousel
        images={getImageCollection(achievement)}
        altBase={achievement.title}
        containerClassName="h-48"
        overlay={<div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent)' }} />}
        placeholder={
          <div className="w-full h-full flex items-center justify-center">
            <FiAward size={48} className="text-aurora opacity-30" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent)' }} />
          </div>
        }
      />
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="flex flex-wrap gap-2 mb-3">
        {(achievement.tags || []).map(t => (
          <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-aurora/10 text-aurora">{t}</span>
        ))}
      </div>
      <h3 className="font-display text-lg font-bold text-starlight mb-2">{achievement.title}</h3>
      <p className="text-dim text-sm leading-relaxed flex-1">{achievement.description}</p>
      <div className="mt-4 pt-4 border-t border-white/5">
        <span className="font-mono text-xs text-dim">{achievement.date}</span>
      </div>
    </div>
  </div>
)

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS.map(normalizeImageCollection))
  const [current, setCurrent] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const intervalRef = useRef(null)

  useEffect(() => {
    getAchievements()
      .then((r) => {
        if (r.data?.length) {
          setAchievements(r.data.map(normalizeImageCollection))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (achievements.length <= 1) {
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % achievements.length)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [achievements.length])

  const prev = () => {
    clearInterval(intervalRef.current)
    setCurrent(c => (c - 1 + achievements.length) % achievements.length)
  }

  const next = () => {
    clearInterval(intervalRef.current)
    setCurrent(c => (c + 1) % achievements.length)
  }

  const visibleCount = Math.min(3, achievements.length)
  const visible = Array.from({ length: visibleCount }, (_, i) => achievements[(current + i) % achievements.length])

  return (
    <section id="achievements" className="relative py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-label">Recognition</div>
          <h2 className="section-title">
            Achievements & <span className="text-gradient">Awards</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto mt-5" />
        </motion.div>

        <div className="relative">
          <div className={`grid gap-6 ${visibleCount >= 3 ? 'md:grid-cols-3' : visibleCount === 2 ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
            {visible.map((ach, i) => (
              <motion.div
                key={ach._id + current + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <AchievementCard achievement={ach} />
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="glass w-10 h-10 rounded-full flex items-center justify-center text-dim hover:text-starlight hover:border-white/20 transition-all">
              <FiChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {achievements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i === current ? '#f5f5f5' : 'rgba(255,255,255,0.18)' }}
                />
              ))}
            </div>

            <button onClick={next} className="glass w-10 h-10 rounded-full flex items-center justify-center text-dim hover:text-starlight hover:border-white/20 transition-all">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AchievementsSection
