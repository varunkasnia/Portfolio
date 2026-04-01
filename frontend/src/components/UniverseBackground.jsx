import { useEffect, useRef } from 'react'

const UniverseBackground = () => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    const isSmallViewport = window.innerWidth < 768

    // Particle system
    const PARTICLE_COUNT = prefersReducedMotion
      ? 28
      : Math.min(isSmallViewport ? 64 : 110, Math.floor((W * H) / (isSmallViewport ? 18000 : 14000)))
    const NEBULA_COUNT = prefersReducedMotion ? 2 : isSmallViewport ? 3 : 4
    const CONNECTION_DIST = prefersReducedMotion ? 0 : isSmallViewport ? 80 : 105
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
    const MOUSE_RADIUS = hasFinePointer ? (isSmallViewport ? 110 : 140) : 0
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS
    const FRAME_INTERVAL = prefersReducedMotion ? 1000 / 18 : isSmallViewport ? 1000 / 24 : 1000 / 30

    class Particle {
      constructor() { this.reset(true) }

      reset(random = false) {
        this.x = random ? Math.random() * W : Math.random() * W
        this.y = random ? Math.random() * H : Math.random() * H
        this.z = Math.random() * 3 + 0.3          // depth
        this.baseSize = (Math.random() * 1.5 + 0.4) * this.z
        this.size = this.baseSize
        this.speedX = (Math.random() - 0.5) * 0.25 * this.z
        this.speedY = (Math.random() - 0.5) * 0.18 * this.z
        this.opacity = Math.random() * 0.6 + 0.2
        this.twinkle = Math.random() * Math.PI * 2
        this.twinkleSpeed = Math.random() * 0.02 + 0.005
        // Monochrome particle palette keeps the motion atmospheric without fighting the page theme.
        const r = Math.random()
        if (r < 0.38) this.color = { r: 255, g: 255, b: 255 }
        else if (r < 0.64) this.color = { r: 229, g: 229, b: 229 }
        else if (r < 0.82) this.color = { r: 189, g: 189, b: 189 }
        else this.color = { r: 140, g: 140, b: 140 }
      }

      update(mx, my) {
        this.x += this.speedX
        this.y += this.speedY
        this.twinkle += this.twinkleSpeed

        // Mouse repulsion
        const dx = this.x - mx
        const dy = this.y - my
        const distSq = dx * dx + dy * dy
        if (MOUSE_RADIUS > 0 && distSq < MOUSE_RADIUS_SQ) {
          const dist = Math.sqrt(distSq) || 1
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          this.x += dx * force * 0.015
          this.y += dy * force * 0.015
        }

        // Wrap around edges
        if (this.x < -10) this.x = W + 10
        if (this.x > W + 10) this.x = -10
        if (this.y < -10) this.y = H + 10
        if (this.y > H + 10) this.y = -10
      }

      draw() {
        const { r, g, b } = this.color
        const twinkleOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.twinkle))
        const glowSize = this.size * 4

        // Outer glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize)
        gradient.addColorStop(0, `rgba(${r},${g},${b},${twinkleOpacity})`)
        gradient.addColorStop(0.4, `rgba(${r},${g},${b},${twinkleOpacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, twinkleOpacity * 1.5)})`
        ctx.fill()
      }
    }

    class Nebula {
      constructor() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.radius = Math.random() * 250 + 120
        this.opacity = Math.random() * 0.04 + 0.01
        this.speedX = (Math.random() - 0.5) * 0.08
        this.speedY = (Math.random() - 0.5) * 0.06
        const r = Math.random()
        if (r < 0.4) this.colors = ['255,255,255', '212,212,212']
        else if (r < 0.72) this.colors = ['212,212,212', '163,163,163']
        else this.colors = ['163,163,163', '255,255,255']
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < -this.radius) this.x = W + this.radius
        if (this.x > W + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = H + this.radius
        if (this.y > H + this.radius) this.y = -this.radius
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
        gradient.addColorStop(0, `rgba(${this.colors[0]},${this.opacity})`)
        gradient.addColorStop(0.5, `rgba(${this.colors[1]},${this.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${this.colors[0]},0)`)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Initialize particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle())
    const nebulae = Array.from({ length: NEBULA_COUNT }, () => new Nebula())

    let frameCount = 0
    let lastRenderTime = 0

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distSq = dx * dx + dy * dy

          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq)
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15
            const avgDepth = (particles[i].z + particles[j].z) / 2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * avgDepth})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }
    }

    const animate = (timestamp = 0) => {
      animRef.current = requestAnimationFrame(animate)
      if (document.hidden) return
      if (timestamp - lastRenderTime < FRAME_INTERVAL) return

      lastRenderTime = timestamp
      frameCount++

      // Reset the canvas each frame so the translucent overlay does not
      // accumulate and hide the static background image over time.
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(3, 5, 8, 0.24)'
      ctx.fillRect(0, 0, W, H)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw nebulae (atmospheric depth)
      nebulae.forEach(n => { n.update(); n.draw() })

      // Draw connections less frequently because this is the heaviest part.
      if (CONNECTION_DIST > 0 && frameCount % 3 === 0) drawConnections()

      // Draw particles
      particles.forEach(p => { p.update(mx, my); p.draw() })
    }

    animRef.current = requestAnimationFrame(animate)

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastRenderTime = 0
      }
    }

    if (hasFinePointer) {
      window.addEventListener('mousemove', handleMouse)
    }
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelAnimationFrame(animRef.current)
      if (hasFinePointer) {
        window.removeEventListener('mousemove', handleMouse)
      }
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

export default UniverseBackground
