import { useEffect, useRef } from "react"
import gsap from "gsap"
import GalaxyCanvas from "./galaxy-canvas"

export default function Hero() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(".hero-title", { y: 40, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" })
        .fromTo(".hero-sub", { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .fromTo(".hero-cta", { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3")

      gsap.to(".hero-title", {
        textShadow: "0 0 24px rgba(0,245,255,0.6), 0 0 64px rgba(255,0,140,0.25)",
        repeat: -1,
        yoyo: true,
        duration: 2.8,
        ease: "sine.inOut",
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden h-[70vh] md:h-[80vh] flex items-center">
      {/* ✅ Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Galaxy stars overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <GalaxyCanvas />
      </div>

      {/* ✅ Dark overlay so text is visible */}
      <div className="absolute inset-0 bg-black/0"></div>

      {/* ✅ Foreground content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-36">
        <p className="mb-4 text-sm tracking-widest uppercase" style={{ color: "beige" }}>
          Full-Stack Web Developer
        </p>
        <h1 className="hero-title text-4xl md:text-6xl font-semibold leading-tight text-balance" style={{ color: "var(--fg)" }}>
          Soumadip Dhara
        </h1>
        <p className="hero-sub mt-4 max-w-2xl opacity-90">
          Crafting futuristic experiences with React, Node.js, and 3D motion. I merge performance,
          accessibility, and striking visuals into seamless products.
        </p>
        <div className="hero-cta mt-8 flex items-center gap-4">
          <a
            href="#projects"
            className="px-5 py-3 rounded-md font-medium"
            style={{
              background: "beige",
              color: "#0b0f13",
              boxShadow: "0 0 24px #00F5FF66, 0 0 7px #00F5FF33",
            }}
          >
            View Projects
          </a>
          <a
            href="#journey"
            className="px-5 py-3 rounded-md border font-medium"
            style={{
              borderColor: "rgba(230,241,255,0.15)",
              background: "linear-gradient(180deg, #10151B 0%, rgba(16,21,27,0.6) 100%)",
            }}
          >
            My Journey
          </a>
        </div>
      </div>
    </section>
  )
}
