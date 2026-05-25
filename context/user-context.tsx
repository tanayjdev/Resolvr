"use client"

import type {
  CareerPathway,
} from "@/lib/pathways/pathway-engine"

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

export interface Skill {
  name: string
  level: number
}

export interface Opportunity {
  company: string
  role: string
  match: number
}

export interface UserProgress {
  readinessScore: number

  simulationsCompleted: number

  employabilityScore: number

  skillsTracked: number

  opportunitiesMatched: number

  currentPathway: CareerPathway

  unlockedPathways: string[]

  completedSimulations: string[]

  interests: string[]

  skills: Skill[]

  opportunities: Opportunity[]

  lowDataMode: boolean
}

interface UserContextType {
  progress: UserProgress

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

  resetProgress: () => void
}

// =========================================================
// Constants
// =========================================================

const STORAGE_KEY =
  "pathweaver-progress"

  const DEFAULT_PROGRESS: UserProgress = {
    readinessScore: 620,
  
    simulationsCompleted: 18,
  
    employabilityScore: 87,
  
    skillsTracked: 24,
  
    opportunitiesMatched: 42,
  
    currentPathway: "Machine Learning",
  
    unlockedPathways: [
      "Machine Learning",
      "Backend",
    ],
  
    completedSimulations: [
      "Kubernetes Incident",
    ],
  
    interests: [
      "AI",
      "Cloud",
    ],
  
    skills: [
      {
        name: "Python",
        level: 82,
      },
      {
        name: "Docker",
        level: 68,
      },
    ],
  
    opportunities: [
      {
        company: "Razorpay",
        role: "Backend Intern",
        match: 91,
      },
    ],
  
    lowDataMode: false,
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
    useState<UserProgress>(DEFAULT_PROGRESS)

  const [hasHydrated, setHasHydrated] =
    useState(false)

  // Load persisted progress after mount so SSR and
  // the first client render stay in sync.
  useEffect(() => {
    setProgress(loadStoredProgress())
    setHasHydrated(true)
  }, [])

  // =======================================================
  // Persistence
  // =======================================================

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

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
  }, [progress, hasHydrated])

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
  
      unlockPathway,
  
      toggleLowDataMode,
  
      addOpportunity,
  
      addCompletedSimulation,
  
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