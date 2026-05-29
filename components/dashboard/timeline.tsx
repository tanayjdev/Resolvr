"use client"

import * as React from "react"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

import {
  useUserProgress,
} from "@/context/user-context"

import { getComputedReadinessScore } from "@/lib/pathwayData"

import {
  Rocket,
  GraduationCap,
  Briefcase,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { CustomizePathModal } from "@/components/dashboard/CustomizePathModal"

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
  currentPathway: string,
  milestonesCompleted: number,
  certificationsEarned: number,
  unlockedPathways: string[]
): TimelineItem[] {
  const timeline: TimelineItem[] = [
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
        readinessScore >= 700
          ? "Accelerated"
          : "Current",

      status:
        readinessScore >= 700
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
        readinessScore >= 700 || certificationsEarned > 0
          ? "Unlocked"
          : "Q3 2026",

      status:
        certificationsEarned > 0
          ? "completed"
          : readinessScore >= 700
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

  // Add advanced pathway milestone if unlocked
  if (unlockedPathways.includes("AI Systems") || unlockedPathways.includes("Security")) {
    timeline.push({
      id: "5",
      title: "Advanced Specialist",
      description: "Elite pathway specialization with advanced AI or Security focus.",
      timeframe: "Unlocked",
      status: "current",
      icon: Sparkles,
    })
  }

  return timeline
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
        "relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105",

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
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />

      {status ===
        "current" && (
        <>
          <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/40 opacity-40" />

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
        profile,
      } =
        useUserProgress()

      const [isCustomizeModalOpen, setIsCustomizeModalOpen] = React.useState(false)

      const handleSavePath = (pathway: string, interests: string[]) => {
        // Update user profile with new pathway and interests
        // This would typically dispatch to a centralized context
        console.log("Saving pathway:", pathway, interests)
        // TODO: Integrate with AppStateContext when ready
      }

      const employabilityScore =
        React.useMemo(
          () =>
            getComputedReadinessScore(
              profile
            ),
          [profile]
        )

      const timeline =
        React.useMemo(() => {
          return buildTimeline(
            progress.readinessScore,
            employabilityScore,
            progress.currentPathway,
            progress.milestonesCompleted,
            progress.certificationsEarned,
            progress.unlockedPathways
          )
        }, [
          progress.readinessScore,
          employabilityScore,
          progress.currentPathway,
          progress.milestonesCompleted,
          progress.certificationsEarned,
          progress.unlockedPathways,
        ])

      return (
        <>
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] via-[#090b16] to-[#05060d] p-3 sm:p-4 md:p-5 lg:p-6">
            {/* Background Glow */}
            <div className="absolute inset-0">
              <div className="absolute right-[-10%] top-[-20%] h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />

              <div className="absolute bottom-[-30%] left-[-10%] h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1.5 sm:mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 sm:px-3 py-1">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />

                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      AI Progression
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                    Career Progression Timeline
                  </h3>

                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground/80">
                    AI-generated roadmap tracking your long-term employability journey.
                  </p>
                </div>

                <button
                  onClick={() => setIsCustomizeModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                >
                  <span>
                    Customize Path
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Insight */}
              <div className="mb-6 sm:mb-8 flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/5 px-3 sm:px-4 py-2.5 sm:py-3">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-accent" />

                <p className="text-xs sm:text-sm text-accent">
                  AI predicts strong long-term growth momentum based on your readiness progression.
                </p>
              </div>

              {/* Desktop */}
              <div className="hidden xl:block">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 top-7 h-[2px] bg-white/10 transition-all duration-300">
                    <motion.div
  className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent via-primary to-secondary shadow-[0_0_20px_rgba(0,198,255,0.12)] transition-all duration-300"

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
                          className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <TimelineIcon
                            status={
                              item.status
                            }
                            icon={
                              item.icon
                            }
                          />

                          <div className="mt-4 sm:mt-5 flex flex-col items-center">
                            <TimelineStatus
                              status={
                                item.status
                              }
                            />

                            <h4
                              className={cn(
                                "mt-2 sm:mt-3 text-xs sm:text-sm font-semibold",

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

                            <p className="mt-1.5 sm:mt-2 line-clamp-3 max-w-[180px] sm:max-w-[220px] text-[11px] sm:text-xs leading-relaxed text-muted-foreground/80">
                              {
                                item.description
                              }
                            </p>

                            <span
                              className={cn(
                                "mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em]",

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
                      className="relative flex gap-3 sm:gap-4 transition-all duration-300"
                    >
                      {/* Connector */}
                      {index <
                        timeline.length -
                          1 && (
                        <div
                          className={cn(
                            "absolute left-[20px] sm:left-[23px] top-12 sm:top-14 h-[calc(100%-8px)] sm:h-[calc(100%-10px)] w-[2px]",

                            item.status ===
                              "completed"
                              ? "bg-gradient-to-b from-accent/60 to-primary/20 shadow-[0_0_15px_rgba(0,198,255,0.1)]"
                              : item.status ===
                                  "current"
                                ? "bg-gradient-to-b from-primary/40 to-white/10 shadow-[0_0_12px_rgba(0,198,255,0.08)]"
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
                          "flex-1 rounded-2xl border p-3 sm:p-4 transition-all duration-300 hover:border-white/15",

                          item.status ===
                            "completed" &&
                            "border-accent/10 bg-accent/5 hover:border-accent/20",

                          item.status ===
                            "current" &&
                            "border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(0,198,255,0.08)] hover:border-primary/30",

                          item.status ===
                            "upcoming" &&
                            "border-white/5 bg-white/[0.02]"
                        )}
                      >
                        <div className="mb-1.5 sm:mb-2 flex items-start justify-between gap-2 sm:gap-3">
                          <div>
                            <h4
                              className={cn(
                                "text-xs sm:text-sm font-semibold",

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

                            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs leading-relaxed text-muted-foreground/80">
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
                            "mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]",

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

          <CustomizePathModal
            isOpen={isCustomizeModalOpen}
            onClose={() => setIsCustomizeModalOpen(false)}
            currentPathway={progress.currentPathway}
            onSave={handleSavePath}
          />
        </>
      )
    }
  )