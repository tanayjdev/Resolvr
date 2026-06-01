import {
  DEFAULT_PROGRESS,
  type UserProgress,
} from "@/lib/types/user-state"

import type { CareerTrack } from "@/lib/personas/persona-config"

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"

export type WeeklyHours =
  | "2hrs"
  | "5hrs"
  | "10hrs+"

export interface UserProfile {
  careerGoal: string

  careerTrack: CareerTrack | null

  interests: string[]

  skillLevel: SkillLevel

  learningStyle: string

  weeklyHours: WeeklyHours

  onboardingComplete: boolean

  readinessScore: number

  completedSimulations: string[]

  recommendedSkills: string[]

  pathwayProgress: number
}

/** Profile fields stored separately from UserProgress to avoid duplicate state. */
export type ProfileOnlyState = Pick<
  UserProfile,
  | "careerGoal"
  | "careerTrack"
  | "skillLevel"
  | "learningStyle"
  | "weeklyHours"
  | "onboardingComplete"
  | "recommendedSkills"
  | "pathwayProgress"
>

export const DEFAULT_PROFILE_ONLY: ProfileOnlyState = {
  careerGoal: "",
  careerTrack: null,
  skillLevel: "Beginner",
  learningStyle: "",
  weeklyHours: "2hrs",
  onboardingComplete: false,
  recommendedSkills: [],
  pathwayProgress: 0,
}

export function buildUserProfile(
  progress: UserProgress,
  profileOnly: ProfileOnlyState
): UserProfile {
  return {
    ...profileOnly,
    interests: progress.interests,
    readinessScore: progress.readinessScore,
    completedSimulations: progress.completedSimulations,
  }
}

export const DEFAULT_USER_PROFILE: UserProfile =
  buildUserProfile(
    DEFAULT_PROGRESS,
    DEFAULT_PROFILE_ONLY
  )
