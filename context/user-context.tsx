"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react"

// =========================================================
// Types
// =========================================================

export interface UserProgress {
  readinessScore: number
  simulationsCompleted: number
  employabilityScore: number
  skillsTracked: number
  opportunitiesMatched: number
  currentPathway: string
}

interface UserContextType {
  progress: UserProgress

  increaseReadiness: (
    value: number
  ) => void

  completeSimulation: () => void

  setPathway: (
    pathway: string
  ) => void

  resetProgress: () => void
}

// =========================================================
// Constants
// =========================================================

const STORAGE_KEY =
  "pathweaver-progress"

const DEFAULT_PROGRESS: UserProgress =
  {
    readinessScore: 620,

    simulationsCompleted: 18,

    employabilityScore: 87,

    skillsTracked: 24,

    opportunitiesMatched: 42,

    currentPathway:
      "Machine Learning",
  }

// =========================================================
// Context
// =========================================================

const UserContext =
  createContext<UserContextType | null>(
    null
  )

// =========================================================
// Helpers
// =========================================================

function loadStoredProgress(): UserProgress {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS
  }

  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!stored) {
      return DEFAULT_PROGRESS
    }

    const parsed = JSON.parse(
      stored
    ) as Partial<UserProgress>

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    }
  } catch (error) {
    console.error(
      "Failed to load saved progress:",
      error
    )

    return DEFAULT_PROGRESS
  }
}

// =========================================================
// Provider
// =========================================================

export function UserProvider({
  children,
}: {
  children: ReactNode
}) {
  const [progress, setProgress] =
    useState<UserProgress>(
      loadStoredProgress
    )

  // =======================================================
  // Persistence
  // =======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      )
    } catch (error) {
      console.error(
        "Failed to save progress:",
        error
      )
    }
  }, [progress])

  // =======================================================
  // Actions
  // =======================================================

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
    () => {
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
      }))
    }

  const setPathway = (
    pathway: string
  ) => {
    setProgress((prev) => ({
      ...prev,

      currentPathway:
        pathway,
    }))
  }

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS)
  }

  // =======================================================
  // Memoized Context
  // =======================================================

  const value = useMemo(
    () => ({
      progress,

      increaseReadiness,

      completeSimulation,

      setPathway,

      resetProgress,
    }),
    [progress]
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