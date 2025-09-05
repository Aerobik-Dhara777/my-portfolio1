"use client"

import { useEffect, useRef } from "react"
import Lenis from "@studio-freight/lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    })
    lenisRef.current = lenis

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return children
}
