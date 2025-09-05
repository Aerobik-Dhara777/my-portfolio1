

import { useRef } from "react"
import gsap from "gsap"

export default function GlowCard({ title, subtitle, href = "#" }) {
  const cardRef = useRef(null)

  function onMove(e) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = (y / rect.height - 0.5) * -6
    const ry = (x / rect.width - 0.5) * 6
    el.style.setProperty("--x", `${x}px`)
    el.style.setProperty("--y", `${y}px`)
    gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.3, ease: "power2.out" })
  }
  function onLeave() {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" })
  }

  return (
    <a
      ref={cardRef}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group rounded-xl p-5 border relative overflow-hidden"
      style={{
        borderColor: "rgba(230,241,255,0.1)",
        background: "linear-gradient(180deg, #10151B 0%, rgba(16,21,27,0.7) 100%)",
        boxShadow: "0 0 24px #00F5FF22 inset",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(120px 120px at var(--x,50%) var(--y,50%), rgba(0,245,255,0.25), transparent 60%)",
          filter: "blur(20px)",
        }}
      />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{subtitle}</p>
      <div className="mt-4 text-sm font-medium" style={{ color: "var(--brand)" }}>
        View Project →
      </div>
    </a>
  )
}
