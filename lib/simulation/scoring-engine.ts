// ============================================================
// lib/simulation/scoring-engine.ts
// Dynamic readiness scoring for PathWeaver simulations
// ============================================================

import type { ScoreState, ScoringEvent, SimulationStep } from "./types"

// ─── Constants ────────────────────────────────────────────────────────────────

export const SCORE_CONFIG = {
  initial: 620,
  max: 1000,
  min: 0,

  // Per-event deltas (overridable by caller)
  stepCompleted: 50,
  stepSkipped: -30,
  hintPenalty: -10,
  timeBonusPerMinute: 2,
  escalationHandled: 40,
  escalationMissed: -25,
} as const

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createScoreState(initial = SCORE_CONFIG.initial): ScoreState {
  return {
    current: initial,
    max: SCORE_CONFIG.max,
    events: [],
    hintsUsed: 0,
    commandsExecuted: 0,
    relevantCommands: 0,
  }
}

// ─── Mutation helpers (return new state — pure) ───────────────────────────────

export function applyCommandScore(
  state: ScoreState,
  delta: number,
  isRelevant: boolean,
  commandText: string
): ScoreState {
  const type = isRelevant
    ? delta >= 0
      ? "relevant_command"
      : "incorrect_command"
    : delta < 0
    ? "irrelevant_command"
    : "relevant_command"

  const event: ScoringEvent = {
    type,
    delta,
    reason: commandText,
    timestamp: Date.now(),
  }

  const newCurrent = clamp(state.current + delta)

  return {
    ...state,
    current: newCurrent,
    events: [...state.events, event],
    commandsExecuted: state.commandsExecuted + 1,
    relevantCommands: state.relevantCommands + (isRelevant ? 1 : 0),
  }
}

export function applyStepCompletion(
  state: ScoreState,
  step: SimulationStep
): ScoreState {
  const event: ScoringEvent = {
    type: "step_completed",
    delta: SCORE_CONFIG.stepCompleted,
    reason: `Completed step: ${step}`,
    timestamp: Date.now(),
  }

  return {
    ...state,
    current: clamp(state.current + SCORE_CONFIG.stepCompleted),
    events: [...state.events, event],
  }
}

export function applyHintPenalty(state: ScoreState): ScoreState {
  const delta = SCORE_CONFIG.hintPenalty
  const event: ScoringEvent = {
    type: "hint_used",
    delta,
    reason: "Hint revealed",
    timestamp: Date.now(),
  }

  return {
    ...state,
    current: clamp(state.current + delta),
    hintsUsed: state.hintsUsed + 1,
    events: [...state.events, event],
  }
}

export function applyEscalationScore(
  state: ScoreState,
  handled: boolean
): ScoreState {
  const delta = handled
    ? SCORE_CONFIG.escalationHandled
    : SCORE_CONFIG.escalationMissed

  const event: ScoringEvent = {
    type: handled ? "escalation_handled" : "step_skipped",
    delta,
    reason: handled ? "Escalation event handled" : "Escalation event missed",
    timestamp: Date.now(),
  }

  return {
    ...state,
    current: clamp(state.current + delta),
    events: [...state.events, event],
  }
}

export function applyTimeBonus(
  state: ScoreState,
  minutesRemaining: number
): ScoreState {
  const delta = Math.floor(minutesRemaining * SCORE_CONFIG.timeBonusPerMinute)
  if (delta <= 0) return state

  const event: ScoringEvent = {
    type: "time_bonus",
    delta,
    reason: `Time bonus: ${minutesRemaining}min remaining`,
    timestamp: Date.now(),
  }

  return {
    ...state,
    current: clamp(state.current + delta),
    events: [...state.events, event],
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

/** 0–100 efficiency rating based on relevant vs total commands */
export function commandEfficiency(state: ScoreState): number {
  if (state.commandsExecuted === 0) return 100
  return Math.round((state.relevantCommands / state.commandsExecuted) * 100)
}

/** Human-readable readiness tier */
export function readinessTier(
  score: number
): "Novice" | "Developing" | "Proficient" | "Expert" | "Elite" {
  if (score >= 900) return "Elite"
  if (score >= 750) return "Expert"
  if (score >= 550) return "Proficient"
  if (score >= 350) return "Developing"
  return "Novice"
}

/** Points that would be added to the career readiness score on completion */
export function simulationReadinessImpact(state: ScoreState): number {
  const base = 18
  const efficiency = commandEfficiency(state)
  const hintMod = Math.max(0, 5 - state.hintsUsed * 2)
  return Math.round(base * (efficiency / 100) + hintMod)
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function clamp(value: number): number {
  return Math.min(SCORE_CONFIG.max, Math.max(SCORE_CONFIG.min, value))
}
