'use client'

import {
  useUserProgress,
} from "@/context/user-context"

import { getFeaturedSimulation } from "@/lib/pathwayData"
import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Play,
  Clock,
  Signal,
  Star,
  ArrowRight,
  BrainCircuit,
  Trophy,
  Sparkles,
} from 'lucide-react'

interface Simulation {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  completion?: number
  featured?: boolean
}



function DifficultyBadge({
  difficulty,
}: {
  difficulty: Simulation['difficulty']
}) {
  const styles = {
    beginner:
      'bg-accent/10 text-accent border-accent/20',
    intermediate:
      'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced:
      'bg-secondary/10 text-secondary border-secondary/20',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
        styles[difficulty]
      )}
    >
      <Signal className="w-3 h-3" />
      <span>{difficulty}</span>
    </div>
  )
}

export function FeaturedSimulation() {
  const { progress, profile } =
    useUserProgress()

  const sim: Simulation =
    getFeaturedSimulation(
      profile.careerGoal,
      profile.onboardingComplete
    )

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] via-[#090b16] to-[#05060d] p-4 sm:p-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute -top-24 right-[-20%] h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Featured Simulation
            </span>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300">
            <Star className="w-3 h-3 fill-current" />
            <span>Top Rated</span>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

  Last completed:
  {
    progress.completedSimulations[
      progress.completedSimulations.length - 1
    ] || "No simulations completed"
  }
</div>


        {/* Main Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-5">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.04]" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-primary/20 to-secondary/20">
              <BrainCircuit className="w-7 h-7 text-primary" />
            </div>

            {/* Title */}
            <div className="mb-4">
              <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-2">
                {sim.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground/80">
                {sim.description}
              </p>
            </div>

            {/* Scenario Preview */}
<div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
    Scenario Preview
  </p>

  <p className="text-sm leading-relaxed text-foreground/85">
    Production systems are degrading under
    rising load. AI guidance will evaluate
    your debugging decisions, prioritization,
    and incident response strategy.
  </p>
</div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <DifficultyBadge difficulty={sim.difficulty} />

              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{sim.duration}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                <Trophy className="w-3.5 h-3.5" />
                <span>AI Feedback Enabled</span>
              </div>
            </div>

            {/* Progress */}
            {sim.completion !== undefined && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Progress
                  </span>

                  <span className="text-sm font-semibold text-foreground">
                    {sim.completion}%
                  </span>
                </div>

                <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${sim.completion}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      ease: 'easeOut',
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-secondary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="group/button relative mt-auto overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary via-cyan-400 to-secondary px-5 py-4 text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,198,255,0.18)]"
        >
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/button:opacity-100">
            <div className="absolute inset-0 bg-white/10" />
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2">
            <Play className="w-4 h-4 fill-current" />

            <span className="text-sm font-semibold">
              {sim.completion
                ? `Continue ${progress.currentPathway} Simulation`
                : `Start ${progress.currentPathway} Simulation`}
            </span>

            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </div>
        </motion.button>
      </div>
    </motion.section>
  )
}