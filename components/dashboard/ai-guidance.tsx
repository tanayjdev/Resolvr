'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUserProgress } from '@/context/user-context'

import {
  getAdaptiveGuidance,
  getComputedReadinessScore,
  ONBOARDING_PROMPT_TEXT,
  type GuidanceCard,
} from '@/lib/pathwayData'

import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
  BrainCircuit,
} from 'lucide-react'

type AIInsight = GuidanceCard

function InsightIcon({
  type,
}: {
  type: AIInsight['type']
}) {
  const icons = {
    pathway: Target,
    skill: TrendingUp,
    opportunity: Lightbulb,
    action: BookOpen,
  }

  const Icon = icons[type]

  return <Icon className="w-4 h-4" />
}

function InsightCard({
  insight,
  index,
}: {
  insight: AIInsight
  index: number
}) {
  const typeStyles = {
    pathway:
      'border-primary/15 bg-primary/[0.03]',
    skill:
      'border-secondary/15 bg-secondary/[0.03]',
    opportunity:
      'border-accent/15 bg-accent/[0.03]',
    action:
      'border-amber-500/15 bg-amber-500/[0.03]',
  }

  const iconStyles = {
    pathway:
      'bg-primary/10 text-primary',
    skill:
      'bg-secondary/10 text-secondary',
    opportunity:
      'bg-accent/10 text-accent',
    action:
      'bg-amber-500/10 text-amber-400',
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
      }}
      className={cn(
        'group relative h-full w-full max-w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.03]',
        typeStyles[insight.type]
      )}
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03]" />
      </div>

      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/5',
            iconStyles[insight.type]
          )}
        >
          <InsightIcon type={insight.type} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              {insight.title}
            </h4>

            {insight.priority === 'high' && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                Priority
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground/80">
            {insight.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 pt-1">
          <ArrowRight className="w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.button>
  )
}

export function AIGuidancePanel() {
  const { progress, profile } = useUserProgress()

  const readinessScore = React.useMemo(
    () => getComputedReadinessScore(profile),
    [profile]
  )

  const insights = React.useMemo(
    () =>
      getAdaptiveGuidance({
        careerGoal: profile.careerGoal,
        interests: profile.interests,
        skillLevel: profile.skillLevel,
        readinessScore,
        pathwayProgress: profile.pathwayProgress,
        completedSimulations:
          profile.completedSimulations,
        recommendedSkills:
          profile.recommendedSkills,
        onboardingComplete:
          profile.onboardingComplete,
        simulationsCompleted:
          progress.simulationsCompleted,
      }),
    [profile, progress.simulationsCompleted, readinessScore]
  )

  return (
    <section className="glass-panel h-full w-full max-w-full overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-6">
      {!profile.onboardingComplete && (
        <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {ONBOARDING_PROMPT_TEXT}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Live AI Guidance
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 border border-white/5">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                AI Guidance
              </h3>

              <p className="text-sm text-muted-foreground/80">
                Personalized intelligence and recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            Active
          </span>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid w-full max-w-full grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            index={index}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="group relative mt-5 w-full max-w-full overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/[0.07] to-secondary/[0.08] px-4 py-3.5 transition-all duration-300 hover:border-primary/30 xl:mt-6"
      >
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] to-secondary/[0.05]" />
        </div>

        <div className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />

          <span className="text-sm font-semibold text-foreground">
            Ask AI for More Insights
          </span>

          <ArrowRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </motion.button>
    </section>
  )
}