import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ContactSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields')
      return
    }
    setSending(true)
    // Simulate send — wire to your email service
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent. I will get back to you soon.')
    setForm({ name: '', email: '', message: '' })
    setSending(false)
  }

  return (
    <section id="contact" className="relative py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,212,212,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-label">Let's connect</div>
          <h2 className="section-title">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="glow-line max-w-xs mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <p className="text-dim text-lg leading-relaxed">
              Have a project in mind, want to collaborate, or just want to say hi? 
              My inbox is always open. I'll do my best to get back to you!
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: FiMail, label: 'Email', value: 'hello@yourname.com', href: 'mailto:hello@yourname.com' },
                { icon: FiMapPin, label: 'Location', value: 'India', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-aurora flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-dim mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-starlight hover:text-aurora transition-colors text-sm">{value}</a>
                    ) : (
                      <span className="text-starlight text-sm">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <div className="font-mono text-xs text-dim mb-4 tracking-widest uppercase">Find me online</div>
              <div className="flex gap-3">
                {[
                  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
                  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-12 h-12 glass rounded-xl flex items-center justify-center text-dim hover:text-aurora hover:border-aurora/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 flex flex-col gap-5">
              <div>
                <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/50 outline-none transition-all duration-200 focus:border-white/20 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/50 outline-none transition-all duration-200 focus:border-white/20 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="font-mono text-xs text-dim tracking-widest uppercase block mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-starlight placeholder-dim/50 outline-none transition-all duration-200 focus:border-white/20 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary flex items-center justify-center gap-2 mt-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={14} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-dim">
          © {new Date().getFullYear()} - Built with React and Three.js particles
        </span>
        <span className="font-mono text-xs text-dim">
          Made in <span className="text-aurora">India</span>
        </span>
      </div>
    </section>
  )
}

export default ContactSection
