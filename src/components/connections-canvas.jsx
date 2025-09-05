

// Lightweight, GPU-friendly 2D canvas with glow, mouse interaction, and GSAP intro.

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function ConnectionsCanvas() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const styles = getComputedStyle(document.body)
    const BRAND = (styles.getPropertyValue("--brand") || "#00F5FF").trim()
    const ACCENT = (styles.getPropertyValue("--accent") || "#FF008C").trim()
    const BG = (styles.getPropertyValue("--bg") || "#0B0F13").trim()

    let w = 0,
      h = 0
    let nodes = []
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect()
      w = Math.floor(width * dpr)
      h = Math.floor(height * dpr)
      canvas.width = w
      canvas.height = h
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    function initNodes() {
      const rect = canvas.getBoundingClientRect()
      const count = Math.floor((rect.width * rect.height) / 9000) + (window.innerWidth < 768 ? 20 : 45)
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.25 ? ACCENT : BRAND,
      }))
    }

    function distance(a, b) {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    function draw() {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // subtle vignette to unify the glow with background
      const g = ctx.createRadialGradient(
        rect.width * 0.5,
        rect.height * 0.2,
        0,
        rect.width * 0.5,
        rect.height * 0.2,
        rect.height,
      )
      g.addColorStop(0, "rgba(11,15,19,0)")
      g.addColorStop(1, "rgba(11,15,19,0.25)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, rect.width, rect.height)

      // update + draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        // movement
        n.x += n.vx
        n.y += n.vy

        // gentle pull toward mouse when nearby
        const mdx = mouse.x - n.x
        const mdy = mouse.y - n.y
        const md = Math.hypot(mdx, mdy)
        if (md < 140 && md > 0) {
          n.vx += (mdx / md) * 0.02
          n.vy += (mdy / md) * 0.02
        }

        // contain
        if (n.x < 0 || n.x > rect.width) n.vx *= -1
        if (n.y < 0 || n.y > rect.height) n.vy *= -1

        // draw node (glow)
        ctx.save()
        ctx.shadowColor = n.hue
        ctx.shadowBlur = 12
        ctx.fillStyle = n.hue
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 0.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // draw connections
      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = distance(a, b)
          const maxDist = 140
          if (d < maxDist) {
            const alpha = 1 - d / maxDist
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, a.hue)
            grad.addColorStop(1, b.hue)
            ctx.strokeStyle = grad
            ctx.lineWidth = Math.max(0.5, 1.2 * alpha)
            ctx.shadowColor = BRAND
            ctx.shadowBlur = 10 * alpha
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      // connect mouse to near nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y)
        if (d < 140) {
          const alpha = 1 - d / 140
          ctx.strokeStyle = BRAND
          ctx.lineWidth = 1 * alpha
          ctx.shadowColor = BRAND
          ctx.shadowBlur = 12 * alpha
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(n.x, n.y)
          ctx.stroke()
        }
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const onScroll = () => {
      // subtle parallax: shift nodes vertically based on scroll velocity
      const shift = (window.scrollY % 20) * 0.02
      for (const n of nodes) n.y += (Math.random() - 0.5) * shift
    }

    const ro = new ResizeObserver(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      resize()
      initNodes()
    })
    ro.observe(canvas)

    // initial sizing & nodes
    resize()
    initNodes()

    // intro fade
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.out" })

    window.addEventListener("mousemove", onMouse)
    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[70vh] md:h-[80vh] block" style={{ background: "transparent" }} />
}
