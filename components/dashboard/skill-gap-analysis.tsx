'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'

interface SkillGap {
  name: string
  current: number
  target: number
  priority: 'high' | 'medium' | 'low'
  recommendation: string
}

const skillGaps: SkillGap[] = [
  {
    name: 'Machine Learning',
    current: 65,
    target: 90,
    priority: 'high',
    recommendation: 'Complete ML Fundamentals simulation',
  },
  {
    name: 'System Design',
    current: 55,
    target: 85,
    priority: 'high',
    recommendation: 'Start architecture case studies',
  },
  {
    name: 'Cloud Computing',
    current: 70,
    target: 85,
    priority: 'medium',
    recommendation: 'AWS certification pathway',
  },
  {
    name: 'Data Analysis',
    current: 80,
    target: 90,
    priority: 'low',
    recommendation: 'Advanced visualization techniques',
  },
]

function PriorityBadge({
  priority,
}: {
  priority: SkillGap['priority']
}) {
  const styles = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-accent/10 text-accent border-accent/20',
  }

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border',
        styles[priority]
      )}
    >
      {priority}
    </span>
  )
}

function SkillCard({
  skill,
  index,
}: {
  skill: SkillGap
  index: number
}) {
  const gapPercentage = skill.target - skill.current

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.03]"
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03]" />
      </div>

      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-sm sm:text-[15px] font-semibold text-foreground">
                {skill.name}
              </h4>

              <PriorityBadge priority={skill.priority} />
            </div>

            <p className="text-xs text-muted-foreground">
              Target: {skill.target}% proficiency
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {skill.current}%
            </div>

            <div className="text-[11px] text-muted-foreground">
              Current Score
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Progress
            </span>

            <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>{gapPercentage}% gap remaining</span>
            </div>
          </div>

          <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
            {/* Target Marker */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white/30 z-10"
              style={{ left: `${skill.target}%` }}
            />

            {/* Current Progress */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.current}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: 'easeOut',
                delay: 0.1,
              }}
              className={cn(
                'h-full rounded-full',
                skill.priority === 'high' &&
                  'bg-gradient-to-r from-red-500 via-orange-400 to-amber-300',
                skill.priority === 'medium' &&
                  'bg-gradient-to-r from-amber-400 via-yellow-300 to-accent',
                skill.priority === 'low' &&
                  'bg-gradient-to-r from-accent to-primary'
              )}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-3">
          <div className="mt-0.5 flex-shrink-0">
            {skill.priority === 'high' ? (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            ) : (
              <Sparkles className="w-4 h-4 text-primary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
              Recommended Action
            </div>

            <p className="text-sm text-foreground/85 leading-relaxed">
              {skill.recommendation}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function SkillGapAnalysis() {
  return (
    <section className="glass-panel rounded-2xl border border-white/10 p-4 sm:p-6 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-primary">
              AI Skill Intelligence
            </span>
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight">
            Skill Gap Analysis
          </h3>

          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Identify the most critical skills needed to reach your target career outcomes.
          </p>
        </div>

        <button className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/20 hover:bg-primary/5">
          <span>View Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Cards */}
      <div className="space-y-4">
        {skillGaps.map((skill, index) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            index={index}
          />
        ))}
      </div>

      {/* Mobile CTA */}
      <button className="sm:hidden mt-5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/20 hover:bg-primary/5">
        <div className="flex items-center justify-center gap-2">
          <span>View Full Report</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </button>
    </section>
  )
}