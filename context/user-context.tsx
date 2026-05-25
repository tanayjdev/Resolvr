"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import {
  buildUserProfile,
  DEFAULT_PROFILE_ONLY,
  type ProfileOnlyState,
  type UserProfile,
} from "@/lib/types/user-profile"

import {
  DEFAULT_PROGRESS,
  type Opportunity,
  type Skill,
  type UserProgress,
} from "@/lib/types/user-state"

import type { CareerPathway } from "@/lib/pathways/pathway-engine"

import {
  getDefaultPersistedState,
  readPersistedUserState,
  writePersistedUserState,
} from "@/lib/storage/user-state-storage"

// =========================================================
// Re-exports
// =========================================================

export type {
  Skill,
  Opportunity,
  UserProgress,
} from "@/lib/types/user-state"

export type {
  UserProfile,
  ProfileOnlyState,
  SkillLevel,
  WeeklyHours,
} from "@/lib/types/user-profile"

export {
  DEFAULT_USER_PROFILE,
  DEFAULT_PROFILE_ONLY,
  buildUserProfile,
} from "@/lib/types/user-profile"

export { DEFAULT_PROGRESS } from "@/lib/types/user-state"

// =========================================================
// Context
// =========================================================

interface UserContextType {
  progress: UserProgress

  profile: UserProfile

  hasHydrated: boolean

  increaseReadiness: (
    value: number
  ) => void

  completeSimulation: (
    simulationName: string
  ) => void

  setPathway: (
    pathway: CareerPathway
  ) => void

  unlockPathway: (
    pathway: string
  ) => void

  toggleLowDataMode: () => void

  addOpportunity: (
    opportunity: Opportunity
  ) => void

  addCompletedSimulation: (
    simulation: string
  ) => void

  updateProfile: (
    updates: Partial<UserProfile>
  ) => void

  completeOnboarding: () => void

  recordSimulationCompletion: (
    simulationId: string,
    finalScore: number
  ) => void

  resetProgress: () => void
}

const UserContext =
  createContext<UserContextType | null>(
    null
  )

// =========================================================
// Provider
// =========================================================

export function UserProvider({
  children,
}: {
  children: ReactNode
}) {
  const [progress, setProgress] =
    useState<UserProgress>(DEFAULT_PROGRESS)

  const [profileOnly, setProfileOnly] =
    useState<ProfileOnlyState>(
      DEFAULT_PROFILE_ONLY
    )

  const [hasHydrated, setHasHydrated] =
    useState(false)

  const profile = useMemo(
    () =>
      buildUserProfile(
        progress,
        profileOnly
      ),
    [progress, profileOnly]
  )

  useEffect(() => {
    const persisted =
      readPersistedUserState()

    setProgress(persisted.progress)
    setProfileOnly(
      persisted.profileOnly
    )
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    writePersistedUserState({
      progress,
      profileOnly,
    })
  }, [progress, profileOnly, hasHydrated])

  const increaseReadiness = (
    value: number
  ) => {
    setProgress((prev) => ({
      ...prev,

      readinessScore: Math.min(
        prev.readinessScore + value,
        1000
      ),
    }))
  }

  const completeSimulation =
    (
      simulationName: string
    ) => {
      setProgress((prev) => ({
        ...prev,

        simulationsCompleted:
          prev.simulationsCompleted +
          1,

        employabilityScore:
          Math.min(
            prev.employabilityScore +
              2,
            100
          ),

        opportunitiesMatched:
          prev.opportunitiesMatched +
          1,

        readinessScore:
          Math.min(
            prev.readinessScore +
              25,
            1000
          ),

        completedSimulations: [
          ...prev.completedSimulations,
          simulationName,
        ],
      }))
    }

  const setPathway = (
    pathway: CareerPathway
  ) => {
    setProgress((prev) => ({
      ...prev,

      currentPathway:
        pathway,
    }))
  }

  const unlockPathway = (
    pathway: string
  ) => {
    setProgress((prev) => ({
      ...prev,

      unlockedPathways:
        prev.unlockedPathways.includes(
          pathway
        )
          ? prev.unlockedPathways
          : [
              ...prev.unlockedPathways,
              pathway,
            ],
    }))
  }

  const toggleLowDataMode =
    () => {
      setProgress((prev) => ({
        ...prev,

        lowDataMode:
          !prev.lowDataMode,
      }))
    }

  const addOpportunity = (
    opportunity: Opportunity
  ) => {
    setProgress((prev) => ({
      ...prev,

      opportunities: [
        ...prev.opportunities,
        opportunity,
      ],
    }))
  }

  const addCompletedSimulation =
    (simulation: string) => {
      setProgress((prev) => ({
        ...prev,

        completedSimulations: [
          ...prev.completedSimulations,
          simulation,
        ],
      }))
    }

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      const {
        interests,
        readinessScore,
        completedSimulations,
        careerGoal,
        skillLevel,
        learningStyle,
        weeklyHours,
        onboardingComplete,
        recommendedSkills,
        pathwayProgress,
      } = updates

      const profileUpdates: Partial<ProfileOnlyState> =
        {}

      if (careerGoal !== undefined) {
        profileUpdates.careerGoal =
          careerGoal
      }

      if (skillLevel !== undefined) {
        profileUpdates.skillLevel =
          skillLevel
      }

      if (
        learningStyle !== undefined
      ) {
        profileUpdates.learningStyle =
          learningStyle
      }

      if (weeklyHours !== undefined) {
        profileUpdates.weeklyHours =
          weeklyHours
      }

      if (
        onboardingComplete !==
        undefined
      ) {
        profileUpdates.onboardingComplete =
          onboardingComplete
      }

      if (
        recommendedSkills !==
        undefined
      ) {
        profileUpdates.recommendedSkills =
          recommendedSkills
      }

      if (
        pathwayProgress !== undefined
      ) {
        profileUpdates.pathwayProgress =
          pathwayProgress
      }

      if (
        Object.keys(profileUpdates)
          .length > 0
      ) {
        setProfileOnly((prev) => ({
          ...prev,
          ...profileUpdates,
        }))
      }

      if (
        interests !== undefined ||
        readinessScore !==
          undefined ||
        completedSimulations !==
          undefined
      ) {
        setProgress((prev) => ({
          ...prev,
          ...(interests !==
            undefined && {
            interests,
          }),
          ...(readinessScore !==
            undefined && {
            readinessScore,
          }),
          ...(completedSimulations !==
            undefined && {
            completedSimulations,
          }),
        }))
      }
    },
    []
  )

  const completeOnboarding =
    useCallback(() => {
      setProfileOnly((prev) => ({
        ...prev,
        onboardingComplete: true,
      }))
    }, [])

  const recordSimulationCompletion =
    useCallback(
      (
        simulationId: string,
        finalScore: number
      ) => {
        const impact = Math.round(
          finalScore / 10
        )

        setProgress((prev) => {
          if (
            prev.completedSimulations.includes(
              simulationId
            )
          ) {
            return prev
          }

          return {
            ...prev,

            completedSimulations: [
              ...prev.completedSimulations,
              simulationId,
            ],

            simulationsCompleted:
              prev.simulationsCompleted +
              1,

            readinessScore: Math.min(
              100,
              prev.readinessScore +
                impact
            ),

            employabilityScore:
              Math.min(
                100,
                prev.employabilityScore +
                  impact
              ),
          }
        })

        setProfileOnly((prev) => ({
          ...prev,

          pathwayProgress: Math.min(
            100,
            prev.pathwayProgress +
              impact
          ),
        }))
      },
      []
    )

  const resetProgress = () => {
    const defaults =
      getDefaultPersistedState()

    setProgress(defaults.progress)
    setProfileOnly(
      defaults.profileOnly
    )
  }

  const value = useMemo(
    () => ({
      progress,

      profile,

      hasHydrated,

      increaseReadiness,

      completeSimulation,

      setPathway,

      unlockPathway,

      toggleLowDataMode,

      addOpportunity,

      addCompletedSimulation,

      updateProfile,

      completeOnboarding,

      recordSimulationCompletion,

      resetProgress,
    }),
    [
      progress,
      profile,
      hasHydrated,
      updateProfile,
      completeOnboarding,
      recordSimulationCompletion,
    ]
  )

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  )
}

// =========================================================
// Hook
// =========================================================

export function useUserProgress() {
  const context =
    useContext(UserContext)

  if (!context) {
    throw new Error(
      "useUserProgress must be used within UserProvider"
    )
  }

  return context
}
