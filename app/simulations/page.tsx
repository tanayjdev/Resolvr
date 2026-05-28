"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  BrainCircuit,
  Lock,
  Play,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  Trophy,
  Target,
  Zap,
  RotateCcw,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUserProgress } from "@/context/user-context"
import { SCENARIO_REGISTRY } from "@/lib/scenarios"

const CATEGORIES = [
  "All",
  "AI Systems",
  "Cloud Infrastructure",
  "Security",
  "DevOps",
  "System Design",
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function SimulationsHubPage() {
  const { progress, hasHydrated } = useUserProgress()
  const [activeCategory, setActiveCategory] = React.useState<string>("All")

  const filteredScenarios = React.useMemo(() => {
    if (activeCategory === "All") return SCENARIO_REGISTRY
    return SCENARIO_REGISTRY.filter((s) => s.category === activeCategory)
  }, [activeCategory])

  const { strongestSkill, weakestSkill, completedCount } = React.useMemo(() => {
    const skills = progress.skills || []
    return {
      strongestSkill: skills.length > 0 ? skills[0].name : "Insufficient data",
      weakestSkill: skills.length > 1 ? skills[skills.length - 1].name : "Insufficient data",
      completedCount: progress.completedSimulations.length,
    }
  }, [progress.skills, progress.completedSimulations])

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Header Section */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 backdrop-blur-md">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Operations Center
            </span>
          </div>
          <h1 className="mb-4 font-[var(--font-syne)] text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            AI Simulation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Command Center
            </span>
          </h1>
          <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl">
            Adaptive employability simulations powered by AI decision analysis. 
            Test your engineering instincts against production-grade incidents.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Grid Area */}
          <div className="flex-1 space-y-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,198,255,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {filteredScenarios.map((scenario) => {
                  const isCompleted = progress.completedSimulations.includes(scenario.id)

                  return (
                    <motion.div
                      layout
                      variants={itemVariants}
                      key={scenario.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]"
                    >
                      {/* Hover Scanline */}
                      <div className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-full group-hover:opacity-100" />

                      <div className="relative z-10">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              scenario.difficulty === "Advanced" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                              scenario.difficulty === "Intermediate" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            )}>
                              {scenario.difficulty}
                            </span>
                            <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {scenario.duration}
                            </span>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success border border-success/20">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="uppercase tracking-wider text-[10px]">Cleared</span>
                            </div>
                          )}
                        </div>

                        <h3 className="mb-2 font-[var(--font-syne)] text-xl font-bold leading-tight">
                          {scenario.title}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {scenario.incidentSummary}
                        </p>
                      </div>

                      <div className="relative z-10 mt-auto pt-4 border-t border-white/5">
                        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium">{scenario.category}</span>
                          <span className="flex items-center gap-1 text-primary">
                            <Zap className="h-3 w-3" />
                            +{scenario.readinessImpact} Readiness
                          </span>
                        </div>

                        {scenario.isAvailable ? (
                          <Button
                            asChild
                            className={cn(
                              "w-full rounded-xl transition-all duration-300",
                              isCompleted
                                ? "bg-white/10 hover:bg-white/20 text-foreground"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-[0_0_20px_rgba(0,198,255,0.4)]"
                            )}
                          >
                            <Link href={`/simulation?scenario=${scenario.id}`}>
                              {isCompleted ? (
                                <>
                                  <RotateCcw className="mr-2 h-4 w-4" /> Replay Scenario
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4 fill-current" /> Launch Simulation
                                </>
                              )}
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            disabled
                            variant="outline"
                            className="w-full rounded-xl border-white/10 bg-black/20 text-muted-foreground"
                          >
                            <Lock className="mr-2 h-4 w-4" /> Coming Soon
                          </Button>
                        )}
                        {/* TODO: Implement in-progress simulation state tracking for "Continue" button */}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {filteredScenarios.length === 0 && (
                <div className="col-span-full rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center backdrop-blur-sm">
                  <BrainCircuit className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold text-foreground/80">No matches found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Try selecting a different category filter.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sticky Right Intelligence Panel (Desktop) */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-8 space-y-5 rounded-2xl border border-white/10 bg-[#05060d]/80 p-5 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold uppercase tracking-widest text-xs">Operator Intel</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Simulations Cleared</span>
                  </div>
                  <p className="text-3xl font-[var(--font-syne)] font-bold">{completedCount}</p>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Readiness Score</span>
                  </div>
                  <p className="text-3xl font-[var(--font-syne)] font-bold text-primary">
                    {progress.readinessScore}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Strongest Area</span>
                    <p className="text-sm font-medium text-emerald-400 mt-0.5 truncate">{strongestSkill}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Improvement Focus</span>
                    <p className="text-sm font-medium text-amber-400 mt-0.5 truncate">{weakestSkill}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <p className="text-xs leading-relaxed text-secondary-foreground/90">
                    <strong className="text-secondary block mb-1">AI Recommendation:</strong>
                    Complete the advanced cloud infrastructure scenarios to balance your operational profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
