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
// Format: https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/YOUR_IMAGE.gif
const GITHUB_DEFAULT_BACKGROUND =
  'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/default-background.gif'

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
          {/*
            GIF PERFORMANCE: Never apply CSS filter (grayscale/brightness/contrast)
            directly to an animated GIF — the browser re-runs the filter on the CPU
            for every frame, causing stutter. Instead we achieve the same visual
            result with GPU-composited overlay layers:
              • Dark gradient overlay  → replaces brightness(0.42)
              • Grayscale overlay      → replaces grayscale(1) via mix-blend-mode:color
              • Radial highlight       → replaces the subtle contrast lift

            The GIF element itself has no filter at all, so the browser can hand
            it straight to the GPU compositor and decode frames natively.
          */}

          {/* 1 — The raw GIF, GPU-accelerated, no CPU filter */}
          <div
            className="fixed inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              zIndex: 0,
              // Force GPU compositing layer so the browser never touches the CPU for this element
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
          />

          {/* 2 — Grayscale: a black overlay with mix-blend-mode:color drains all saturation */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background: '#000',
              mixBlendMode: 'color',
              opacity: 1,
            }}
          />

          {/* 3 — Darkness: replaces brightness(0.42) — heavy dark gradient top-to-bottom */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* 4 — Subtle radial highlight at top — replaces the contrast/glow lift */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 3,
              background: 'radial-gradient(circle at top, rgba(255,255,255,0.07) 0%, transparent 48%)',
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
