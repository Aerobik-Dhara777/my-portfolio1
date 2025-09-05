"use client"

import { useEffect, useRef } from "react"

export default function NetworkField() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const runningRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { alpha: true })
    let width = 0
    let height = 0

    const brand = getComputedStyle(document.documentElement).getPropertyValue("--brand")?.trim() || "#00F5FF"
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent")?.trim() || "#FF008C"

    const pr = Math.min(window.devicePixelRatio || 1, 2)
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const nodes = []
    const maxNodes = window.innerWidth < 768 ? 16 : 28
    const speed = 0.12 // gentle drift
    const connectDist = window.innerWidth < 768 ? 110 : 140
    const maxNeighbors = 3

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * pr)
      canvas.height = Math.floor(height * pr)
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
    }

    function init() {
      nodes.length = 0
      for (let i = 0; i < maxNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 1.5 + 0.6,
        })
      }
    }

    function step(deltaMs) {
      ctx.clearRect(0, 0, width, height)

      // move
      for (const n of nodes) {
        n.x += n.vx * deltaMs * 0.06
        n.y += n.vy * deltaMs * 0.06
        if (n.x < -10) n.x = width + 10
        if (n.x > width + 10) n.x = -10
        if (n.y < -10) n.y = height + 10
        if (n.y > height + 10) n.y = -10
      }

      // connections (limit neighbors for perf)
      for (let i = 0; i < nodes.length; i++) {
        let drawn = 0
        for (let j = i + 1; j < nodes.length && drawn < maxNeighbors; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x + 0 - b.x
          const dy = a.y + 0 - b.y
          const d = Math.hypot(dx, dy)
          if (d < connectDist) {
            const alpha = 1 - d / connectDist
            ctx.strokeStyle = hexWithAlpha(brand, alpha * 0.55)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            drawn++
          }
        }
      }

      // glow points
      for (const n of nodes) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10)
        g.addColorStop(0, hexWithAlpha(brand, 0.9))
        g.addColorStop(1, hexWithAlpha(accent, 0.0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6 + n.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let last = performance.now()
    let acc = 0
    const frameCap = 1000 / 30 // 30 FPS

    function loop(now) {
      if (!runningRef.current) return
      const dt = now - last
      last = now
      acc += dt
      if (acc >= frameCap) {
        step(acc)
        acc = 0
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      init()
    })
    ro.observe(canvas)

    function onVisibility() {
      runningRef.current = document.visibilityState !== "hidden"
      if (runningRef.current) {
        last = performance.now()
        rafRef.current = requestAnimationFrame(loop)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    resize()
    init()

    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      // static dots for reduced motion
      step(0)
    }

    return () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

function hexWithAlpha(hex, alpha) {
  // supports #RRGGBB
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return `rgba(0,245,255,${alpha})`
  const r = Number.parseInt(m[1], 16)
  const g = Number.parseInt(m[2], 16)
  const b = Number.parseInt(m[3], 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
