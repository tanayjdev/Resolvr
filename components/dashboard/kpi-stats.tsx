'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useUserProgress } from '@/context/user-context'

import { getComputedReadinessScore } from '@/lib/pathwayData'

import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  Gamepad2,
  Briefcase,
} from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    positive: boolean
  }
  icon: React.ElementType
  accentColor?: 'primary' | 'secondary' | 'accent'
}

function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accentColor = 'primary',
}: KPICardProps) {
  const colorMap = {
    primary: {
      card:
        'border-primary/15 hover:border-primary/30',
      glow:
        'from-primary/20 via-primary/5 to-transparent',
      icon:
        'from-primary/20 to-primary/5 text-primary border border-primary/15',
    },

    secondary: {
      card:
        'border-secondary/15 hover:border-secondary/30',
      glow:
        'from-secondary/20 via-secondary/5 to-transparent',
      icon:
        'from-secondary/20 to-secondary/5 text-secondary border border-secondary/15',
    },

    accent: {
      card:
        'border-accent/15 hover:border-accent/30',
      glow:
        'from-accent/20 via-accent/5 to-transparent',
      icon:
        'from-accent/20 to-accent/5 text-accent border border-accent/15',
    },
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-card/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.05)] transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]',
        'p-5 sm:p-6',
        colorMap[accentColor].card
      )}
    >
      {/* Glow Layer */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          'bg-gradient-to-br',
          colorMap[accentColor].glow
        )}
      />

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_55%)] opacity-60" />

      <div className="relative z-10">
        {/* Top */}
        <div className="mb-5 flex items-start justify-between">
          {/* Icon */}
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105',
              colorMap[accentColor].icon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Trend */}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                trend.positive
                  ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border border-red-500/20 bg-red-500/10 text-red-400'
              )}
            >
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}

              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h3 className="font-[var(--font-syne)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {value}
          </h3>

          {subtitle && (
            <p className="text-xs leading-relaxed text-muted-foreground/80">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function KPIStats() {
  const { progress, profile } =
  useUserProgress()

  const readinessScore = React.useMemo(
    () =>
      getComputedReadinessScore(
        profile
      ),
    [profile]
  )

  const {
     skills,
     simulationsCompleted,
     opportunitiesMatched,
  } = progress

  const stats: KPICardProps[] = [
    {
      title: 'Employability Score',
      value: `${readinessScore}%`,
      subtitle: profile.onboardingComplete
        ? `Adaptive readiness for ${profile.careerGoal || 'your pathway'}`
        : 'Complete onboarding to unlock personalized readiness',
      trend: {
        value: 12,
        positive: true,
      },
      icon: Target,
      accentColor: 'primary',
    },

    {
      title: 'Skills Tracked',
      value: skills.length,
      subtitle: '6 mastered this month',
      trend: {
        value: 8,
        positive: true,
      },
      icon: Sparkles,
      accentColor: 'secondary',
    },

    {
      title: 'Simulations Completed',
      value: simulationsCompleted,
      subtitle: '3 certifications earned',
      trend: {
        value: 15,
        positive: true,
      },
      icon: Gamepad2,
      accentColor: 'accent',
    },

    {
      title: 'Opportunities Matched',
      value: opportunitiesMatched,
      subtitle: '7 high-priority opportunities',
      trend: {
        value: 5,
        positive: true,
      },
      icon: Briefcase,
      accentColor: 'primary',
    },
  ]

  return (
    <section className="mb-8 sm:mb-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <KPICard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>
    </section>
  )
}