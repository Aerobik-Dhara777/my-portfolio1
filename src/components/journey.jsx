"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { key: "html", label: "HTML", desc: "Structured documents with semantic markup and accessibility foundations." },
  { key: "css", label: "CSS", desc: "Modern layouts with Flex/Grid, responsive design, and design systems." },
  { key: "js", label: "JavaScript", desc: "ESNext patterns, modular architecture, and performance budgets." },
  { key: "react", label: "ReactJS", desc: "Component-driven UIs, hooks, RSC patterns, and app architecture." },
  { key: "ts", label: "TypeScript", desc: "Type‑safe APIs, maintainable codebases, and scalable teams." },
  { key: "node", label: "NodeJS", desc: "Fast backends with Node.js, APIs, auth, and background jobs." },
  { key: "db", label: "Databases", desc: "Relational schemas, indexing, caching, and production migrations." },
]

export default function Journey() {
  const rootRef = useRef(null)
  const progressRef = useRef(null)
  const nodeRefs = useRef([])
  const cardRefs = useRef([])
  const connectorRefs = useRef([])

  // keep ref arrays length in sync
  nodeRefs.current = []
  cardRefs.current = []
  connectorRefs.current = []

  const setNodeRef = (el, i) => (nodeRefs.current[i] = el)
  const setCardRef = (el, i) => (cardRefs.current[i] = el)
  const setConnectorRef = (el, i) => (connectorRefs.current[i] = el)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      // spine progress fill
      gsap.set(progressRef.current, {
        transformOrigin: "50% 0%",
        scaleY: 0,
      })

      ScrollTrigger.create({
        trigger: root,
        start: "top 10%",
        end: "bottom 90%",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(progressRef.current, {
            scaleY: self.progress,
            duration: 0.1,
            ease: "none",
            overwrite: true,
          })
        },
      })

      // activate nodes + cards when in view
      nodeRefs.current.forEach((node, i) => {
        const card = cardRefs.current[i]
        const link = connectorRefs.current[i]

        if (link) {
          const side = link?.dataset?.side || "right"
          gsap.set(link, {
            transformOrigin: side === "left" ? "right center" : "left center",
            scaleX: 0,
            "--linkColor": "rgba(230,241,255,0.18)",
          })
        }

        const activate = () => {
          gsap.to(node, {
            backgroundColor: "var(--brand)",
            boxShadow: "0 0 20px rgba(0,245,255,0.8), 0 0 40px rgba(0,245,255,0.35)",
            duration: 0.25,
            ease: "power2.out",
          })
          gsap.to(link, {
            "--linkColor": "var(--brand)",
            boxShadow: "0 0 18px rgba(255,0,140,0.6)",
            scaleX: 1,
            duration: 0.35,
            ease: "power2.out",
          })
          gsap.to(card, {
            borderColor: "rgba(230,241,255,0.28)",
            boxShadow:
              "0 0 40px rgba(255,0,140,0.35), inset 0 0 24px rgba(0,245,255,0.15), 0 0 0 1px rgba(230,241,255,0.12)",
            duration: 0.35,
            ease: "power2.out",
          })
        }

        const deactivate = () => {
          gsap.to(node, {
            backgroundColor: "rgba(230,241,255,0.12)",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.25,
            ease: "power2.out",
          })
          gsap.to(link, {
            "--linkColor": "rgba(230,241,255,0.18)",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            scaleX: 0,
            duration: 0.3,
            ease: "power2.inOut",
          })
          gsap.to(card, {
            borderColor: "rgba(230,241,255,0.12)",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.35,
            ease: "power2.out",
          })
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top center+=40",
          end: "bottom center-=40",
          onEnter: activate,
          onEnterBack: activate,
          onLeave: deactivate,
          onLeaveBack: deactivate,
        })
      })

      // ensure layout-based calculations are fresh
      ScrollTrigger.refresh()
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" ref={rootRef} className="relative w-full bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-28">
        <header className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-balance">My Development Journey</h2>
          <p className="opacity-80 mt-2">Scroll down — the timeline fills and milestones glow as you pass them.</p>
        </header>

        {/* center spine */}
        <div aria-hidden="true" className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-[3px] h-full">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(230,241,255,0.12) 0%, rgba(230,241,255,0.05) 100%)",
            }}
          />
          <div
            ref={progressRef}
            className="absolute inset-0"
            style={{
              background: "var(--brand)",
              boxShadow: "0 0 24px #00F5FF88, 0 0 64px #00F5FF55",
              transform: "scaleY(0)",
            }}
          />
        </div>

        <div className="flex flex-col gap-10 md:gap-16">
          {STEPS.map((step, i) => {
            const isLeft = i % 2 !== 0
            const sidePadding = isLeft ? "md:pr-[140px]" : "md:pl-[140px]"
            const connectorWidth = 96

            const gradient = isLeft
              ? "linear-gradient(270deg, var(--linkColor) 0%, var(--linkColor) 70%, rgba(0,0,0,0) 100%)"
              : "linear-gradient(90deg, var(--linkColor) 0%, var(--linkColor) 70%, rgba(0,0,0,0) 100%)"

            return (
              <div key={step.key} className="relative md:min-h-[160px]">
                {/* node dot at center */}
                <span
                  ref={(el) => setNodeRef(el, i)}
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border z-[2]"
                  style={{
                    borderColor: "rgba(230,241,255,0.25)",
                    backgroundColor: "rgba(230,241,255,0.12)",
                  }}
                />

                {/* connector from spine to card (fades near card) */}
                <span
                  ref={(el) => setConnectorRef(el, i)}
                  aria-hidden="true"
                  data-side={isLeft ? "left" : "right"}
                  className={`hidden md:block absolute top-1/2 h-[2px] z-[1] pointer-events-none ${
                    isLeft ? "right-1/2 -translate-y-1/2" : "left-1/2 -translate-y-1/2"
                  }`}
                  style={{
                    width: `${connectorWidth}px`,
                    ["--linkColor"]: "rgba(230,241,255,0.18)",
                    background: gradient,
                    transform: "scaleX(0)",
                  }}
                />

                {/* content card */}
                <div className={`md:grid md:grid-cols-2 md:items-center ${sidePadding}`}>
                  <div className={isLeft ? "" : "md:col-start-2"}>
                    <article
                      ref={(el) => setCardRef(el, i)}
                      className="relative z-10 rounded-2xl border p-6 md:p-7"
                      style={{
                        borderColor: "rgba(230,241,255,0.12)",
                        background: "linear-gradient(180deg, #10151B 0%, rgba(16,21,27,0.7) 100%)",
                      }}
                    >
                      <header className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs uppercase tracking-widest"
                          style={{ color: "var(--brand)", letterSpacing: "0.2em" }}
                        >
                          Milestone {i + 1}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                          Level {i + 1}
                        </span>
                      </header>
                      <h3 className="text-xl md:text-2xl font-semibold mb-2">{step.label}</h3>
                      <p className="opacity-85 text-sm leading-relaxed">{step.desc}</p>
                    </article>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
