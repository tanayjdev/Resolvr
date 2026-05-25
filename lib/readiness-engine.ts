import type { SkillLevel } from "@/lib/types/user-profile"

export interface ReadinessInput {
  skillLevel: SkillLevel

  completedSimulations: string[]

  pathwayProgress: number

  onboardingComplete: boolean

  recommendedSkills: string[]

  interests: string[]
}

const SKILL_BASELINE: Record<
  SkillLevel,
  number
> = {
  Beginner: 20,
  Intermediate: 45,
  Advanced: 65,
}

function countSkillAlignment(
  interests: string[],
  recommendedSkills: string[]
): number {
  return interests.filter((interest) =>
    recommendedSkills.some(
      (skill) =>
        skill
          .toLowerCase()
          .includes(
            interest.toLowerCase()
          ) ||
        interest
          .toLowerCase()
          .includes(
            skill.toLowerCase()
          )
    )
  ).length
}

export function computeReadinessScore(
  input: ReadinessInput
): number {
  let score =
    SKILL_BASELINE[input.skillLevel]

  score +=
    input.completedSimulations.length *
    8

  if (input.onboardingComplete) {
    score += 5
  }

  score +=
    Math.floor(
      input.pathwayProgress / 10
    ) * 2

  score +=
    countSkillAlignment(
      input.interests,
      input.recommendedSkills
    ) * 2

  return Math.min(
    100,
    Math.max(0, score)
  )
}
