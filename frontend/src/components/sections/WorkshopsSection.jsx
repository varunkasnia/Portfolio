import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi'
import ImageCarousel from '../ImageCarousel'
import { getWorkshops } from '../../utils/api'
import { getImageCollection, normalizeImageCollection } from '../../utils/imageCollections'

const DEFAULT_WORKSHOPS = [
  { _id: '1', title: 'Intro to Machine Learning', date: 'Feb 2024', attendees: 120, location: 'IIT Delhi', description: 'Hands-on workshop covering ML fundamentals, scikit-learn, and real-world project deployment for 120+ students.', image: null, tags: ['ML', 'Beginner'] },
  { _id: '2', title: 'Deep Learning Bootcamp', date: 'Dec 2023', attendees: 80, location: 'Online', description: 'Intensive 2-day bootcamp on neural networks, CNNs, and transfer learning with TensorFlow and PyTorch.', image: null, tags: ['Deep Learning', 'Advanced'] },
  { _id: '3', title: 'Data Visualization Masterclass', date: 'Oct 2023', attendees: 60, location: 'BITS Pilani', description: 'Taught advanced visualization techniques using Matplotlib, Seaborn, and Plotly for data storytelling.', image: null, tags: ['Data Viz', 'Python'] },
]

const WorkshopCard = ({ workshop, idx }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="glass glass-hover rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-56 h-44 md:h-auto flex-shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #090909, #1a1a1a)' }}>
          <ImageCarousel
            images={getImageCollection(workshop)}
            altBase={workshop.title}
            containerClassName="h-44 md:h-full"
            overlay={<div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.28), transparent)' }} />}
            placeholder={
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-display tracking-[0.35em] text-dim/40 uppercase">WS</span>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent)' }} />
              </div>
            }
          />
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {(workshop.tags || []).map(t => (
              <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 text-pulsar border border-white/10">{t}</span>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold text-starlight mb-3">{workshop.title}</h3>
          <p className="text-dim text-sm leading-relaxed mb-4">{workshop.description}</p>

          <div className="flex flex-wrap gap-4">
            {workshop.date && (
              <div className="flex items-center gap-1.5 text-xs text-dim">
                <FiCalendar size={12} className="text-aurora" />
                {workshop.date}
              </div>
            )}
            {workshop.attendees && (
              <div className="flex items-center gap-1.5 text-xs text-dim">
                <FiUsers size={12} className="text-aurora" />
                {workshop.attendees}+ attendees
              </div>
            )}
            {workshop.location && (
              <div className="flex items-center gap-1.5 text-xs text-dim">
                <FiMapPin size={12} className="text-aurora" />
                {workshop.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const WorkshopsSection = () => {
  const [workshops, setWorkshops] = useState(DEFAULT_WORKSHOPS.map(normalizeImageCollection))
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    getWorkshops()
      .then((r) => {
        if (r.data?.length) {
          setWorkshops(r.data.map(normalizeImageCollection))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="workshops" className="relative py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-label">Knowledge sharing</div>
          <h2 className="section-title">
            Workshops & <span className="text-gradient">Talks</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto mt-5" />
        </motion.div>

        <div className="flex flex-col gap-6">
          {workshops.map((w, i) => (
            <WorkshopCard key={w._id} workshop={w} idx={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkshopsSection
