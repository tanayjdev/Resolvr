"use client"

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"

// ── Components ─────────────────────────────────────────────
import { SimulationHeader } from "@/components/simulation/simulation-header"
import { IncidentPanel } from "@/components/simulation/incident-panel"
import { LogsPanel } from "@/components/simulation/logs-panel"
import { TerminalPanel } from "@/components/simulation/terminal-panel"
import { ResponsePanel } from "@/components/simulation/response-panel"
import { AIFeedbackPanel } from "@/components/simulation/ai-feedback-panel"
import { ProgressTracker } from "@/components/simulation/progress-tracker"
import { ReadinessWidget } from "@/components/simulation/readiness-widget"
import { MobileTabNav } from "@/components/simulation/mobile-tab-nav"

// ── Context ────────────────────────────────────────────────
import { useUserProgress } from "@/context/user-context"

// ── Engines ────────────────────────────────────────────────
import {
  SEED_LOGS,
  SEED_FEEDBACK,
  SEED_INCIDENT,
} from "@/lib/simulation/mock-data"

import {
  createScoreState,
  applyCommandScore,
  applyHintPenalty,
  simulationReadinessImpact,
} from "@/lib/simulation/scoring-engine"

import {
  tickIncident,
  getEscalationAt,
  nextLiveLog,
  SIMULATION_DURATION_SECONDS,
} from "@/lib/simulation/incident-engine"

import {
  feedbackFromCommand,
  feedbackForEscalation,
  calculateConfidence,
} from "@/lib/simulation/ai-feedback-engine"

import {
  evaluateIncidentResponse,
} from "@/lib/simulation/response-evaluator"

// ── Types ──────────────────────────────────────────────────
import type {
  LogEntry,
  AIFeedback,
  SimulationStep,
  MobileTab,
  IncidentSnapshot,
  CommandResult,
} from "@/lib/simulation/types"

export default function SimulationPage() {
  // ── User Progress ───────────────────────────────────────
  const {
    increaseReadiness,
    completeSimulation,
  } = useUserProgress()

  // ── Timer ───────────────────────────────────────────────
  const [timeRemaining, setTimeRemaining] =
    useState(SIMULATION_DURATION_SECONDS)

  // ── Score ───────────────────────────────────────────────
  const [scoreState, setScoreState] =
    useState(createScoreState())

  // ── Simulation State ────────────────────────────────────
  const [currentStep, setCurrentStep] =
    useState<SimulationStep>("diagnose")

  const [showHints, setShowHints] =
    useState(true)

  const [mobileTab, setMobileTab] =
    useState<MobileTab>("logs")

  const [simulationComplete, setSimulationComplete] =
    useState(false)

  // ── Data ────────────────────────────────────────────────
  const [logs, setLogs] =
    useState<LogEntry[]>(SEED_LOGS)

  const [feedback, setFeedback] =
    useState<AIFeedback[]>(SEED_FEEDBACK)

  const [incidentSnapshot, setIncidentSnapshot] =
    useState<IncidentSnapshot>(
      SEED_INCIDENT
    )

  // ── Internal Refs ───────────────────────────────────────
  const elapsedRef = useRef(0)

  const completionHandledRef =
    useRef(false)

  // ── Helpers ─────────────────────────────────────────────

  const appendLog = useCallback(
    (
      partial: Omit<
        LogEntry,
        "id" | "timestamp"
      >
    ) => {
      const entry: LogEntry = {
        id: crypto.randomUUID(),

        timestamp:
          new Date().toLocaleTimeString(
            "en-US",
            {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          ),

        isNew: true,
        ...partial,
      }

      setLogs((prev) => [
        ...prev.slice(-49),
        entry,
      ])
    },
    []
  )

  const appendFeedback = useCallback(
    (
      item: Omit<
        AIFeedback,
        "id"
      >
    ) => {
      const entry: AIFeedback = {
        id: crypto.randomUUID(),
        ...item,
      }

      setFeedback((prev) => [
        ...prev.slice(-19),
        entry,
      ])
    },
    []
  )

  // ── Timer Countdown ─────────────────────────────────────

  useEffect(() => {
    if (simulationComplete) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) =>
        Math.max(0, prev - 1)
      )

      elapsedRef.current += 1
    }, 1000)

    return () => clearInterval(timer)
  }, [simulationComplete])

  // ── Live Logs ───────────────────────────────────────────

  useEffect(() => {
    if (simulationComplete) return

    const interval = setInterval(() => {
      const log =
        nextLiveLog(incidentSnapshot)

      appendLog(log)
    }, 12000)

    return () => clearInterval(interval)
  }, [
    incidentSnapshot,
    appendLog,
    simulationComplete,
  ])

  // ── Escalation Engine ───────────────────────────────────

  useEffect(() => {
    if (simulationComplete) return

    const interval = setInterval(() => {
      const elapsed =
        elapsedRef.current

      setIncidentSnapshot((prev) =>
        tickIncident(
          prev,
          elapsed,
          scoreState.relevantCommands
        )
      )

      const esc =
        getEscalationAt(elapsed)

      if (esc) {
        appendLog(esc.logMessage)

        appendFeedback(
          feedbackForEscalation(
            esc.escalationLevel
          )
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [
    scoreState.relevantCommands,
    appendLog,
    appendFeedback,
    simulationComplete,
  ])

  // ── Terminal Commands ───────────────────────────────────

  const handleCommandResult =
    useCallback(
      (
        raw: string,
        result: CommandResult
      ) => {
        setScoreState((prev) =>
          applyCommandScore(
            prev,
            result.scoreDelta,
            result.isRelevant,
            raw
          )
        )

        const aiFeedback =
          feedbackFromCommand(
            raw,
            result.isRelevant,
            result.scoreDelta,
            incidentSnapshot
          )

        const feedbackItem =
          result.feedback ??
          aiFeedback

        if (feedbackItem) {
          appendFeedback(feedbackItem)
        }
      },
      [
        incidentSnapshot,
        appendFeedback,
      ]
    )

  // ── Response Submission ─────────────────────────────────

  const handleResponseSubmit =
    useCallback(
      (text: string) => {
        if (
          simulationComplete ||
          completionHandledRef.current
        ) {
          return
        }

        const result =
          evaluateIncidentResponse(
            text
          )

        setScoreState((prev) =>
          applyCommandScore(
            prev,
            result.scoreDelta,
            true,
            "incident-response"
          )
        )

        appendFeedback({
          type: result.resolved
            ? "correct"
            : "warning",

          message: result.feedback,
        })

        if (result.nextStep) {
          setCurrentStep(
            result.nextStep
          )
        }

        if (result.resolved) {
          completionHandledRef.current =
            true

          increaseReadiness(23)

          completeSimulation()

          setSimulationComplete(true)

          appendLog({
            level: "success",

            message:
              "Incident resolved successfully. Services restored across cluster.",
          })
        }
      },
      [
        simulationComplete,
        appendFeedback,
        appendLog,
        increaseReadiness,
        completeSimulation,
      ]
    )

  // ── Hint Toggle ─────────────────────────────────────────

  const handleToggleHints =
    useCallback(() => {
      setShowHints((prev) => {
        if (!prev) {
          setScoreState((s) =>
            applyHintPenalty(s)
          )
        }

        return !prev
      })
    }, [])

  // ── Exit ────────────────────────────────────────────────

  const handleExit =
    useCallback(() => {
      console.log(
        "Exit simulation"
      )
    }, [])

  // ── Derived State ───────────────────────────────────────

  const confidence =
    calculateConfidence(
      scoreState.relevantCommands,
      scoreState.hintsUsed,
      currentStep
    )

  const readinessImpact =
    simulationReadinessImpact(
      scoreState
    )

  // ── Suggested Actions ───────────────────────────────────

  const handleSuggestedAction =
    useCallback(
      (action: string) => {
        appendFeedback({
          type: "correct",

          message: `Suggested action selected: ${action}`,
        })

        appendLog({
          level: "info",

          message: `AI-assisted action triggered → ${action}`,
        })
      },
      [appendFeedback, appendLog]
    )

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SimulationHeader
        timeRemaining={
          timeRemaining
        }
        readinessScore={
          scoreState.current
        }
        onExit={handleExit}
      />

      <main className="flex flex-1 flex-col gap-3 overflow-hidden p-3 lg:gap-4 lg:p-4">
        {/* Incident */}
        <IncidentPanel />

        {/* Desktop */}
        <div className="hidden min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-12">
          {/* Left */}
          <div className="col-span-4 flex min-h-0 flex-col gap-4">
            <LogsPanel
              logs={logs}
              className="flex-1"
            />

            <TerminalPanel
              className="flex-1"
              onCommandResult={
                handleCommandResult
              }
            />
          </div>

          {/* Center */}
          <div className="col-span-4 flex min-h-0 flex-col gap-4">
            <ResponsePanel
              className="flex-1"
              onSubmit={
                handleResponseSubmit
              }
            />
          </div>

          {/* Right */}
          <div className="col-span-4 flex min-h-0 flex-col gap-4">
            <AIFeedbackPanel
              feedback={feedback}
              showHints={showHints}
              onToggleHints={
                handleToggleHints
              }
              confidence={
                confidence
              }
              className="flex-1"
              onSuggestedAction={
                handleSuggestedAction
              }
            />
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden min-h-0 flex-1 gap-4 md:grid md:grid-cols-2 lg:hidden">
          <div className="flex min-h-0 flex-col gap-4">
            <LogsPanel
              logs={logs}
              className="flex-1"
            />

            <TerminalPanel
              className="flex-1"
              onCommandResult={
                handleCommandResult
              }
            />
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <ResponsePanel
              className="flex-1"
              onSubmit={
                handleResponseSubmit
              }
            />

            <AIFeedbackPanel
              feedback={feedback}
              showHints={showHints}
              onToggleHints={
                handleToggleHints
              }
              confidence={
                confidence
              }
              className="flex-1"
              onSuggestedAction={
                handleSuggestedAction
              }
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 md:hidden">
          <MobileTabNav
            activeTab={mobileTab}
            onTabChange={
              setMobileTab
            }
          />

          <div className="min-h-0 flex-1">
            {mobileTab ===
              "logs" && (
              <LogsPanel
                logs={logs}
                className="h-full"
              />
            )}

            {mobileTab ===
              "terminal" && (
              <TerminalPanel
                className="h-full"
                onCommandResult={
                  handleCommandResult
                }
              />
            )}

            {mobileTab ===
              "response" && (
              <ResponsePanel
                className="h-full"
                onSubmit={
                  handleResponseSubmit
                }
              />
            )}

            {mobileTab ===
              "ai" && (
              <AIFeedbackPanel
                feedback={feedback}
                showHints={
                  showHints
                }
                onToggleHints={
                  handleToggleHints
                }
                confidence={
                  confidence
                }
                className="h-full"
                onSuggestedAction={
                  handleSuggestedAction
                }
              />
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="shrink-0 flex flex-col gap-3 lg:flex-row lg:gap-4">
          <ProgressTracker
            currentStep={
              currentStep
            }
            className="flex-1"
          />

          <ReadinessWidget
            pointsToAdd={
              readinessImpact
            }
            progressFill={3}
            className="lg:w-80"
          />
        </div>
      </main>
    </div>
  )
}