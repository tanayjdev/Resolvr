"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Container } from "@/components/ui/container"

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5])

  return (
    <section id="dashboard" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1] font-bold font-[var(--font-syne)] mb-4 text-balance">
            Your command center for <span className="text-gradient">career success</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
            A beautiful, intuitive dashboard that puts all your career intelligence at your fingertips.
          </p>
        </motion.div>

        {/* 3D Dashboard Preview */}
        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
            transformPerspective: 1200,
          }}
          className="relative will-change-transform"
        >
          {/* Glow effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-xl opacity-40" />

          {/* Dashboard mockup */}
          <div className="relative glass-panel rounded-2xl md:rounded-3xl overflow-hidden border border-white/10">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-muted-foreground">
                  dashboard.Resolvr.ai
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 md:p-8 bg-gradient-to-br from-[#0a0a1a] to-[#050510]">
              {/* Top Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                {[
                  { label: "Employability Score", value: "87%", change: "+12%" },
                  { label: "Skills Completed", value: "24/30", change: "+3 this week" },
                  { label: "Career Matches", value: "156", change: "↑ 23" },
                  { label: "Next Milestone", value: "3 days", change: "On track" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl border border-white/5 p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]">
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-lg md:text-2xl font-bold font-[var(--font-syne)] text-gradient">{stat.value}</div>
                    <div className="text-xs text-primary mt-1">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Main content area */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Career Path Visualization */}
                <div className="md:col-span-2 glass rounded-xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm md:text-base">Your Career Path</h3>
                    <span className="text-xs text-primary">View all →</span>
                  </div>
                  <div className="relative h-32 md:h-48">
                    {/* Simplified path visualization */}
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00C6FF" />
                          <stop offset="100%" stopColor="#7B2FFF" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 20 130 Q 100 100 150 80 T 250 50 T 380 30"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {[
                        { cx: 20, cy: 130, label: "Now" },
                        { cx: 150, cy: 80, label: "Skills" },
                        { cx: 250, cy: 50, label: "Projects" },
                        { cx: 380, cy: 30, label: "Goal" },
                      ].map((point, i) => (
                        <g key={i}>
                          <circle cx={point.cx} cy={point.cy} r="8" fill="#050510" stroke="url(#pathGradient)" strokeWidth="2" />
                          <circle cx={point.cx} cy={point.cy} r="4" fill="url(#pathGradient)" />
                          <text x={point.cx} y={point.cy + 25} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">{point.label}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Skills Progress */}
                <div className="glass rounded-xl p-4 md:p-6">
                  <h3 className="font-semibold mb-4 text-sm md:text-base">Top Skills</h3>
                  <div className="space-y-4">
                    {[
                      { skill: "Python", progress: 85 },
                      { skill: "Data Analysis", progress: 72 },
                      { skill: "Machine Learning", progress: 58 },
                      { skill: "Communication", progress: 90 },
                    ].map((item) => (
                      <div key={item.skill}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.skill}</span>
                          <span className="text-primary">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-primary"

                            initial={{
                              width: 0,
                            }}

                            animate={{
                              width: `${item.progress}%`,
                            }}

                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-2 top-1/4 glass rounded-xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hidden md:block"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium">New Badge!</div>
                <div className="text-[10px] text-muted-foreground">Python Mastery</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-2 bottom-1/3 glass rounded-xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hidden md:block"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium">Score Up!</div>
                <div className="text-[10px] text-muted-foreground">+5 this week</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}