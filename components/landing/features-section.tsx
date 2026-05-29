"use client"

import { motion } from "framer-motion"
import { Compass, BarChart3, Briefcase, Trophy } from "lucide-react"
import { Container } from "@/components/ui/container"
import Link from "next/link"

const features = [
  {
    icon: Compass,
    title: "Adaptive AI Pathways",
    description: "Our AI continuously learns from market trends and your progress to refine your personalized career roadmap in real-time.",
    gradient: "from-[#00C6FF] to-[#00a0cc]",
    href: "/recommendations",
  },
  {
    icon: BarChart3,
    title: "Skill Gap Analysis",
    description: "Instantly identify the skills you need to develop and receive curated learning resources matched to your learning style.",
    gradient: "from-[#7B2FFF] to-[#5a1fcc]",
    href: "/skills",
  },
  {
    icon: Briefcase,
    title: "Work Simulations",
    description: "Practice real-world scenarios through AI-powered simulations designed by industry professionals.",
    gradient: "from-[#00C6FF] to-[#7B2FFF]",
    href: "/simulations",
  },
  {
    icon: Trophy,
    title: "Employability Score",
    description: "Track your job-readiness with a dynamic score that shows exactly how competitive you are in your target field.",
    gradient: "from-[#7B2FFF] to-[#00C6FF]",
    href: "/readiness",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] -translate-y-1/2" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1] font-bold font-[var(--font-syne)] mb-4 text-balance">
            Everything you need to <span className="text-gradient">succeed</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
            Powerful AI-driven tools designed to transform how students prepare for and navigate their careers.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group will-change-transform"
            >
              <Link href={feature.href}>
                <div className="relative h-full glass-panel border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.02] hover:-translate-y-1 cursor-pointer">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                  </div>

                  {/* Icon */}
                  <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-40 blur-2xl`} />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-lg md:text-xl tracking-tight font-bold font-[var(--font-syne)] mb-3">{feature.title}</h3>
                  <p className="relative text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>

                  {/* Bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
