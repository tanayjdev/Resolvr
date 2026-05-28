// ============================================================
// lib/simulation/types.ts
// Core TypeScript types for the Resolvr simulation engine
// ============================================================

export type LogLevel = "critical" | "warning" | "info" | "success"

export type SimulationStep = "identify" | "diagnose" | "resolve" | "document"

export type IncidentState = "active" | "escalating" | "stabilizing" | "resolved"

export type FeedbackType = "correct" | "warning" | "hint"

export type CommandCategory =
  | "kubectl"
  | "systemctl"
  | "network"
  | "journalctl"
  | "curl"
  | "unknown"

// ─── Log ──────────────────────────────────────────────────────────────────────

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  message: string
  isNew?: boolean
}

// ─── AI Feedback ──────────────────────────────────────────────────────────────

export interface AIFeedback {
  id: string
  type: FeedbackType
  message: string
  /** ISO timestamp so feedback can be sorted/aged */
  createdAt?: number
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

export interface TerminalHistoryLine {
  text: string
  /** If true, render with the blinking cursor appended */
  isPrompt?: boolean
  /** Colour hint for the renderer */
  variant?: "default" | "primary" | "success" | "error" | "muted"
}

export interface ParsedCommand {
  raw: string
  category: CommandCategory
  /** Primary verb / sub-command e.g. "get", "describe", "status" */
  sub: string
  /** Positional args after sub-command */
  args: string[]
  /** Flags such as -f, --follow, -n namespace */
  flags: Record<string, string | boolean>
}

export interface CommandResult {
  lines: TerminalHistoryLine[]
  /** Score delta applied by this command (positive = good, negative = bad) */
  scoreDelta: number
  /** True if this command counts as a meaningful debugging action */
  isRelevant: boolean
  /** Optional feedback generated as a result of the command */
  feedback?: Omit<AIFeedback, "id">
}

// ─── Incident ─────────────────────────────────────────────────────────────────

export interface NodeStatus {
  name: string
  status: "Ready" | "NotReady" | "SchedulingDisabled"
  role: string
  age: string
  version: string
}

export interface IncidentSnapshot {
  state: IncidentState
  affectedNodes: NodeStatus[]
  latencyMs: number
  errorRatePercent: number
  affectedServices: number
  retriesPerSec: number
  circuitBreakersOpen: string[]
  recoveredServices: number
  escalationLevel: 0 | 1 | 2 | 3
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoringEvent {
  type:
  | "relevant_command"
  | "irrelevant_command"
  | "incorrect_command"
  | "step_completed"
  | "step_skipped"
  | "hint_used"
  | "escalation_handled"
  | "time_bonus"
  delta: number
  reason: string
  timestamp: number
}

export interface ScoreState {
  current: number
  max: number
  events: ScoringEvent[]
  hintsUsed: number
  commandsExecuted: number
  relevantCommands: number
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export interface SimulationState {
  timeRemaining: number
  score: ScoreState
  currentStep: SimulationStep
  incidentSnapshot: IncidentSnapshot
  logs: LogEntry[]
  feedback: AIFeedback[]
  terminalHistory: TerminalHistoryLine[]
  showHints: boolean
  mobileTab: MobileTab
}

export type MobileTab = "logs" | "terminal" | "response" | "ai"

// ─── Progress Step ────────────────────────────────────────────────────────────

export interface ProgressStep {
  id: SimulationStep
  label: string
  number: number
}