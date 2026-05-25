'use client'

import * as React from 'react'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import {
  useUserProgress,
  type Skill,
} from "@/context/user-context"

import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

function CircularProgress({
  value,
  size = 170,
  strokeWidth = 12,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2

  const circumference = radius * 2 * Math.PI

  const offset =
    circumference - (value / 100) * circumference

  return (
    <div
      className={cn('relative', className)}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

      <svg
        className="relative z-10 -rotate-90"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="var(--primary)"
            />

            <stop
              offset="100%"
              stopColor="var(--accent)"
            />
          </linearGradient>
        </defs>

        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.06)"
          fill="none"
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#progressGradient)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 1.6,
            ease: 'easeOut',
          }}
        />
      </svg>

      {/* Center */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <div className="font-[var(--font-syne)] text-4xl font-bold tracking-tight text-foreground">
          {value}%
        </div>

        <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          READY
        </div>
      </div>
    </div>
  )
}



export function EmployabilityReadiness() {
  const { progress } =
  useUserProgress()

const {
  employabilityScore,
  readinessScore,
  skills,
} = progress

const skillBreakdown =
  skills.map((skill: Skill) => ({
    name: skill.name,
    value: skill.level,

    color:
      skill.level > 80
        ? 'from-emerald-500 to-teal-400'
        : skill.level > 65
        ? 'from-primary to-cyan-400'
        : 'from-amber-500 to-orange-400',
  }))


  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl sm:p-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,198,255,0.12),transparent_35%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI Readiness Tracking
            </div>

            <h3 className="font-[var(--font-syne)] text-xl font-bold tracking-tight text-foreground">
              Employability Readiness
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
            Readiness based on simulations,
            skills, and pathway progression
            </p>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />

            <span>
            +{Math.floor(
        readinessScore / 100
        ) || 6}
        % readiness growth
      </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8 lg:flex-col xl:flex-row xl:items-center">
          {/* Progress Circle */}
          <div className="flex flex-shrink-0 justify-center">
            <CircularProgress
              value={employabilityScore}
              size={170}
              strokeWidth={12}
            />
          </div>

          {/* Skills */}
          <div className="w-full flex-1 space-y-5">
            {skillBreakdown.map((
  skill: {
    name: string
    value: number
    color: string
  },
  index: number
) => (
              <motion.div
                key={skill.name}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="space-y-2"
              >
                {/* Labels */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/90">
                    {skill.name}
                  </span>

                  <span className="text-xs font-semibold text-muted-foreground">
                    {skill.value}%
                  </span>
                </div>

                {/* Bar */}
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${skill.value}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                    }}
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r',
                      skill.color
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <button className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.05]">
          <span>View Detailed Analysis</span>

          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  )
}