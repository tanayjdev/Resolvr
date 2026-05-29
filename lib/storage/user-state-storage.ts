import {
  buildUserProfile,
  DEFAULT_PROFILE_ONLY,
  type ProfileOnlyState,
  type SkillLevel,
  type WeeklyHours,
} from "@/lib/types/user-profile"

import type { CareerPathway } from "@/lib/pathways/pathway-engine"

import {
  DEFAULT_PROGRESS,
  type Opportunity,
  type Skill,
  type UserProgress,
} from "@/lib/types/user-state"

import type { SimulationMemory } from "@/lib/ai/scoring-engine"
import type { SimulationRunState } from "@/lib/types/user-state"

export const USER_STATE_STORAGE_KEY =
  "resolvr-progress"

export interface PersistedUserState {
  progress: UserProgress
  profileOnly: ProfileOnlyState
}

const SKILL_LEVELS: readonly SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
]

const WEEKLY_HOURS: readonly WeeklyHours[] = [
  "2hrs",
  "5hrs",
  "10hrs+",
]

const CAREER_PATHWAYS: readonly CareerPathway[] = [
  "Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "Frontend Engineering",
]

function isCareerPathway(
  value: unknown
): value is CareerPathway {
  return (
    typeof value === "string" &&
    CAREER_PATHWAYS.includes(
      value as CareerPathway
    )
  )
}

function isSkill(value: unknown): value is Skill {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.level === "number" &&
    Number.isFinite(value.level)
  )
}

function isOpportunity(
  value: unknown
): value is Opportunity {
  return (
    isRecord(value) &&
    typeof value.company === "string" &&
    typeof value.role === "string" &&
    typeof value.match === "number" &&
    Number.isFinite(value.match)
  )
}

function parseSkills(value: unknown): Skill[] {
  if (!Array.isArray(value)) {
    return DEFAULT_PROGRESS.skills
  }

  const skills = value.filter(isSkill)

  return skills.length > 0
    ? skills
    : DEFAULT_PROGRESS.skills
}

function parseOpportunities(
  value: unknown
): Opportunity[] {
  if (!Array.isArray(value)) {
    return DEFAULT_PROGRESS.opportunities
  }

  const opportunities = value.filter(
    isOpportunity
  )

  return opportunities.length > 0
    ? opportunities
    : DEFAULT_PROGRESS.opportunities
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function isStringArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  )
}

function isSkillLevel(
  value: unknown
): value is SkillLevel {
  return (
    typeof value === "string" &&
    SKILL_LEVELS.includes(value as SkillLevel)
  )
}

function isWeeklyHours(
  value: unknown
): value is WeeklyHours {
  return (
    typeof value === "string" &&
    WEEKLY_HOURS.includes(value as WeeklyHours)
  )
}

function parseProfileOnly(
  value: unknown
): ProfileOnlyState {
  if (!isRecord(value)) {
    return DEFAULT_PROFILE_ONLY
  }

  return {
    careerGoal:
      typeof value.careerGoal === "string"
        ? value.careerGoal
        : DEFAULT_PROFILE_ONLY.careerGoal,

    skillLevel: isSkillLevel(value.skillLevel)
      ? value.skillLevel
      : DEFAULT_PROFILE_ONLY.skillLevel,

    learningStyle:
      typeof value.learningStyle === "string"
        ? value.learningStyle
        : DEFAULT_PROFILE_ONLY.learningStyle,

    weeklyHours: isWeeklyHours(value.weeklyHours)
      ? value.weeklyHours
      : DEFAULT_PROFILE_ONLY.weeklyHours,

    onboardingComplete:
      typeof value.onboardingComplete === "boolean"
        ? value.onboardingComplete
        : DEFAULT_PROFILE_ONLY.onboardingComplete,

    recommendedSkills: isStringArray(
      value.recommendedSkills
    )
      ? value.recommendedSkills
      : DEFAULT_PROFILE_ONLY.recommendedSkills,

    pathwayProgress:
      typeof value.pathwayProgress === "number" &&
        Number.isFinite(value.pathwayProgress)
        ? value.pathwayProgress
        : DEFAULT_PROFILE_ONLY.pathwayProgress,
  }
}

function parseUserProgress(
  value: unknown
): UserProgress {
  if (!isRecord(value)) {
    return DEFAULT_PROGRESS
  }

  return {
    readinessScore:
      typeof value.readinessScore === "number"
        ? value.readinessScore
        : DEFAULT_PROGRESS.readinessScore,

    simulationsCompleted:
      typeof value.simulationsCompleted ===
        "number"
        ? value.simulationsCompleted
        : DEFAULT_PROGRESS.simulationsCompleted,

    employabilityScore:
      typeof value.employabilityScore ===
        "number"
        ? value.employabilityScore
        : DEFAULT_PROGRESS.employabilityScore,

    skillsTracked:
      typeof value.skillsTracked === "number"
        ? value.skillsTracked
        : DEFAULT_PROGRESS.skillsTracked,

    opportunitiesMatched:
      typeof value.opportunitiesMatched ===
        "number"
        ? value.opportunitiesMatched
        : DEFAULT_PROGRESS.opportunitiesMatched,

    currentPathway: isCareerPathway(
      value.currentPathway
    )
      ? value.currentPathway
      : DEFAULT_PROGRESS.currentPathway,

    unlockedPathways: isStringArray(
      value.unlockedPathways
    )
      ? value.unlockedPathways
      : DEFAULT_PROGRESS.unlockedPathways,

    completedSimulations: isStringArray(
      value.completedSimulations
    )
      ? value.completedSimulations
      : DEFAULT_PROGRESS.completedSimulations,

    interests: isStringArray(value.interests)
      ? value.interests
      : DEFAULT_PROGRESS.interests,

    skills: parseSkills(value.skills),

    opportunities: parseOpportunities(
      value.opportunities
    ),

    lowDataMode:
      typeof value.lowDataMode === "boolean"
        ? value.lowDataMode
        : DEFAULT_PROGRESS.lowDataMode,

    // Connected Intelligence fields
    certificationsEarned:
      typeof value.certificationsEarned === "number"
        ? value.certificationsEarned
        : DEFAULT_PROGRESS.certificationsEarned,

    milestonesCompleted:
      typeof value.milestonesCompleted === "number"
        ? value.milestonesCompleted
        : DEFAULT_PROGRESS.milestonesCompleted,

    aiConfidence:
      typeof value.aiConfidence === "number"
        ? value.aiConfidence
        : DEFAULT_PROGRESS.aiConfidence,

    recommendationStrength:
      typeof value.recommendationStrength === "number"
        ? value.recommendationStrength
        : DEFAULT_PROGRESS.recommendationStrength,

    simulationPerformance:
      isRecord(value.simulationPerformance)
        ? value.simulationPerformance as Record<string, number>
        : DEFAULT_PROGRESS.simulationPerformance,

    simulationMemory: isRecord(value.simulationMemory)
      ? {
          totalSimulations: typeof value.simulationMemory.totalSimulations === 'number' ? value.simulationMemory.totalSimulations : DEFAULT_PROGRESS.simulationMemory.totalSimulations,
          averageScore: typeof value.simulationMemory.averageScore === 'number' ? value.simulationMemory.averageScore : DEFAULT_PROGRESS.simulationMemory.averageScore,
          strengths: isStringArray(value.simulationMemory.strengths) ? value.simulationMemory.strengths : DEFAULT_PROGRESS.simulationMemory.strengths,
          weaknesses: isStringArray(value.simulationMemory.weaknesses) ? value.simulationMemory.weaknesses : DEFAULT_PROGRESS.simulationMemory.weaknesses,
          riskProfile: (['conservative', 'balanced', 'aggressive'].includes(value.simulationMemory.riskProfile as any) ? value.simulationMemory.riskProfile : DEFAULT_PROGRESS.simulationMemory.riskProfile) as 'conservative' | 'balanced' | 'aggressive',
          pathwayAffinities: isRecord(value.simulationMemory.pathwayAffinities) ? value.simulationMemory.pathwayAffinities as Record<string, number> : DEFAULT_PROGRESS.simulationMemory.pathwayAffinities,
          lastSimulationId: typeof value.simulationMemory.lastSimulationId === 'string' ? value.simulationMemory.lastSimulationId : DEFAULT_PROGRESS.simulationMemory.lastSimulationId,
          lastSimulationScore: typeof value.simulationMemory.lastSimulationScore === 'number' ? value.simulationMemory.lastSimulationScore : DEFAULT_PROGRESS.simulationMemory.lastSimulationScore,
        }
      : DEFAULT_PROGRESS.simulationMemory,

    currentSimulationRun: null // Always reset on load - simulation state is transient
  }
}

function isLegacyProgressPayload(
  value: Record<string, unknown>
): boolean {
  return (
    typeof value.employabilityScore === "number" ||
    typeof value.currentPathway === "string"
  )
}

export function getDefaultPersistedState(): PersistedUserState {
  return {
    progress: DEFAULT_PROGRESS,
    profileOnly: DEFAULT_PROFILE_ONLY,
  }
}

export function parsePersistedUserState(
  raw: string | null
): PersistedUserState {
  if (!raw) {
    return getDefaultPersistedState()
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!isRecord(parsed)) {
      return getDefaultPersistedState()
    }

    if (
      isRecord(parsed.progress) &&
      (isRecord(parsed.profileOnly) ||
        isRecord(parsed.profile))
    ) {
      const profileSource = isRecord(
        parsed.profileOnly
      )
        ? parsed.profileOnly
        : parsed.profile

      return {
        progress: parseUserProgress(
          parsed.progress
        ),
        profileOnly: parseProfileOnly(
          profileSource
        ),
      }
    }

    if (isLegacyProgressPayload(parsed)) {
      const progress = parseUserProgress(parsed)

      return {
        progress,
        profileOnly: {
          ...DEFAULT_PROFILE_ONLY,
          recommendedSkills: progress.skills.map(
            (skill) => skill.name
          ),
        },
      }
    }

    return getDefaultPersistedState()
  } catch (error) {
    console.error(
      "Failed to parse persisted user state:",
      error
    )

    return getDefaultPersistedState()
  }
}

export function readPersistedUserState(): PersistedUserState {
  if (typeof window === "undefined") {
    return getDefaultPersistedState()
  }

  try {
    return parsePersistedUserState(
      localStorage.getItem(
        USER_STATE_STORAGE_KEY
      )
    )
  } catch (error) {
    console.error(
      "Failed to read persisted user state:",
      error
    )

    return getDefaultPersistedState()
  }
}

export function writePersistedUserState(
  state: PersistedUserState
): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const payload = {
      progress: state.progress,
      profileOnly: state.profileOnly,
      profile: buildUserProfile(
        state.progress,
        state.profileOnly
      ),
    }

    localStorage.setItem(
      USER_STATE_STORAGE_KEY,
      JSON.stringify(payload)
    )
  } catch (error) {
    console.error(
      "Failed to write persisted user state:",
      error
    )
  }
}
