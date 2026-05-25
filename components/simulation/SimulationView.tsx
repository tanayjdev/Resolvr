"use client"

import * as React from "react"

import Link from "next/link"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { useUserProgress } from "@/context/user-context"

import { PRODUCTION_AI_INCIDENT } from "@/lib/simulations/productionAIIncident"

import {
  calculateSimulationFinalScore,
  getEngineeringEvaluation,
  getPerformanceTier,
  getReadinessImpact,
} from "@/lib/simulations/simulation-scoring"

import type {
  SimulationDecision,
  SimulationViewPhase,
} from "@/lib/simulations/types"

const SIMULATION_PHASES: SimulationViewPhase[] =
  [
    "briefing",
    "decision",
    "feedback",
    "evaluation",
  ]

const phaseLabels: Record<
  SimulationViewPhase,
  string
> = {
  briefing: "Incident Briefing",
  decision: "Decision Phase",
  feedback: "AI Feedback",
  evaluation: "Final Evaluation",
}

const contentMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function ProgressIndicator({
  phase,
  decisionIndex,
  totalDecisions,
}: {
  phase: SimulationViewPhase
  decisionIndex: number
  totalDecisions: number
}) {
  const phaseIndex =
    SIMULATION_PHASES.indexOf(phase)

  const decisionProgress =
    phase === "decision" ||
    phase === "feedback"
      ? decisionIndex + 1
      : totalDecisions

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/80">
        <span>
          {phaseLabels[phase]}
        </span>
        <span>
          Step {phaseIndex + 1} /{" "}
          {SIMULATION_PHASES.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SIMULATION_PHASES.map(
          (step, index) => (
            <div
              key={step}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index <= phaseIndex
                  ? "bg-primary shadow-[0_0_16px_rgba(0,198,255,0.35)]"
                  : "bg-white/10"
              )}
            />
          )
        )}
      </div>

      {(phase === "decision" ||
        phase === "feedback") && (
        <div className="text-xs text-muted-foreground/80">
          Decision round{" "}
          {decisionProgress} of{" "}
          {totalDecisions}
        </div>
      )}
    </div>
  )
}

function GuidanceSidebar({
  hint,
}: {
  hint: string
}) {
  return (
    <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          AI Guidance
        </span>
        <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
      </div>

      <p className="text-sm leading-relaxed text-foreground/85">
        {hint}
      </p>
    </aside>
  )
}

function TerminalLogPanel({
  logs,
}: {
  logs: string[]
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Terminal className="h-3.5 w-3.5" />
        <span className="uppercase tracking-[0.14em]">
          Live Logs
        </span>
      </div>

      <div className="space-y-1.5 text-emerald-400/90">
        {logs.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

export default function SimulationView() {
  const {
    recordSimulationCompletion,
    progress,
  } = useUserProgress()

  const config = PRODUCTION_AI_INCIDENT

  const [phase, setPhase] =
    React.useState<SimulationViewPhase>(
      "briefing"
    )

  const [decisionIndex, setDecisionIndex] =
    React.useState(0)

  const [selectedDecisions, setSelectedDecisions] =
    React.useState<SimulationDecision[]>([])

  const [activeDecision, setActiveDecision] =
    React.useState<SimulationDecision | null>(
      null
    )

  const [hasRecordedCompletion, setHasRecordedCompletion] =
    React.useState(false)

  const currentDecisionStep =
    config.decisionSteps[decisionIndex]

  const finalScore = React.useMemo(
    () =>
      calculateSimulationFinalScore(
        selectedDecisions.map(
          (decision) =>
            decision.hiddenScore
        )
      ),
    [selectedDecisions]
  )

  const performanceTier = React.useMemo(
    () => getPerformanceTier(finalScore),
    [finalScore]
  )

  const engineeringEvaluation =
    React.useMemo(
      () =>
        getEngineeringEvaluation(
          finalScore
        ),
      [finalScore]
    )

  const readinessImpact =
    getReadinessImpact(finalScore)

  const sidebarHint =
    phase === "briefing"
      ? config.briefingSidebarHint
      : phase === "evaluation"
        ? "Simulation complete. Review readiness impact and recommended next skill."
        : activeDecision
          ? "Analyzing operational impact and production safety tradeoffs."
          : currentDecisionStep?.sidebarHint ??
            config.briefingSidebarHint

  const resetSimulation = () => {
    setPhase("briefing")
    setDecisionIndex(0)
    setSelectedDecisions([])
    setActiveDecision(null)
    setHasRecordedCompletion(false)
  }

  const handleDecisionSelect = (
    decision: SimulationDecision
  ) => {
    setActiveDecision(decision)
    setSelectedDecisions((prev) => {
      const next = [...prev]
      next[decisionIndex] = decision
      return next
    })
    setPhase("feedback")
  }

  const handleFeedbackContinue = () => {
    const isLastDecision =
      decisionIndex >=
      config.decisionSteps.length - 1

    if (!isLastDecision) {
      setDecisionIndex((prev) => prev + 1)
      setActiveDecision(null)
      setPhase("decision")
      return
    }

    const completedScores =
      selectedDecisions.map(
        (decision) =>
          decision.hiddenScore
      )

    const resolvedFinalScore =
      calculateSimulationFinalScore(
        completedScores
      )

    setPhase("evaluation")

    if (
      !hasRecordedCompletion &&
      !progress.completedSimulations.includes(
        config.simulationId
      ) &&
      completedScores.length ===
        config.decisionSteps.length
    ) {
      recordSimulationCompletion(
        config.simulationId,
        resolvedFinalScore
      )
      setHasRecordedCompletion(true)
    }
  }

  const handleBriefingContinue = () => {
    setPhase("decision")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Incident Simulator
              </span>
            </div>

            <h1 className="font-[var(--font-syne)] text-2xl font-bold tracking-tight sm:text-3xl">
              {config.title}
            </h1>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-destructive">
            {config.severity}
          </div>
        </div>

        <div className="mb-6">
          <ProgressIndicator
            phase={phase}
            decisionIndex={decisionIndex}
            totalDecisions={
              config.decisionSteps.length
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f]/90 via-[#090b16]/90 to-[#05060d]/90 p-5 backdrop-blur-xl sm:p-6">
            <AnimatePresence mode="wait">
              {phase === "briefing" && (
                <motion.div
                  key="briefing"
                  {...contentMotion}
                  transition={{
                    duration: 0.35,
                  }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                    <div>
                      <h2 className="text-lg font-semibold">
                        Incident Briefing
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                        {
                          config.briefingSummary
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {config.systemAlerts.map(
                      (alert) => (
                        <div
                          key={alert}
                          className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300"
                        >
                          {alert}
                        </div>
                      )
                    )}
                  </div>

                  <TerminalLogPanel
                    logs={
                      config.briefingLogs
                    }
                  />

                  <Button
                    onClick={
                      handleBriefingContinue
                    }
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Enter Decision Phase
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {phase === "decision" &&
                currentDecisionStep && (
                  <motion.div
                    key={`decision-${decisionIndex}`}
                    {...contentMotion}
                    transition={{
                      duration: 0.35,
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">
                        {
                          currentDecisionStep.title
                        }
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                        {
                          currentDecisionStep.incidentSummary
                        }
                      </p>
                    </div>

                    <TerminalLogPanel
                      logs={
                        currentDecisionStep.logs
                      }
                    />

                    <div className="space-y-3">
                      {currentDecisionStep.decisions.map(
                        (decision) => (
                          <button
                            key={
                              decision.id
                            }
                            type="button"
                            onClick={() =>
                              handleDecisionSelect(
                                decision
                              )
                            }
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {
                                decision.text
                              }
                            </p>
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}

              {phase === "feedback" &&
                activeDecision && (
                  <motion.div
                    key={`feedback-${activeDecision.id}`}
                    {...contentMotion}
                    transition={{
                      duration: 0.35,
                    }}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <h2 className="text-lg font-semibold text-primary">
                        AI Analysis
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                        {
                          activeDecision.feedbackText
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                        Production Impact
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                        {
                          activeDecision.consequenceText
                        }
                      </p>
                    </div>

                    <Button
                      onClick={
                        handleFeedbackContinue
                      }
                      className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

              {phase === "evaluation" && (
                <motion.div
                  key="evaluation"
                  {...contentMotion}
                  transition={{
                    duration: 0.35,
                  }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground/80">
                      Final Simulation Score
                    </p>
                    <p className="mt-2 font-[var(--font-syne)] text-5xl font-bold">
                      {finalScore}%
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-sm font-semibold",
                        performanceTier.toneClass
                      )}
                    >
                      {
                        performanceTier.label
                      }
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground/80">
                        Readiness Impact
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        +{readinessImpact}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground/80">
                        Recommended Next Skill
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {
                          engineeringEvaluation.nextSkill
                        }
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold">
                      Engineering Evaluation
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                      {
                        engineeringEvaluation.summary
                      }
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href="/dashboard">
                        Return to Dashboard
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={
                        resetSimulation
                      }
                      className="flex-1 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retry Simulation
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <GuidanceSidebar
            hint={sidebarHint}
          />
        </div>
      </div>
    </div>
  )
}
