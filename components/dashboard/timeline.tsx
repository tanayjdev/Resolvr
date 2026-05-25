"use client"

import * as React from "react"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

import {
  useUserProgress,
} from "@/context/user-context"

import {
  Rocket,
  GraduationCap,
  Briefcase,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react"

// =========================================================
// Types
// =========================================================

interface TimelineItem {
  id: string

  title: string

  description: string

  timeframe: string

  status:
    | "completed"
    | "current"
    | "upcoming"

  icon: React.ElementType
}

// =========================================================
// Timeline Builder
// =========================================================

function buildTimeline(
  readinessScore: number,
  employabilityScore: number,
  currentPathway: string
): TimelineItem[] {
  return [
    {
      id: "1",

      title:
        "Foundation Complete",

      description:
        "Core programming, communication, and technical fundamentals successfully completed.",

      timeframe: "Completed",

      status: "completed",

      icon: GraduationCap,
    },

    {
      id: "2",

      title: `${currentPathway} Track`,

      description:
        "Currently progressing through specialized pathway projects and industry-focused learning.",

      timeframe:
        readinessScore >= 70
          ? "Accelerated"
          : "Current",

      status:
        readinessScore >= 85
          ? "completed"
          : "current",

      icon: Rocket,
    },

    {
      id: "3",

      title:
        "Industry Certification",

      description:
        "Professional certifications, advanced simulations, and production-grade skill validation.",

      timeframe:
        readinessScore >= 80
          ? "Unlocked"
          : "Q3 2026",

      status:
        readinessScore >= 80
          ? "current"
          : "upcoming",

      icon: Award,
    },

    {
      id: "4",

      title: "Career Ready",

      description:
        "Portfolio optimization, employability enhancement, and interview preparation.",

      timeframe:
        employabilityScore >= 90
          ? "Ready"
          : "Q4 2026",

      status:
        employabilityScore >= 90
          ? "current"
          : "upcoming",

      icon: Briefcase,
    },
  ]
}

// =========================================================
// Icon
// =========================================================

function TimelineIcon({
  status,
  icon: Icon,
}: {
  status: TimelineItem["status"]

  icon: React.ElementType
}) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 sm:h-14 sm:w-14",

        status ===
          "completed" &&
          "border-accent/20 bg-accent/10 text-accent",

        status ===
          "current" &&
          "border-primary/30 bg-primary/10 text-primary shadow-[0_0_35px_rgba(0,198,255,0.18)]",

        status ===
          "upcoming" &&
          "border-white/5 bg-white/[0.03] text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />

      {status ===
        "current" && (
        <>
          <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/40" />

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" />
        </>
      )}
    </div>
  )
}

// =========================================================
// Status Badge
// =========================================================

function TimelineStatus({
  status,
}: {
  status: TimelineItem["status"]
}) {
  const styles = {
    completed:
      "border-accent/20 bg-accent/10 text-accent",

    current:
      "border-primary/20 bg-primary/10 text-primary",

    upcoming:
      "border-white/10 bg-white/[0.03] text-muted-foreground",
  }

  const labels = {
    completed:
      "Completed",

    current:
      "In Progress",

    upcoming:
      "Upcoming",
  }

  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",

        styles[status]
      )}
    >
      {labels[status]}
    </span>
  )
}

// =========================================================
// Main Component
// =========================================================

export const FutureProgressionTimeline =
  React.memo(
    function FutureProgressionTimeline() {
      const {
        progress,
      } =
        useUserProgress()

      const timeline =
        React.useMemo(() => {
          return buildTimeline(
            progress.readinessScore,
            progress.employabilityScore,
            progress.currentPathway
          )
        }, [
          progress.readinessScore,
          progress.employabilityScore,
          progress.currentPathway,
        ])

      return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] via-[#090b16] to-[#05060d] p-4 sm:p-6">
          {/* Background Glow */}
          <div className="absolute inset-0">
            <div className="absolute right-[-10%] top-[-20%] h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />

            <div className="absolute bottom-[-30%] left-[-10%] h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    AI Progression
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Career Progression Timeline
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  AI-generated roadmap tracking your long-term employability journey.
                </p>
              </div>

              <button className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                <span>
                  Customize Path
                </span>

                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Insight */}
            <div className="mb-8 flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
              <TrendingUp className="h-4 w-4 flex-shrink-0 text-accent" />

              <p className="text-sm text-accent">
                AI predicts strong long-term growth momentum based on your readiness progression.
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden xl:block">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-0 right-0 top-7 h-[2px] bg-white/10">
                <motion.div
  className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent via-primary to-secondary"

  initial={{
    width: "20%",
  }}

  animate={{
    width: `${Math.min(
      100,
      Math.max(
        20,
        progress.readinessScore /
          10
      )
    )}%`,
  }}

  transition={{
    duration: 0.9,
    ease: "easeOut",
  }}
/>
                </div>

                {/* Timeline */}
                <div className="relative grid grid-cols-4 gap-6">
                  {timeline.map(
                    (
                      item,
                      index
                    ) => (
                      <motion.div
                        key={item.id}
                        initial={{
                          opacity: 0,
                          y: 24,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.45,
                          delay:
                            index *
                            0.08,
                        }}
                        className="flex flex-col items-center text-center"
                      >
                        <TimelineIcon
                          status={
                            item.status
                          }
                          icon={
                            item.icon
                          }
                        />

                        <div className="mt-5 flex flex-col items-center">
                          <TimelineStatus
                            status={
                              item.status
                            }
                          />

                          <h4
                            className={cn(
                              "mt-3 text-sm font-semibold",

                              item.status ===
                                "upcoming"
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {
                              item.title
                            }
                          </h4>

                          <p className="mt-2 line-clamp-3 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                            {
                              item.description
                            }
                          </p>

                          <span
                            className={cn(
                              "mt-3 text-xs font-semibold uppercase tracking-[0.12em]",

                              item.status ===
                                "completed" &&
                                "text-accent",

                              item.status ===
                                "current" &&
                                "text-primary",

                              item.status ===
                                "upcoming" &&
                                "text-muted-foreground"
                            )}
                          >
                            {
                              item.timeframe
                            }
                          </span>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-5 xl:hidden">
              {timeline.map(
                (
                  item,
                  index
                ) => (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        index *
                        0.08,
                    }}
                    className="relative flex gap-4"
                  >
                    {/* Connector */}
                    {index <
                      timeline.length -
                        1 && (
                      <div
                        className={cn(
                          "absolute left-[23px] top-14 h-[calc(100%-10px)] w-[2px]",

                          item.status ===
                            "completed"
                            ? "bg-gradient-to-b from-accent/60 to-primary/20"
                            : "bg-white/10"
                        )}
                      />
                    )}

                    <TimelineIcon
                      status={
                        item.status
                      }
                      icon={
                        item.icon
                      }
                    />

                    <div
                      className={cn(
                        "flex-1 rounded-2xl border p-4 transition-all duration-300",

                        item.status ===
                          "completed" &&
                          "border-accent/10 bg-accent/5",

                        item.status ===
                          "current" &&
                          "border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(0,198,255,0.08)]",

                        item.status ===
                          "upcoming" &&
                          "border-white/5 bg-white/[0.02]"
                      )}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h4
                            className={cn(
                              "text-sm font-semibold",

                              item.status ===
                                "upcoming"
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {
                              item.title
                            }
                          </h4>

                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {
                              item.description
                            }
                          </p>
                        </div>

                        <TimelineStatus
                          status={
                            item.status
                          }
                        />
                      </div>

                      <div
                        className={cn(
                          "mt-3 text-[11px] font-semibold uppercase tracking-[0.12em]",

                          item.status ===
                            "completed" &&
                            "text-accent",

                          item.status ===
                            "current" &&
                            "text-primary",

                          item.status ===
                            "upcoming" &&
                            "text-muted-foreground"
                        )}
                      >
                        {
                          item.timeframe
                        }
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>
      )
    }
  )