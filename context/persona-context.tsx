"use client"

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import type { CareerTrack, ExperienceLevel, TimeCommitment, PersonaData } from "@/lib/personas/persona-config"
import { getPersonaData, adjustPersonaForExperience, adjustPersonaForTimeCommitment } from "@/lib/personas/persona-config"
import { generateDashboardData, type OnboardingProfile, type DashboardData } from "@/lib/dashboard/dashboard-generator"
import { generateRecommendations, generatePersonalizedInsights, type RecommendationContext } from "@/lib/recommendations/recommendation-engine"

import { useUserProgress } from "@/context/user-context"
import type { UserProfile } from "@/lib/types/user-profile"

// ============================================================
// Types
// ============================================================

export interface PersonaContextType {
  persona: PersonaData | null
  dashboardData: DashboardData | null
  recommendations: ReturnType<typeof generateRecommendations>
  insights: ReturnType<typeof generatePersonalizedInsights>
  isLoading: boolean
  refreshPersona: () => void
}

const PersonaContext = createContext<PersonaContextType | null>(null)

// ============================================================
// Helper Functions
// ============================================================

function mapSkillLevelToExperience(level: string): ExperienceLevel {
  const mapping: Record<string, ExperienceLevel> = {
    "Beginner": "beginner",
    "Intermediate": "intermediate",
    "Advanced": "advanced",
  }
  return mapping[level] || "beginner"
}

function mapWeeklyHoursToTimeCommitment(hours: string): TimeCommitment {
  const mapping: Record<string, TimeCommitment> = {
    "2hrs": "casual",
    "5hrs": "moderate",
    "10hrs+": "intensive",
  }
  return mapping[hours] || "moderate"
}

// ============================================================
// Provider
// ============================================================

export function PersonaProvider({ children }: { children: ReactNode }) {
  const { profile, progress, hasHydrated } = useUserProgress()
  const [persona, setPersona] = useState<PersonaData | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [recommendations, setRecommendations] = useState<ReturnType<typeof generateRecommendations>>([])
  const [insights, setInsights] = useState<ReturnType<typeof generatePersonalizedInsights>>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshPersona = useCallback(() => {
    if (!hasHydrated || !profile.careerTrack) {
      setPersona(null)
      setDashboardData(null)
      setRecommendations([])
      setInsights([])
      setIsLoading(false)
      return
    }

    try {
      // Get base persona data
      let personaData = getPersonaData(profile.careerTrack)
      
      // Adjust for experience level
      const experienceLevel = mapSkillLevelToExperience(profile.skillLevel)
      personaData = adjustPersonaForExperience(personaData, experienceLevel)
      
      // Adjust for time commitment
      const timeCommitment = mapWeeklyHoursToTimeCommitment(profile.weeklyHours)
      personaData = adjustPersonaForTimeCommitment(personaData, timeCommitment)
      
      setPersona(personaData)

      // Generate dashboard data
      const onboardingProfile: OnboardingProfile = {
        careerTrack: profile.careerTrack,
        experienceLevel,
        timeCommitment,
        interests: progress.interests,
      }
      
      const dashData = generateDashboardData(onboardingProfile, progress)
      setDashboardData(dashData)

      // Generate recommendations
      const recContext: RecommendationContext = {
        persona: personaData,
        progress,
        experienceLevel,
        timeCommitment,
      }
      
      const recs = generateRecommendations(recContext)
      setRecommendations(recs)

      // Generate insights
      const ins = generatePersonalizedInsights(recContext)
      setInsights(ins)

      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load persona data:", error)
      setPersona(null)
      setDashboardData(null)
      setRecommendations([])
      setInsights([])
      setIsLoading(false)
    }
  }, [hasHydrated, profile, progress])

  useEffect(() => {
    refreshPersona()
  }, [refreshPersona])

  const value: PersonaContextType = {
    persona,
    dashboardData,
    recommendations,
    insights,
    isLoading,
    refreshPersona,
  }

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================

export function usePersona() {
  const context = useContext(PersonaContext)
  if (!context) {
    throw new Error("usePersona must be used within PersonaProvider")
  }
  return context
}
