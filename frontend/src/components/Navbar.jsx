import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = ['about', 'skills', 'projects', 'achievements', 'workshops', 'contact']

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0])

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY

      setScrolled(scrollPosition > 60)

      let currentSection = NAV_ITEMS[0]

      NAV_ITEMS.forEach((item) => {
        const section = document.getElementById(item)

        if (section && scrollPosition >= section.offsetTop - 160) {
          currentSection = item
        }
      })

      setActiveSection(currentSection)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId)

    setOpen(false)
    setActiveSection(sectionId)

    if (!section) {
      return
    }

    const navOffset = 96
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - navOffset

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-display font-bold text-xl tracking-tight"
        >
          
          <span className="text-starlight ml-2">My Portfolio</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`nav-link capitalize cursor-pointer ${
                activeSection === item ? 'active text-aurora' : ''
              }`}
              aria-current={activeSection === item ? 'page' : undefined}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/admin" className="btn-ghost text-xs">Admin</a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-starlight p-2"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-aurora origin-center transition-all"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-aurora transition-all"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-aurora origin-center transition-all"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`nav-link capitalize cursor-pointer py-2 px-3 text-left hover:bg-aurora/10 rounded-lg transition-colors ${
                    activeSection === item ? 'active text-aurora' : ''
                  }`}
                  aria-current={activeSection === item ? 'page' : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
