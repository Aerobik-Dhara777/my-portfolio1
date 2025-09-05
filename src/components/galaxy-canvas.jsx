"use client"

// Lightweight galaxy starfield: single 2D canvas, twinkling stars, subtle parallax.
// Optimized: DPR clamp, offscreen calculations minimized, respects reduced motion.

import { useEffect, useRef } from "react"

export default function GalaxyCanvas() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const styles = getComputedStyle(document.body)
    const rawBrand = (styles.getPropertyValue("--brand") || "#00F5FF").trim()
    const rawAccent = (styles.getPropertyValue("--accent") || "#FF008C").trim()

    // Validate that the canvas accepts the color; otherwise fallback to hex
    const safeColor = (c, fallback) => {
      try {
        const prev = ctx.fillStyle
        ctx.fillStyle = c
        const ok = ctx.fillStyle !== ""
        ctx.fillStyle = prev
        return ok ? c : fallback
      } catch {
        return fallback
      }
    }

    const BRAND = safeColor(rawBrand, "#00F5FF")
    const ACCENT = safeColor(rawAccent, "#FF008C")

    let width = 0
    let height = 0
    let stars = []
    const mouse = { x: 0.5, y: 0.5 } // normalized
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = Math.floor(rect.width * dpr)
      height = Math.floor(rect.height * dpr)
      canvas.width = width
      canvas.height = height
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    function initStars() {
      const rect = canvas.getBoundingClientRect()
      const count = Math.min(220, Math.max(80, Math.floor((rect.width * rect.height) / 16000)))
      stars = Array.from({ length: count }).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.2 + 0.4,
        tw: Math.random() * Math.PI * 2,
        sp: 0.002 + Math.random() * 0.004,
        hue: Math.random() < 0.2 ? ACCENT : BRAND,
        depth: Math.random(), // 0..1 for parallax
      }))
    }

    function drawNebula() {
      const rect = canvas.getBoundingClientRect()
      // top-right cyan glow
      const g1 = ctx.createRadialGradient(
        rect.width * 0.85,
        rect.height * 0.25,
        0,
        rect.width * 0.85,
        rect.height * 0.25,
        rect.width * 0.6,
      )
      // use explicit rgba to avoid parsing issues with OKLCH + hex suffix
      g1.addColorStop(0, "rgba(0,245,255,0.13)")
      g1.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, rect.width, rect.height)

      // middle-left pink haze
      const g2 = ctx.createRadialGradient(
        rect.width * 0.25,
        rect.height * 0.55,
        0,
        rect.width * 0.25,
        rect.height * 0.55,
        rect.width * 0.7,
      )
      g2.addColorStop(0, "rgba(255,0,140,0.09)")
      g2.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, rect.width, rect.height)

      // subtle vignette to bind with bg
      const vg = ctx.createRadialGradient(
        rect.width * 0.5,
        rect.height * 0.5,
        0,
        rect.width * 0.5,
        rect.height * 0.5,
        rect.height,
      )
      vg.addColorStop(0, "rgba(0,0,0,0)")
      vg.addColorStop(1, "rgba(11,15,19,0.35)")
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, rect.width, rect.height)
    }

    function tick() {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      drawNebula()

      // stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const parallax = prefersReduced ? 0 : (s.depth - 0.5) * 6 // subtle px offset
        const px = s.x + (mouse.x - 0.5) * parallax
        const py = s.y + (mouse.y - 0.5) * parallax

        // twinkle
        s.tw += s.sp
        const alpha = prefersReduced ? 0.8 : 0.6 + Math.sin(s.tw) * 0.4

        ctx.save()
        ctx.globalAlpha = Math.max(0.2, Math.min(1, alpha))
        ctx.shadowColor = s.hue
        ctx.shadowBlur = 8
        ctx.fillStyle = s.hue
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) / rect.width
      mouse.y = (e.clientY - rect.top) / rect.height
    }

    const ro = new ResizeObserver(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      resize()
      initStars()
    })
    ro.observe(canvas)
    resize()
    initStars()
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("pointermove", onPointerMove)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[70vh] md:h-[80vh] block" style={{ background: "transparent" }} />
}
