import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Portfolio from './pages/Portfolio'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAbout from './pages/admin/AdminAbout'
import AdminSkills from './pages/admin/AdminSkills'
import AdminProjects from './pages/admin/AdminProjects'
import AdminAchievements from './pages/admin/AdminAchievements'
import AdminWorkshops from './pages/admin/AdminWorkshops'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0b0b0b',
              color: '#fafafa',
              border: '1px solid rgba(255,255,255,0.12)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#f5f5f5', secondary: '#050505' } },
            error: { iconTheme: { primary: '#cfcfcf', secondary: '#050505' } },
          }}
        />

        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Portfolio />} />

          {/* Admin Auth */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
