// src/app/page.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import Hero from "../components/hero"
import Journey from "../components/journey"
import GlowCard from "../components/glow-card"
import SmoothScrollProvider from "../components/smooth-scroll-provider"

gsap.registerPlugin(ScrambleTextPlugin)

export default function Page() {
  const videoRef = useRef(null)
  const nameRef = useRef(null)
  const scrambleRef = useRef(null)

  // slow contact video playback slightly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85
    }
  }, [])

  // split-text navbar animation (angle brackets stable, text scrambled)
  useEffect(() => {
    if (!nameRef.current || !scrambleRef.current) return

    // animate scramble only on "Soumadip Dhara"
    gsap.fromTo(
      scrambleRef.current,
      { scrambleText: { text: "", chars: "01", revealDelay: 0.3 } },
      {
        scrambleText: {
          text: "Soumadip Dhara",
          chars: "0X!#?",
          speed: 0.6,
          revealDelay: 0.3,
        },
        duration: 3,
        ease: "power2.out",
        delay: 0.6,
      }
    )


  }, [])


  useEffect(() => {
  // Animate navbar links
  gsap.from(".nav-links a", {
    y: 0, // start 37px above
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1, // each link comes slightly after previous
    delay: 0.5, // small delay after page load
  })

  // Animate Hire Me button
  gsap.from(".hire-btn", {
    y: 0, // start 37px above
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.8, // slightly after navbar links
  })
}, [])


  return (
    <SmoothScrollProvider>
      <main
        style={{
          "--brand": "#00F5FF",
          "--accent": "#FF008C",
          "--bg": "#0B0F13",
          "--muted": "#10151B",
          "--fg": "#E6F1FF",
        }}
        className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)] font-sans antialiased overflow-hidden"
      >
        {/* 🔹 Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>

        {/* 🔹 Overlay for dark contrast */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        {/* 🔹 Header */}
        <header
          className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b"
          style={{ borderColor: "rgba(230,241,255,0.1)" }}
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Animated scramble name */}
            <a
              href="#"
              ref={nameRef}
              className="text-lg font-semibold tracking-wide inline-block leading-none"
              style={{
                color: "#C0D0DE",
                willChange: "transform, opacity, text-shadow",
              }}
              aria-label="Soumadip Dhara home"
            >
              {"<"}
              <span ref={scrambleRef}>Soumadip Dhara</span>
              {"/>"}
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm nav-links">
              <a className="opacity-90 hover:opacity-100 transition-opacity" href="#projects">
                Projects
              </a>
              <a className="opacity-90 hover:opacity-100 transition-opacity" href="#journey">
                Journey
              </a>
              <a className="opacity-90 hover:opacity-100 transition-opacity" href="#contact">
                Contact
              </a>
            </nav>

            <a
              href="#contact"
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{
                background: "#00F5FF",
                color: "#0b0f13",
                boxShadow: "0 0 17px #00F5FF66, 0 0 57px #00F5FF33",
              }}
            >
              Hire Me
            </a>
          </div>
        </header>

        {/* 🔹 Hero Section */}
        <Hero />

        {/* 🔹 About Section */}
        <section id="about" className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
                I build fast, modern, and delightful web apps end-to-end.
              </h2>
              <p className="text-base leading-relaxed opacity-90">
                I'm Soumadip Dhara, a full-stack web developer specializing in
                React, Node.js, and performant UX. I focus on robust
                architecture, smooth motion, and pixel-perfect execution backed
                by scalable APIs and databases.
              </p>
            </div>
            <div
              className="rounded-xl p-4 md:p-6 border"
              style={{
                borderColor: "rgba(230,241,255,0.1)",
                background:
                  "linear-gradient(180deg, #10151B 0%, rgba(16,21,27,0.6) 100%)",
                boxShadow: "0 0 24px #00F5FF22 inset",
              }}
            >
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "var(--brand)" }}
              >
                Core Stack
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm opacity-90">
                <li>React</li>
                <li>Next.js</li>
                <li>TypeScript</li>
                <li>Node.js</li>
                <li>Postgres</li>
                <li>GSAP</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 🔹 Projects Section */}
        <section id="projects" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Selected Projects</h2>
            <span
              className="text-xs uppercase tracking-widest opacity-70"
              style={{ color: "var(--brand)" }}
            >
              Featured
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <GlowCard
              title="Realtime Code Editor"
              subtitle="React.js • WebSockets • Tailwind  • Socket.io"
              href="https://realtime-code-editor-sigma-flax.vercel.app/"
            />
            <GlowCard
              title="Team Portfolio"
              subtitle="Next.js • Gsap • Tailwind • WebGL"
              href="https://neuro-genesis-nine.vercel.app/"
            />
            <GlowCard
              title="Realtime Chat Application"
              subtitle="React.JS • DaisyUI • GSAP"
              href="https://github.com/Aerobik-Dhara777/realtime-chatapp"
            />
          </div>
        </section>

        {/* 🔹 Journey Section */}
        <Journey />

        {/* 🔹 Contact Section (Immersive video) */}
        <section id="contact" className="relative px-4 py-20 md:py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 min-h-[650px]">
            {/* Left: Contact Form */}
            <div
              className="rounded-2xl border p-8 md:p-12 backdrop-blur-sm bg-black/30"
              style={{
                borderColor: "rgba(230,241,255,0.1)",
                background:
                  "radial-gradient(60% 60% at 50% 0%, rgba(0,245,255,0.08) 0%, rgba(11,15,19,0.7) 100%)",
                boxShadow: "0 0 7px #00F5FF22, 0 0 47px #00F5FFaa",
              }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="What's your name?"
                    className="w-full px-4 py-3 rounded-md bg-[var(--muted)] border border-gray-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    placeholder="What's your email?"
                    className="w-full px-4 py-3 rounded-md bg-[var(--muted)] border border-gray-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Message</label>
                  <textarea
                    rows="4"
                    placeholder="What do you want to say?"
                    className="w-full px-4 py-3 rounded-md bg-[var(--muted)] border border-gray-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)] outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-5 py-3 rounded-md font-medium"
                  style={{
                    background: "var(--brand)",
                    color: "#0b0f13",
                    boxShadow: "0 0 22px #00F5FFcc, 0 0 74px #00F5FFaa",
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
            {/* Right: Neon glowing video box */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: "600px",
                height: "590px",
                minWidth: "340px",
                maxWidth: "100%",
                boxShadow:
                  "0 0 7px #00F5FF77, 0 0 47px #00F5FFaa, inset 0 0 10px #00F5FFcc",
              }}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover filter brightness-105 contrast-100 saturate-125"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  objectPosition: "center center",
                  minWidth: "100%",
                  minHeight: "100%",
                }}
              >
                <source src="/contact.mp4" type="video/mp4" />
              </video>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(circle, rgba(11,15,19,0) 84%, rgba(11,15,19,0.75) 100%)
                  `,
                }}
              />
            </div>
          </div>
        </section>

        {/* 🔹 Footer */}
        <footer
          className="py-8 text-center text-sm opacity-70"
          style={{ borderTop: "1px solid rgba(230,241,255,0.1)" }}
        >
          © {new Date().getFullYear()} Soumadip Dhara. All rights reserved.
        </footer>
      </main>
    </SmoothScrollProvider>
  )
}
