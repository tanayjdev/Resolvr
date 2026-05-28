// ============================================================
// lib/simulation/ai-feedback-engine.ts
// Dynamic AI feedback utilities for Resolvr
// ============================================================

import type { AIFeedback, FeedbackType, IncidentSnapshot, SimulationStep } from "./types"

// ─── ID generator ─────────────────────────────────────────────────────────────

let feedbackCounter = 100

function nextId(): string {
  return `fb-${++feedbackCounter}`
}

function makeFeedback(
  type: FeedbackType,
  message: string
): AIFeedback {
  return { id: nextId(), type, message, createdAt: Date.now() }
}

// ─── Command-reactive feedback ────────────────────────────────────────────────

/**
 * Generates contextual AI feedback in response to a terminal command result.
 * Returns undefined if no interesting feedback should be shown.
 */
export function feedbackFromCommand(
  commandText: string,
  isRelevant: boolean,
  scoreDelta: number,
  incidentSnapshot: IncidentSnapshot
): AIFeedback | undefined {
  const cmd = commandText.trim().toLowerCase()

  // Rewarded commands
  if (scoreDelta >= 20) {
    if (cmd.includes("journalctl")) {
      return makeFeedback(
        "correct",
        "Excellent — journalctl reveals the CNI plugin failure root cause directly. You're drilling in the right direction."
      )
    }
    if (cmd.includes("describe node")) {
      return makeFeedback(
        "correct",
        "Node describe output confirms NetworkUnavailable=True. This is strong evidence of a CNI-level or AZ networking failure."
      )
    }
    if (cmd.includes("drain")) {
      return makeFeedback(
        "correct",
        "Draining affected nodes before remediation prevents new pod scheduling onto broken infrastructure. Solid procedure."
      )
    }
    if (cmd.includes("get events")) {
      return makeFeedback(
        "correct",
        "Cluster events timeline shows simultaneous failure across all east-1 nodes — this is almost certainly an AZ-level event, not an individual node issue."
      )
    }
    if (cmd.includes("logs")) {
      return makeFeedback(
        "correct",
        "Pod logs confirm kube-proxy is failing due to CNI initialization. The networking fabric is broken at the node level."
      )
    }
  }

  // Penalised commands
  if (scoreDelta < 0) {
    if (cmd.includes("systemctl stop")) {
      return makeFeedback(
        "warning",
        "Stopping kubelet without a recovery path will prevent pod scheduling on this node entirely. Always have a rollback plan."
      )
    }
    if (cmd.split(" ")[0] === "rm" || cmd.includes("delete")) {
      return makeFeedback(
        "warning",
        "Destructive operations during an active incident require explicit approval. Document your intent first."
      )
    }
    return makeFeedback(
      "warning",
      `Command "${cmd.split(" ")[0]}" is not contributing to diagnosis. Focus on kubectl, systemctl, or journalctl for this incident type.`
    )
  }

  // Escalation context hints
  if (incidentSnapshot.escalationLevel >= 2) {
    return makeFeedback(
      "hint",
      "Incident is escalating — prioritise draining affected nodes and verifying CNI plugin status before the SLA window closes."
    )
  }

  return undefined
}

// ─── Step-change feedback ─────────────────────────────────────────────────────

export function feedbackForStepChange(
  from: SimulationStep,
  to: SimulationStep
): AIFeedback {
  const messages: Record<SimulationStep, string> = {
    identify: "Identification phase begins. Use kubectl get nodes and cluster events to locate the blast radius.",
    diagnose: "Diagnosis phase. Drill into node describe, kubelet logs, and journalctl to confirm root cause.",
    resolve: "Resolution phase. Drain affected nodes, apply CNI fix, and verify pod recovery before moving on.",
    document: "Documentation phase. Write a clear timeline, root-cause statement, and remediation steps for the post-mortem.",
  }

  return makeFeedback("hint", messages[to])
}

// ─── Escalation feedback ──────────────────────────────────────────────────────

export function feedbackForEscalation(
  escalationLevel: IncidentSnapshot["escalationLevel"]
): AIFeedback {
  const messages: Record<number, string> = {
    1: "L1 Escalation: Database connections exhausted. Check if restarting the connection pool can buy time.",
    2: "L2 Escalation: Cross-region failover is saturated. You need to restore east-1 nodes — failover is not sustainable.",
    3: "L3 Escalation: SLA breach imminent. Escalate to cloud provider for AZ-level network restore and cordon all affected nodes NOW.",
  }

  return makeFeedback(
    "warning",
    messages[escalationLevel] ?? `Escalation level ${escalationLevel} reached — take immediate action.`
  )
}

// ─── Recovery feedback ────────────────────────────────────────────────────────

export function feedbackForRecovery(
  recoveredServices: number,
  total: number
): AIFeedback {
  const pct = Math.round((recoveredServices / total) * 100)

  if (pct >= 100) {
    return makeFeedback(
      "correct",
      "All services recovered. Excellent work — complete your documentation and submit for full score."
    )
  }
  if (pct >= 50) {
    return makeFeedback(
      "correct",
      `${pct}% of services restored. Continue draining affected nodes and monitor pod scheduling recovery.`
    )
  }
  return makeFeedback(
    "hint",
    `Only ${pct}% of services recovered. Focus on CNI re-initialization on east-1 nodes to unlock full recovery.`
  )
}

// ─── Confidence calculation ───────────────────────────────────────────────────

/**
 * Returns a 0–100 confidence score based on what the operator has done.
 */
export function calculateConfidence(
  relevantCommands: number,
  hintsUsed: number,
  currentStep: SimulationStep
): number {
  const stepBase: Record<SimulationStep, number> = {
    identify: 20,
    diagnose: 45,
    resolve: 70,
    document: 90,
  }

  const base = stepBase[currentStep]
  const commandBoost = Math.min(relevantCommands * 3, 20)
  const hintPenalty = hintsUsed * 4

  return Math.min(100, Math.max(0, base + commandBoost - hintPenalty))
}

// ─── Hint bank ────────────────────────────────────────────────────────────────

export const HINT_BANK: Record<SimulationStep, string[]> = {
  identify: [
    "Run kubectl get nodes to confirm which nodes are NotReady.",
    "Use kubectl get events --sort-by=.metadata.creationTimestamp for a timeline.",
    "Check whether the failures are isolated to a single AZ.",
  ],
  diagnose: [
    "Run journalctl -u kubelet to inspect CNI initialization errors.",
    "kubectl describe node <name> will show the NetworkUnavailable condition.",
    "Check if /etc/cni/net.d is empty on the affected nodes — that's the root cause.",
  ],
  resolve: [
    "Cordon affected nodes before draining to prevent new pod scheduling.",
    "Reinitialize the CNI plugin: kubectl apply -f <cni-manifest>.",
    "After CNI restore, watch pod recovery with kubectl get pods -A -w.",
  ],
  document: [
    "Include a 5-whys root cause analysis in your post-mortem.",
    "Document the detection time, impact window, and MTTR.",
    "Add runbook steps for CNI initialization failure to prevent recurrence.",
  ],
}

export function getHintForStep(
  step: SimulationStep,
  hintsUsed: number
): AIFeedback {
  const hints = HINT_BANK[step]
  const hint = hints[hintsUsed % hints.length]
  return makeFeedback("hint", hint)
}
