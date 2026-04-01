import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/sections/HeroSection'
import SkillsSection from '../components/sections/SkillsSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import AchievementsSection from '../components/sections/AchievementsSection'
import WorkshopsSection from '../components/sections/WorkshopsSection'
import ContactSection from '../components/sections/ContactSection'
import { getSettings } from '../utils/api'
import { normalizeBackgroundImageUrl } from '../utils/backgroundImageUrl'

const backgroundImageModules = import.meta.glob('../assets/background/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
})

const localBackgroundUrl = Object.entries(backgroundImageModules)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .map(([, moduleUrl]) => moduleUrl)
  [0] || null

// ─── Default background ───────────────────────────────────────────────────────
// Shown when no custom background has been uploaded via the admin panel.
// To change it: commit your image to GitHub and update this URL.
// Format: https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/YOUR_IMAGE.jpg
const GITHUB_DEFAULT_BACKGROUND =
  'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/default-background.jpg'

const DEFAULT_BACKGROUND = localBackgroundUrl || GITHUB_DEFAULT_BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────

const Portfolio = () => {
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BACKGROUND)

  useEffect(() => {
    let isMounted = true

    getSettings()
      .then((response) => {
        const nextBackground = normalizeBackgroundImageUrl(response.data?.backgroundImage)
        if (isMounted && nextBackground) {
          setBackgroundImage(nextBackground)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      {backgroundImage ? (
        <>
          <div
            className="fixed inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              zIndex: 0,
              filter: 'grayscale(1) contrast(1.08) brightness(0.42)',
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.8) 100%)',
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              background: 'radial-gradient(circle at top, rgba(255,255,255,0.08) 0%, transparent 48%)',
            }}
          />
        </>
      ) : null}

      {/* Main content layer */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <SkillsSection />
          <ProjectsSection />
          <AchievementsSection />
          <WorkshopsSection />
          <ContactSection />
        </main>
      </div>
    </div>
  )
}

export default Portfolio
