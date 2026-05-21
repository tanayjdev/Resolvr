import {
  opportunities,
  type Opportunity,
} from "./opportunity-data"

// ============================================================
// Types
// ============================================================

export interface MatchOptions {
  readinessScore: number

  currentPathway: string

  simulationsCompleted?: number
}

// ============================================================
// Helpers
// ============================================================

function calculateReadinessBoost(
  readinessScore: number
) {
  if (readinessScore >= 900)
    return 18

  if (readinessScore >= 800)
    return 14

  if (readinessScore >= 700)
    return 10

  if (readinessScore >= 600)
    return 6

  return 0
}

function calculateSimulationBoost(
  simulationsCompleted: number
) {
  if (
    simulationsCompleted >= 8
  )
    return 12

  if (
    simulationsCompleted >= 5
  )
    return 8

  if (
    simulationsCompleted >= 3
  )
    return 5

  return 0
}

// ============================================================
// Main Engine
// ============================================================

export function getMatchedOpportunities({
  readinessScore,

  currentPathway,

  simulationsCompleted = 0,
}: MatchOptions): Opportunity[] {
  // ==========================================================
  // Base Filtering
  // ==========================================================

  const filtered =
    opportunities.filter(
      (opp) => {
        // Pathway Match
        const pathwayMatch =
          opp.pathway ===
          currentPathway

        // Readiness Gate
        const readinessMatch =
          readinessScore >=
          opp.minimumReadiness

        return (
          pathwayMatch &&
          readinessMatch
        )
      }
    )

  // ==========================================================
  // Adaptive Scoring
  // ==========================================================

  const ranked =
    filtered.map((opp) => {
      let dynamicScore =
        opp.matchScore

      // Readiness Influence
      dynamicScore +=
        calculateReadinessBoost(
          readinessScore
        )

      // Simulation Influence
      dynamicScore +=
        calculateSimulationBoost(
          simulationsCompleted
        )

      // Premium Opportunity Boost
      if (
        opp.type ===
        "fulltime"
      ) {
        dynamicScore += 4
      }

      // High Readiness Premium
      if (
        readinessScore >=
          850 &&
        opp.type ===
          "internship"
      ) {
        dynamicScore -= 3
      }

      // Clamp
      dynamicScore =
        Math.min(
          dynamicScore,
          99
        )

      return {
        ...opp,

        dynamicScore,
      }
    })

  // ==========================================================
  // Final Ranking
  // ==========================================================

  return ranked.sort(
    (a, b) =>
      b.dynamicScore -
      a.dynamicScore
  )
}