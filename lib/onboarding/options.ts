import type { CareerPathway } from "@/lib/pathways/pathway-engine"

import type {
  SkillLevel,
  WeeklyHours,
} from "@/lib/types/user-profile"

export const CAREER_GOAL_OPTIONS = [
  "AI Engineer",
  "Data Scientist",
  "Backend Developer",
  "Cloud Engineer",
  "DevOps Engineer",
] as const

export type CareerGoalOption =
  (typeof CAREER_GOAL_OPTIONS)[number]

export const INTEREST_OPTIONS = [
  "Machine Learning",
  "System Design",
  "Cloud",
  "Cybersecurity",
  "Web Development",
  "Data Analytics",
] as const

export type InterestOption =
  (typeof INTEREST_OPTIONS)[number]

export const SKILL_LEVEL_OPTIONS: readonly SkillLevel[] =
  [
    "Beginner",
    "Intermediate",
    "Advanced",
  ]

export const LEARNING_STYLE_OPTIONS = [
  "Hands-on simulations",
  "Video learning",
  "Projects",
  "Mentorship",
] as const

export type LearningStyleOption =
  (typeof LEARNING_STYLE_OPTIONS)[number]

export const WEEKLY_HOURS_OPTIONS: readonly WeeklyHours[] =
  ["2hrs", "5hrs", "10hrs+"]

export const ONBOARDING_STEP_COUNT = 5

export const ONBOARDING_STEP_LABELS = [
  "Career Goal",
  "Interests",
  "Skill Level",
  "Learning Style",
  "Weekly Commitment",
] as const

export function mapCareerGoalToPathway(
  careerGoal: string
): CareerPathway {
  const mapping: Record<
    string,
    CareerPathway
  > = {
    "AI Engineer":
      "Machine Learning",
    "Data Scientist":
      "Machine Learning",
    "Backend Developer":
      "Frontend Engineering",
    "Cloud Engineer":
      "Cloud Computing",
    "DevOps Engineer":
      "Cybersecurity",
  }

  return (
    mapping[careerGoal] ??
    "Machine Learning"
  )
}

export function getResumeStep(
  careerGoal: string,
  interestsCount: number,
  learningStyle: string,
  onboardingComplete: boolean
): number {
  if (!careerGoal) {
    return 1
  }

  if (interestsCount === 0) {
    return 2
  }

  if (!learningStyle) {
    return 4
  }

  if (!onboardingComplete) {
    return 5
  }

  return 5
}
