import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiGithub, FiLinkedin, FiTwitter, FiDownload, FiMail } from 'react-icons/fi'
import { getAbout } from '../../utils/api'

const DEFAULT = {
  name: 'Your Name',
  title: 'AI/ML Engineer & Data Scientist',
  tagline: 'Building intelligent systems that shape the future',
  description: 'I craft elegant machine learning solutions, data pipelines, and AI-driven applications. Passionate about turning complex problems into beautiful, working software.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  email: 'hello@example.com',
  resumeUrl: '#',
}

const getAvatarFallback = (name) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('')
  .slice(0, 2)

const HeroSection = () => {
  const [about, setAbout] = useState(DEFAULT)
  const avatarFallback = getAvatarFallback(about.name || DEFAULT.name)

  useEffect(() => {
    getAbout().then(r => setAbout({ ...DEFAULT, ...r.data })).catch(() => {})
  }, [])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } }
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(163,163,163,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            <motion.div variants={item} className="flex items-center gap-3">
              <div className="w-8 h-px bg-aurora" />
              <span className="section-label">Welcome to my universe</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none"
            >
              <span className="text-starlight">Hi, I'm</span>
              <br />
              <span className="text-gradient">{about.name}</span>
            </motion.h1>

            <motion.div variants={item} className="font-mono text-aurora text-lg md:text-xl min-h-[2rem]">
              <TypeAnimation
                sequence={[
                  about.title || DEFAULT.title,
                  2000,
                  'Machine Learning Engineer',
                  2000,
                  'Data Scientist',
                  2000,
                  'AI Researcher',
                  2000,
                ]}
                wrapper="span"
                repeat={Infinity}
              />
              <span className="animate-pulse ml-0.5 text-pulsar">_</span>
            </motion.div>

            <motion.p
              variants={item}
              className="text-dim text-lg leading-relaxed max-w-lg font-body"
            >
              {about.description || DEFAULT.description}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mt-2">
              <a href={`mailto:${about.email}`} className="btn-primary flex items-center gap-2">
                <FiMail size={15} /> Get in Touch
              </a>
              {about.resumeUrl && about.resumeUrl !== '#' && (
                <a href={about.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost flex items-center gap-2">
                  <FiDownload size={15} /> Resume
                </a>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div variants={item} className="flex items-center gap-4">
              {[
                { icon: FiGithub, href: about.github, label: 'GitHub' },
                { icon: FiLinkedin, href: about.linkedin, label: 'LinkedIn' },
                { icon: FiTwitter, href: about.twitter, label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-dim hover:text-aurora hover:border-aurora/40 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Avatar / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Outer glow rings */}
            <div className="absolute w-80 h-80 rounded-full border border-aurora/10 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute w-64 h-64 rounded-full border border-pulsar/10 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />

            {/* Avatar placeholder */}
            <div className="relative w-56 h-56 rounded-full overflow-hidden border-2 border-aurora/30"
              style={{ boxShadow: '0 0 40px rgba(255,255,255,0.14), 0 0 80px rgba(255,255,255,0.06)' }}>
              {about.avatar ? (
                <img src={about.avatar} alt={about.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-5xl font-bold tracking-[0.2em] text-starlight/70"
                  style={{ background: 'linear-gradient(135deg, #090909, #1a1a1a)' }}>
                  {avatarFallback || 'AI'}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-dim tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-aurora to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
