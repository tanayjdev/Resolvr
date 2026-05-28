"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
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
import type { SimulationViewPhase, Choice } from "@/lib/simulations/types"

const SIMULATION_PHASES: SimulationViewPhase[] = [
  "briefing",
  "decision",
  "feedback",
  "evaluation",
]

const phaseLabels: Record<SimulationViewPhase, string> = {
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
  stepIndex,
  totalSteps,
}: {
  phase: SimulationViewPhase
  stepIndex: number
  totalSteps: number
}) {
  const phaseIndex = SIMULATION_PHASES.indexOf(phase)
  const decisionProgress =
    phase === "decision" || phase === "feedback" ? stepIndex + 1 : totalSteps

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/80">
        <span>{phaseLabels[phase]}</span>
        <span>
          Step {phaseIndex + 1} / {SIMULATION_PHASES.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SIMULATION_PHASES.map((step, index) => (
          <div
            key={step}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index <= phaseIndex
                ? "bg-primary shadow-[0_0_16px_rgba(0,198,255,0.35)]"
                : "bg-white/10"
            )}
          />
        ))}
      </div>

      {(phase === "decision" || phase === "feedback") && (
        <div className="text-xs text-muted-foreground/80">
          Decision round {decisionProgress} of {totalSteps}
        </div>
      )}
    </div>
  )
}

function GuidanceSidebar({ hint, aiConfidence }: { hint: string; aiConfidence?: number }) {
  return (
    <aside className="space-y-4 h-fit">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            AI Guidance
          </span>
          <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">{hint}</p>
      </div>

      {aiConfidence !== undefined && (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span>AI Confidence</span>
            <span className={cn(
              "font-bold",
              aiConfidence >= 80 ? "text-emerald-400" : aiConfidence >= 50 ? "text-amber-400" : "text-destructive"
            )}>
              {aiConfidence}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div 
              className={cn(
                "h-full rounded-full transition-colors duration-500",
                aiConfidence >= 80 ? "bg-emerald-400" : aiConfidence >= 50 ? "bg-amber-400" : "bg-destructive"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, aiConfidence))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </aside>
  )
}

function TerminalLogPanel({
  logs,
  hasHydrated,
}: {
  logs: string[]
  hasHydrated: boolean
}) {
  const [revealedCount, setRevealedCount] = React.useState(0)

  React.useEffect(() => {
    setRevealedCount(0)
  }, [logs])

  React.useEffect(() => {
    if (!hasHydrated) return
    if (revealedCount < logs.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [revealedCount, logs.length, hasHydrated])

  const revealedLogs = logs.slice(0, Math.max(1, revealedCount))

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Terminal className="h-3.5 w-3.5" />
        <span className="uppercase tracking-[0.14em]">Live Logs</span>
      </div>
      <div className="space-y-1.5 text-emerald-400/90 min-h-[4rem]">
        {revealedLogs.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.p>
        ))}
        {revealedCount < logs.length && hasHydrated && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-3 bg-emerald-400/90 ml-1 align-middle"
          />
        )}
      </div>
    </div>
  )
}

import { useSearchParams } from "next/navigation"
import { getScenarioConfig } from "@/lib/scenarios"

// We extract the inner content into a component so it can use useSearchParams
function SimulationContent() {
  const searchParams = useSearchParams()
  const scenarioId = searchParams.get("scenario")
  
  const config = scenarioId ? getScenarioConfig(scenarioId) : null
  const { progress, hasHydrated, updateProfile } = useUserProgress()

  const [phase, setPhase] = React.useState<SimulationViewPhase>("briefing")
  
  // Safely initialize to first step if available
  const initialStepId = config?.steps?.[0]?.id || null
  const [currentStepId, setCurrentStepId] = React.useState<string | null>(initialStepId)
  
  const [selectedChoices, setSelectedChoices] = React.useState<Choice[]>([])
  const [activeChoice, setActiveChoice] = React.useState<Choice | null>(null)
  
  const [hasSubmittedCompletion, setHasSubmittedCompletion] = React.useState(false)
  
  const [aiConfidence, setAiConfidence] = React.useState(85)

  // Graceful fallback for missing config or steps
  if (!config || !config.steps || config.steps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">Scenario Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The requested simulation scenario is either missing or incorrectly configured.
        </p>
        <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  // Branching safety validation
  const currentStep = config.steps.find((s) => s.id === currentStepId) || config.steps[0]
  const currentStepIndex = config.steps.findIndex(s => s.id === currentStep.id)

  const finalScore = React.useMemo(() => {
    if (selectedChoices.length === 0) return 0
    const total = selectedChoices.reduce((sum, choice) => sum + choice.score, 0)
    return Math.max(0, Math.min(100, Math.round(total / selectedChoices.length)))
  }, [selectedChoices])

  const readinessImpact = Math.floor(finalScore / 10)

  const sidebarHint =
    phase === "briefing"
      ? config.briefingSidebarHint
      : phase === "evaluation"
        ? "Simulation complete. Review readiness impact and recommended next skill."
        : activeChoice
          ? activeChoice.feedback
          : currentStep?.aiConfidenceContext ?? currentStep?.sidebarHint ?? config.briefingSidebarHint

  const resetSimulation = () => {
    setPhase("briefing")
    setCurrentStepId(config.steps[0].id)
    setSelectedChoices([])
    setActiveChoice(null)
    setHasSubmittedCompletion(false)
    setAiConfidence(85)
  }

  const handleChoiceSelect = (choice: Choice) => {
    setActiveChoice(choice)
    setSelectedChoices((prev) => [...prev, choice])
    setAiConfidence((prev) => Math.max(0, Math.min(100, prev + choice.aiConfidenceDelta)))
    setPhase("feedback")
  }

  const handleFeedbackContinue = () => {
    if (!activeChoice) return

    let nextId: string | null = null
    
    // Check for branching rule
    if (activeChoice.nextStep) {
      const exists = config.steps.some(s => s.id === activeChoice.nextStep)
      if (exists) {
        nextId = activeChoice.nextStep
      } else {
        console.warn(`Simulation nextStep not found: ${activeChoice.nextStep}`)
      }
    }
    
    // Fallback to sequential next step
    if (!nextId) {
      if (currentStepIndex !== -1 && currentStepIndex < config.steps.length - 1) {
        nextId = config.steps[currentStepIndex + 1].id
      }
    }

    if (nextId) {
      setCurrentStepId(nextId)
      setActiveChoice(null)
      setPhase("decision")
    } else {
      // Simulation complete
      setPhase("evaluation")
      
      if (!hasSubmittedCompletion) {
        setHasSubmittedCompletion(true)
        
        // Ensure idempotency for completed simulations
        if (!progress.completedSimulations.includes(config.id)) {
          const allSkills = [
            ...(progress.skills?.map(s => s.name) || []),
            ...config.recommendedSkills.map(s => s.label)
          ]
          const uniqueSkills = Array.from(new Set(allSkills))

          updateProfile({
            readinessScore: Math.min(100, (progress.readinessScore || 0) + readinessImpact),
            completedSimulations: [...progress.completedSimulations, config.id],
            recommendedSkills: uniqueSkills
          })
        }
      }
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
            stepIndex={currentStepIndex}
            totalSteps={config.steps.length}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f]/90 via-[#090b16]/90 to-[#05060d]/90 p-5 backdrop-blur-xl sm:p-6 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {phase === "briefing" && (
                <motion.div
                  key="briefing"
                  {...contentMotion}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
                    <div>
                      <h2 className="text-lg font-semibold">Incident Briefing</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                        {config.briefingSummary}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {config.systemAlerts.map((alert) => (
                      <div
                        key={alert}
                        className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>

                  <TerminalLogPanel logs={config.briefingLogs} hasHydrated={hasHydrated} />

                  <Button
                    onClick={handleBriefingContinue}
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Enter Decision Phase
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {phase === "decision" && currentStep && (
                <motion.div
                  key={`decision-${currentStep.id}`}
                  {...contentMotion}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{currentStep.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                      {currentStep.incidentSummary}
                    </p>
                  </div>

                  <TerminalLogPanel logs={currentStep.logs} hasHydrated={hasHydrated} />

                  <div className="space-y-3">
                    {currentStep.choices.map((choice, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 text-sm font-medium text-foreground"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "feedback" && activeChoice && (
                <motion.div
                  key="feedback"
                  {...contentMotion}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <h2 className="text-lg font-semibold text-primary">AI Analysis</h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      {activeChoice.feedback}
                    </p>
                  </div>

                  <TerminalLogPanel logs={activeChoice.consequenceLogs} hasHydrated={hasHydrated} />

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                      Impact Score
                    </h3>
                    <p className={cn(
                      "mt-2 text-xl font-bold",
                      activeChoice.score === 100 ? "text-emerald-400" : activeChoice.score === 50 ? "text-amber-400" : "text-destructive"
                    )}>
                      {activeChoice.score}/100
                    </p>
                  </div>

                  <Button
                    onClick={handleFeedbackContinue}
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
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground/80">
                      Final Simulation Score
                    </p>
                    <p className="mt-2 font-[var(--font-syne)] text-5xl font-bold">
                      {finalScore}%
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80">
                        Readiness Impact
                      </p>
                      <p className="mt-1 text-xl font-bold text-primary">+{readinessImpact}</p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-500/80">
                        Operational Rating
                      </p>
                      <p className="mt-1 text-sm font-bold text-emerald-400">
                        {aiConfidence >= 80 && finalScore >= 80 ? "Elite Responder" : aiConfidence >= 50 && finalScore >= 50 ? "Adequate Mitigation" : "System Compromised"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80">
                        Strongest Area
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground truncate">
                        {config.recommendedSkills[0]?.label ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row pt-4">
                    <Button
                      asChild
                      className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetSimulation}
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

          <GuidanceSidebar hint={sidebarHint} aiConfidence={phase !== "evaluation" ? aiConfidence : undefined} />
        </div>
      </div>
    </div>
  )
}

export default function SimulationPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SimulationContent />
    </React.Suspense>
  )
}
