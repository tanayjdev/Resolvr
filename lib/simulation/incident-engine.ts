// ============================================================
// lib/simulation/incident-engine.ts
// Dynamic incident state, escalation, and recovery for Resolvr
// ============================================================

import type { IncidentSnapshot, LogEntry, LogLevel } from "./types"
import { ESCALATION_LOG_POOL, LIVE_LOG_POOL } from "./mock-data"

// ─── Escalation schedule (seconds from simulation start) ─────────────────────

interface EscalationEvent {
  at: number            // seconds elapsed since start
  description: string
  latencyDelta: number
  errorRateDelta: number
  servicesDelta: number
  escalationLevel: IncidentSnapshot["escalationLevel"]
  logMessage: Omit<LogEntry, "id" | "timestamp">
}

export const ESCALATION_SCHEDULE: EscalationEvent[] = [
  {
    at: 120,
    description: "Database connection pool exhausted",
    latencyDelta: 200,
    errorRateDelta: 8,
    servicesDelta: 3,
    escalationLevel: 1,
    logMessage: {
      level: "critical",
      message: "ESCALATION L1: Database connection pool exhausted (0/100 connections available)",
    },
  },
  {
    at: 300,
    description: "Cross-region failover saturated",
    latencyDelta: 400,
    errorRateDelta: 12,
    servicesDelta: 4,
    escalationLevel: 2,
    logMessage: {
      level: "critical",
      message: "ESCALATION L2: Cross-region failover bandwidth saturated — us-west-2 overloaded",
    },
  },
  {
    at: 600,
    description: "SLA breach — 8 minutes remaining",
    latencyDelta: 100,
    errorRateDelta: 5,
    servicesDelta: 1,
    escalationLevel: 3,
    logMessage: {
      level: "critical",
      message: "ESCALATION L3: SLA breach imminent — customer-facing APIs at 92% error rate",
    },
  },
]

// ─── State transitions ────────────────────────────────────────────────────────

/**
 * Returns a new IncidentSnapshot based on elapsed time and actions taken.
 * Pure function — does not mutate the passed snapshot.
 */
export function tickIncident(
  snapshot: IncidentSnapshot,
  elapsedSeconds: number,
  relevantCommandsExecuted: number
): IncidentSnapshot {
  let updated = { ...snapshot }

  // Apply any due escalations
  for (const evt of ESCALATION_SCHEDULE) {
    if (
      elapsedSeconds >= evt.at &&
      updated.escalationLevel < evt.escalationLevel
    ) {
      updated = {
        ...updated,
        state: "escalating",
        latencyMs: Math.min(updated.latencyMs + evt.latencyDelta, 5000),
        errorRatePercent: Math.min(updated.errorRatePercent + evt.errorRateDelta, 99),
        affectedServices: Math.min(updated.affectedServices + evt.servicesDelta, 20),
        escalationLevel: evt.escalationLevel,
      }
    }
  }

  // Recovery based on relevant debugging actions
  if (relevantCommandsExecuted >= 5) {
    updated = {
      ...updated,
      state: "stabilizing",
      latencyMs: Math.max(updated.latencyMs - relevantCommandsExecuted * 20, 200),
      errorRatePercent: Math.max(updated.errorRatePercent - relevantCommandsExecuted * 2, 5),
      recoveredServices: Math.min(
        updated.recoveredServices + Math.floor(relevantCommandsExecuted / 3),
        updated.affectedServices
      ),
    }
  }

  if (relevantCommandsExecuted >= 10 && updated.recoveredServices >= updated.affectedServices - 2) {
    updated = { ...updated, state: "resolved" }
  }

  return updated
}

/**
 * Returns any escalation event that fires exactly at `elapsedSeconds`
 * (within a 1-second window).
 */
export function getEscalationAt(
  elapsedSeconds: number
): EscalationEvent | undefined {
  return ESCALATION_SCHEDULE.find(
    (e) => Math.abs(e.at - elapsedSeconds) <= 1
  )
}

// ─── Dynamic log generation ───────────────────────────────────────────────────

let liveLogIndex = 0
let escalationLogIndex = 0

/**
 * Generate the next live log entry for periodic polling.
 * Cycles through the pool; returns escalation logs when escalation
 * level is elevated.
 */
export function nextLiveLog(
  snapshot: IncidentSnapshot,
  overrideLevel?: LogLevel
): Omit<LogEntry, "id" | "timestamp"> {
  if (snapshot.escalationLevel >= 2 && escalationLogIndex < ESCALATION_LOG_POOL.length) {
    const entry = ESCALATION_LOG_POOL[escalationLogIndex % ESCALATION_LOG_POOL.length]
    escalationLogIndex++
    return entry
  }

  const entry = LIVE_LOG_POOL[liveLogIndex % LIVE_LOG_POOL.length]
  liveLogIndex++
  return overrideLevel ? { ...entry, level: overrideLevel } : entry
}

/**
 * Generates the log entry for an escalation event.
 */
export function escalationLogEntry(
  event: EscalationEvent
): Omit<LogEntry, "id" | "timestamp"> {
  return event.logMessage
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function incidentStateLabel(snapshot: IncidentSnapshot): string {
  switch (snapshot.state) {
    case "active":
      return "Active Incident"
    case "escalating":
      return "Escalating"
    case "stabilizing":
      return "Stabilizing"
    case "resolved":
      return "Resolved"
  }
}

export function secondsElapsed(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000)
}

/** The total simulation duration in seconds */
export const SIMULATION_DURATION_SECONDS = 18 * 60 + 42
