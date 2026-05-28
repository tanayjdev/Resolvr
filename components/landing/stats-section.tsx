"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { TrendingUp, Users, Target, Award } from "lucide-react"
import { Container } from "@/components/ui/container"

const stats = [
  {
    icon: TrendingUp,
    value: 10000,
    suffix: "+",
    label: "Career paths mapped",
    description: "Personalized career trajectories analyzed",
  },
  {
    icon: Users,
    value: 92,
    suffix: "%",
    label: "Employability improvement",
    description: "Average increase after completing paths",
  },
  {
    icon: Target,
    value: 50,
    suffix: "+",
    label: "Industry partners",
    description: "Leading companies hiring our users",
  },
  {
    icon: Award,
    value: 4.9,
    suffix: "/5",
    label: "User satisfaction",
    description: "Average rating from students",
  },
]

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const endValue = value

    let animationFrame: number

    const animate = () => {
      const now = Date.now()

      const progress = Math.min(
        (now - startTime) / (duration * 1000),
        1
      )

      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(
        Math.floor(eased * endValue * 10) / 10
      )

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Emotional Copy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05] font-bold font-[var(--font-syne)] mb-6 text-balance">
              Built for <span className="text-gradient">students</span> who refuse to leave their future to chance
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 text-pretty">
              The job market is evolving faster than ever. Traditional education pathways are no longer enough.
              Resolvr AI gives you the clarity, direction, and skills to navigate uncertainty with confidence.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Real-time market intelligence</h4>
                  <p className="text-sm text-muted-foreground">Stay ahead with AI-curated insights on emerging roles and skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Personalized milestones</h4>
                  <p className="text-sm text-muted-foreground">Every pathway is unique to your goals, skills, and timeline.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gradient-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Industry validation</h4>
                  <p className="text-sm text-muted-foreground">Pathways built with input from 50+ leading employers.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.02] hover:-translate-y-1 group will-change-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl tracking-tight font-bold font-[var(--font-syne)] text-gradient mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-medium text-sm md:text-base mb-1">{stat.label}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}