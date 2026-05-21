import type { SimulationStep } from "./types"

// ============================================================
// Types
// ============================================================

interface EvaluationResult {
  scoreDelta: number

  confidence: number

  feedback: string

  nextStep?: SimulationStep

  resolved: boolean

  detectedConcepts: string[]

  severity:
    | "low"
    | "medium"
    | "high"

  progressionUpdate: {
    readinessIncrease: number

    employabilityIncrease: number
  }
}

// ============================================================
// Weighted Concepts
// ============================================================

const KEYWORD_WEIGHTS: Record<
  string,
  number
> = {
  cni: 14,

  network: 10,

  "network isolation": 16,

  kube_proxy: 14,

  "kube-proxy": 14,

  latency: 10,

  failover: 16,

  node: 8,

  cluster: 10,

  kubelet: 14,

  restart: 6,

  connectivity: 12,

  crashloopbackoff: 18,

  dns: 12,

  "packet loss": 14,

  gateway: 10,

  timeout: 10,

  cloudwatch: 12,

  "service mesh": 16,

  monitoring: 8,

  logs: 6,

  observability: 14,

  scaling: 10,

  kubernetes: 12,
}

// ============================================================
// Resolution Keywords
// ============================================================

const RESOLUTION_KEYWORDS = [
  "resolved",

  "fixed",

  "restored",

  "recovered",

  "mitigated",

  "stabilized",

  "healthy",

  "running",

  "connectivity restored",

  "cluster recovered",

  "incident resolved",

  "services restored",
]

// ============================================================
// Utility
// ============================================================

function normalizeText(
  text: string
) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// ============================================================
// Main Evaluator
// ============================================================

export function evaluateIncidentResponse(
  response: string
): EvaluationResult {
  const normalized =
    normalizeText(response)

  let scoreDelta = 0

  let confidence = 35

  const detectedConcepts =
    new Set<string>()

  // ==========================================================
  // Keyword Detection
  // ==========================================================

  Object.entries(
    KEYWORD_WEIGHTS
  ).forEach(
    ([keyword, weight]) => {
      if (
        normalized.includes(
          keyword
        )
      ) {
        detectedConcepts.add(
          keyword
        )

        scoreDelta += weight

        confidence += Math.min(
          8,
          Math.floor(
            weight / 2
          )
        )
      }
    }
  )

  // ==========================================================
  // Resolution Detection
  // ==========================================================

  const resolved =
    RESOLUTION_KEYWORDS.some(
      (keyword) =>
        normalized.includes(
          keyword
        )
    )

  if (resolved) {
    scoreDelta += 35

    confidence += 15
  }

  // ==========================================================
  // Length Bonus
  // ==========================================================

  const wordCount =
    normalized
      .split(" ")
      .filter(Boolean).length

  if (wordCount > 80) {
    scoreDelta += 12
    confidence += 6
  }

  if (wordCount > 140) {
    scoreDelta += 10
    confidence += 4
  }

  // ==========================================================
  // Severity
  // ==========================================================

  let severity:
    | "low"
    | "medium"
    | "high" = "low"

  if (
    detectedConcepts.size >= 4
  ) {
    severity = "medium"
  }

  if (
    detectedConcepts.size >= 7
  ) {
    severity = "high"
  }

  // ==========================================================
  // AI Feedback
  // ==========================================================

  let feedback = ""

  if (
    detectedConcepts.size >= 8 &&
    resolved
  ) {
    feedback =
      "Exceptional infrastructure diagnosis. Your response demonstrated strong incident analysis, Kubernetes networking awareness, and production recovery strategy."

  } else if (
    detectedConcepts.size >= 5
  ) {
    feedback =
      "Strong investigation path detected. You identified several critical infrastructure components and recovery indicators correctly."

  } else if (
    detectedConcepts.size >= 3
  ) {
    feedback =
      "Good foundational analysis. Continue validating cluster networking, node health, and failover recovery paths."

  } else {
    feedback =
      "Limited infrastructure analysis detected. Investigate Kubernetes networking, kube-system services, node communication, and cluster recovery indicators more deeply."
  }

  // ==========================================================
  // Next Step Logic
  // ==========================================================

  let nextStep:
    | SimulationStep
    | undefined

  if (
    detectedConcepts.size >= 2
  ) {
    nextStep = "resolve"
  }

  if (resolved) {
    nextStep = "document"
  }

  // ==========================================================
  // Final Clamp
  // ==========================================================

  scoreDelta = Math.min(
    scoreDelta,
    150
  )

  confidence = Math.min(
    confidence,
    100
  )

  // ==========================================================
  // Progression Updates
  // ==========================================================

  const readinessIncrease =
    Math.max(
      2,
      Math.floor(
        scoreDelta / 18
      )
    )

  const employabilityIncrease =
    resolved
      ? 3
      : detectedConcepts.size >= 5
        ? 2
        : 1

  // ==========================================================
  // Return
  // ==========================================================

  return {
    scoreDelta,

    confidence,

    feedback,

    nextStep,

    resolved,

    severity,

    detectedConcepts:
      Array.from(
        detectedConcepts
      ),

    progressionUpdate: {
      readinessIncrease,

      employabilityIncrease,
    },
  }
}