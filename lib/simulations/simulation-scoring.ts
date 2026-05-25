import type {
  EngineeringEvaluation,
  PerformanceTier,
} from "@/lib/simulations/types"

export function calculateSimulationFinalScore(
  scores: readonly (0 | 50 | 100)[]
): number {
  if (scores.length === 0) {
    return 0
  }

  const total = scores.reduce<number>(
    (sum, score) => sum + score,
    0
  )

  return Math.round(total / scores.length)
}

export function getPerformanceTier(
  finalScore: number
): PerformanceTier {
  if (finalScore <= 40) {
    return {
      label: "Needs Improvement",
      toneClass: "text-amber-400",
    }
  }

  if (finalScore <= 70) {
    return {
      label: "Developing Engineer",
      toneClass: "text-primary",
    }
  }

  return {
    label: "Strong Performance",
    toneClass: "text-emerald-400",
  }
}

export function getEngineeringEvaluation(
  finalScore: number
): EngineeringEvaluation {
  if (finalScore <= 40) {
    return {
      summary:
        "Incident response showed gaps in prioritization and production safety controls.",
      nextSkill:
        "Improve incident prioritization",
    }
  }

  if (finalScore <= 70) {
    return {
      summary:
        "Solid debugging instincts with room to tighten rollback discipline and observability depth.",
      nextSkill:
        "Strengthen systems debugging ability",
    }
  }

  return {
    summary:
      "Excellent production reasoning with strong tradeoff analysis under pressure.",
    nextSkill:
      "Advance ML deployment reliability",
  }
}

export function getReadinessImpact(
  finalScore: number
): number {
  return Math.round(finalScore / 10)
}
