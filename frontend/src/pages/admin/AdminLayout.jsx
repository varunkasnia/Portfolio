import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiCode, FiAward, FiBook, FiZap, FiUser,
  FiSettings, FiLogOut, FiMenu, FiX, FiExternalLink
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/about', icon: FiUser, label: 'Hero / About' },
  { to: '/admin/skills', icon: FiZap, label: 'Skills' },
  { to: '/admin/projects', icon: FiCode, label: 'Projects' },
  { to: '/admin/achievements', icon: FiAward, label: 'Achievements' },
  { to: '/admin/workshops', icon: FiBook, label: 'Workshops' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#030508' }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 glass border-r border-white/5 flex flex-col overflow-hidden"
        style={{ borderRight: '1px solid rgba(6,182,212,0.08)' }}
      >
        {/* Top */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display font-bold text-lg text-gradient"
              >
                ∞ Admin
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-8 h-8 flex items-center justify-center text-dim hover:text-aurora transition-colors rounded-lg hover:bg-aurora/10"
          >
            {sidebarOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-aurora/10 text-aurora border border-aurora/20'
                    : 'text-dim hover:text-starlight hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-sm whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/5 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dim hover:text-starlight hover:bg-white/5 transition-all duration-200"
          >
            <FiExternalLink size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-body text-sm"
                >
                  View Site
                </motion.span>
              )}
            </AnimatePresence>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
          >
            <FiLogOut size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-body text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
