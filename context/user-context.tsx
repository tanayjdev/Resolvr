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

import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

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
  getUserScopedStorageKey,
} from "@/lib/storage/user-state-storage"

import {
  calculateSimulationImpact,
  calculateCompleteScoring,
  updateSimulationMemory,
  type ScoringInput,
} from "@/lib/ai/scoring-engine"

import type { SimulationDecision, SimulationRunState } from "@/lib/types/user-state"
import type { AlignmentEffects } from "@/lib/simulations/types"

// ============================================================
// AI Insights Type
// ============================================================

export interface AIInsights {
  readinessTrend: "improving" | "stable" | "declining"
  strongestSkill: string
  weakestSkill: string
  recommendedNextAction: string
  unlockedOpportunities: number
  pathwayProgress: number
  confidenceLevel: "low" | "medium" | "high"
}

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

  // Connected Intelligence methods
  recordSimulationWithImpact: (
    simulationId: string,
    finalScore: number,
    simulationSkills: string[]
  ) => void

  updateScoring: () => void

  earnCertification: (certificationName: string) => void

  getAIInsights: () => AIInsights

  // Simulation State Management methods
  startSimulation: (simulationId: string) => void
  recordSimulationDecision: (
    stepId: string,
    decisionId: string,
    scoreDelta: number,
    aiConfidenceDelta: number,
    alignmentEffects: AlignmentEffects,
    riskEffects: {
      riskProfileDelta: 'conservative' | 'balanced' | 'aggressive'
      stabilityImpact: number
    }
  ) => void
  completeSimulationRun: () => void
  clearSimulationRun: () => void
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
  const { currentUser, getUserData, saveUserData, isAuthenticated } = useAuth()
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
    if (!currentUser || !isAuthenticated) {
      setHasHydrated(true)
      return
    }

    // Load user-scoped data from localStorage first
    const userData = getUserData(currentUser.email)
    if (userData) {
      setProgress(userData.progress)
      setProfileOnly(userData.profileOnly)
    } else {
      // Initialize with defaults for new user
      const defaults = getDefaultPersistedState()
      setProgress(defaults.progress)
      setProfileOnly(defaults.profileOnly)
    }

    // Override with Supabase profile data if available
    if (currentUser.profile) {
      setProfileOnly((prev) => ({
        ...prev,
        careerGoal: currentUser.profile!.career_track || prev.careerGoal,
        careerTrack: (currentUser.profile!.career_track as any) || prev.careerTrack,
        skillLevel: (currentUser.profile!.skill_level as any) || prev.skillLevel,
        weeklyHours: (currentUser.profile!.time_commitment as any) || prev.weeklyHours,
        onboardingComplete: currentUser.profile!.onboarding_complete ?? prev.onboardingComplete,
      }))
    }

    // Override with Supabase user_progress data if available
    if (currentUser.userProgress) {
      setProgress((prev) => ({
        ...prev,
        readinessScore: currentUser.userProgress!.readiness_score ?? prev.readinessScore,
        completedSimulations: currentUser.userProgress!.completed_simulations ?? prev.completedSimulations,
        simulationsCompleted: currentUser.userProgress!.simulations_completed ?? prev.simulationsCompleted,
        employabilityScore: currentUser.userProgress!.employability_score ?? prev.employabilityScore,
        skills: currentUser.userProgress!.skills ?? prev.skills,
        simulationPerformance: currentUser.userProgress!.simulation_performance ?? prev.simulationPerformance,
      }))
    }

    setHasHydrated(true)
  }, [currentUser, isAuthenticated, getUserData])

  useEffect(() => {
    if (!hasHydrated || !currentUser || !isAuthenticated) {
      return
    }

    // Save user-scoped data
    saveUserData(currentUser.email, {
      progress,
      profileOnly,
    })
  }, [progress, profileOnly, hasHydrated, currentUser, isAuthenticated, saveUserData])

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

  // ============================================================
  // Connected Intelligence Methods
  // ============================================================

  const recordSimulationWithImpact = useCallback(
    (
      simulationId: string,
      finalScore: number,
      simulationSkills: string[]
    ) => {
      setProgress((prev) => {
        // Don't record if already completed
        if (prev.completedSimulations.includes(simulationId)) {
          return prev
        }

        // Calculate impact using scoring engine
        const scoringInput: ScoringInput = {
          readinessScore: prev.readinessScore,
          employabilityScore: prev.employabilityScore,
          simulationsCompleted: prev.simulationsCompleted,
          skillsTracked: prev.skillsTracked,
          opportunitiesMatched: prev.opportunitiesMatched,
          completedSimulations: prev.completedSimulations,
          unlockedPathways: prev.unlockedPathways,
          skills: prev.skills,
          simulationPerformance: new Map(Object.entries(prev.simulationPerformance))
        }

        const impact = calculateSimulationImpact(
          scoringInput,
          simulationId,
          finalScore,
          simulationSkills
        )

        // Update skills with gains
        const updatedSkills = prev.skills.map(skill => {
          const gain = impact.skillGains.find(g => g.skill === skill.name)
          if (gain) {
            return {
              ...skill,
              level: Math.min(skill.level + gain.gain, 100)
            }
          }
          return skill
        })

        // Add new skills if they don't exist
        simulationSkills.forEach(skillName => {
          if (!updatedSkills.find(s => s.name === skillName)) {
            const gain = impact.skillGains.find(g => g.skill === skillName)
            updatedSkills.push({
              name: skillName,
              level: gain ? gain.gain : 10
            })
          }
        })

        // Unlock new pathways
        const newUnlockedPathways = [
          ...prev.unlockedPathways,
          ...impact.unlockedPathways
        ]

        // Recalculate milestones
        const newMilestones = prev.milestonesCompleted + 1

        return {
          ...prev,

          completedSimulations: [
            ...prev.completedSimulations,
            simulationId
          ],

          simulationsCompleted: prev.simulationsCompleted + 1,

          readinessScore: Math.min(
            prev.readinessScore + impact.readinessImpact,
            1000
          ),

          employabilityScore: Math.min(
            prev.employabilityScore + impact.employabilityImpact,
            100
          ),

          skills: updatedSkills,

          skillsTracked: updatedSkills.length,

          unlockedPathways: newUnlockedPathways,

          milestonesCompleted: newMilestones,

          aiConfidence: Math.min(
            prev.aiConfidence + impact.aiConfidenceChange,
            100
          ),

          recommendationStrength: Math.min(
            prev.recommendationStrength + impact.recommendationStrengthChange,
            100
          ),

          simulationPerformance: {
            ...prev.simulationPerformance,
            [simulationId]: finalScore
          },

          opportunitiesMatched: prev.opportunitiesMatched + 1,

          // Update simulation memory with performance data
          simulationMemory: updateSimulationMemory(
            prev.simulationMemory,
            simulationId,
            finalScore,
            simulationSkills
          )
        }
      })
    },
    []
  )

  const updateScoring = useCallback(() => {
    setProgress((prev) => {
      const scoringInput: ScoringInput = {
        readinessScore: prev.readinessScore,
        employabilityScore: prev.employabilityScore,
        simulationsCompleted: prev.simulationsCompleted,
        skillsTracked: prev.skillsTracked,
        opportunitiesMatched: prev.opportunitiesMatched,
        completedSimulations: prev.completedSimulations,
        unlockedPathways: prev.unlockedPathways,
        skills: prev.skills,
        simulationPerformance: new Map(Object.entries(prev.simulationPerformance))
      }

      const scoring = calculateCompleteScoring(
        scoringInput,
        prev.certificationsEarned
      )

      return {
        ...prev,
        aiConfidence: scoring.aiConfidence,
        recommendationStrength: scoring.recommendationStrength,
        milestonesCompleted: scoring.milestonesCompleted
      }
    })
  }, [])

  const earnCertification = useCallback((certificationName: string) => {
    setProgress((prev) => ({
      ...prev,
      certificationsEarned: prev.certificationsEarned + 1,
      // Certification boosts employability
      employabilityScore: Math.min(prev.employabilityScore + 10, 100),
      // Certification boosts readiness slightly
      readinessScore: Math.min(prev.readinessScore + 50, 1000)
    }))
  }, [])

  // ============================================================
  // Simulation State Management
  // ============================================================

  const startSimulation = useCallback((simulationId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentSimulationRun: {
        simulationId,
        currentStepIndex: 0,
        decisions: [],
        runningScore: 0,
        runningAiConfidence: prev.aiConfidence,
        runningAlignment: {
          mlAlignment: 0,
          infraAlignment: 0,
          productAlignment: 0,
          securityAlignment: 0
        },
        runningStability: 0,
        isComplete: false
      }
    }))
  }, [])

  const recordSimulationDecision = useCallback((
    stepId: string,
    decisionId: string,
    scoreDelta: number,
    aiConfidenceDelta: number,
    alignmentEffects: AlignmentEffects,
    riskEffects: {
      riskProfileDelta: 'conservative' | 'balanced' | 'aggressive'
      stabilityImpact: number
    }
  ) => {
    setProgress((prev) => {
      if (!prev.currentSimulationRun) return prev

      const newDecision: SimulationDecision = {
        stepId,
        decisionId,
        scoreDelta,
        aiConfidenceDelta,
        alignmentEffects,
        riskEffects
      }

      return {
        ...prev,
        currentSimulationRun: {
          ...prev.currentSimulationRun,
          decisions: [...prev.currentSimulationRun.decisions, newDecision],
          runningScore: prev.currentSimulationRun.runningScore + scoreDelta,
          runningAiConfidence: Math.max(0, Math.min(100, prev.currentSimulationRun.runningAiConfidence + aiConfidenceDelta)),
          runningAlignment: {
            mlAlignment: prev.currentSimulationRun.runningAlignment.mlAlignment + alignmentEffects.mlAlignment,
            infraAlignment: prev.currentSimulationRun.runningAlignment.infraAlignment + alignmentEffects.infraAlignment,
            productAlignment: prev.currentSimulationRun.runningAlignment.productAlignment + alignmentEffects.productAlignment,
            securityAlignment: prev.currentSimulationRun.runningAlignment.securityAlignment + alignmentEffects.securityAlignment
          },
          runningStability: prev.currentSimulationRun.runningStability + riskEffects.stabilityImpact,
          currentStepIndex: prev.currentSimulationRun.currentStepIndex + 1
        }
      }
    })
  }, [])

  const completeSimulationRun = useCallback(() => {
    setProgress((prev) => {
      if (!prev.currentSimulationRun || prev.currentSimulationRun.isComplete) return prev

      const { currentSimulationRun } = prev
      const finalScore = Math.max(0, Math.min(100, currentSimulationRun.runningScore))
      const simulationSkills = ['Python', 'Machine Learning', 'Infrastructure', 'Security'] // Default skills

      // Console logging for debugging
      console.log('=== SIMULATION COMPLETION ===')
      console.log('Simulation ID:', currentSimulationRun.simulationId)
      console.log('Final Score:', finalScore)
      console.log('Final AI Confidence:', currentSimulationRun.runningAiConfidence)
      console.log('Final Alignment:', currentSimulationRun.runningAlignment)
      console.log('Total Decisions:', currentSimulationRun.decisions.length)
      console.log('Decision History:', currentSimulationRun.decisions)
      console.log('Previous Readiness Score:', prev.readinessScore)
      console.log('Previous Employability Score:', prev.employabilityScore)

      // Calculate impact using the scoring engine with the actual final score
      const scoringInput: ScoringInput = {
        readinessScore: prev.readinessScore,
        employabilityScore: prev.employabilityScore,
        simulationsCompleted: prev.simulationsCompleted,
        skillsTracked: prev.skillsTracked,
        opportunitiesMatched: prev.opportunitiesMatched,
        completedSimulations: prev.completedSimulations,
        unlockedPathways: prev.unlockedPathways,
        skills: prev.skills,
        simulationPerformance: new Map(Object.entries(prev.simulationPerformance))
      }

      const impact = calculateSimulationImpact(
        scoringInput,
        currentSimulationRun.simulationId,
        finalScore,
        simulationSkills
      )

      console.log('Calculated Impact:', impact)
      console.log('New Readiness Score:', prev.readinessScore + impact.readinessImpact)
      console.log('New Employability Score:', prev.employabilityScore + impact.employabilityImpact)

      // Update skills with gains from alignment effects
      const updatedSkills = prev.skills.map(skill => {
        const alignmentKey = skill.name.toLowerCase().includes('ml') || skill.name.toLowerCase().includes('machine') ? 'mlAlignment' :
                           skill.name.toLowerCase().includes('infra') || skill.name.toLowerCase().includes('cloud') ? 'infraAlignment' :
                           skill.name.toLowerCase().includes('product') ? 'productAlignment' :
                           skill.name.toLowerCase().includes('security') ? 'securityAlignment' : null
        if (alignmentKey) {
          const gain = currentSimulationRun.runningAlignment[alignmentKey as keyof AlignmentEffects] as number / 10
          return {
            ...skill,
            level: Math.min(skill.level + gain, 100)
          }
        }
        return skill
      })

      // Update AI confidence based on simulation performance
      const newAiConfidence = Math.max(0, Math.min(100, currentSimulationRun.runningAiConfidence))

      console.log('=== STATE UPDATE ===')
      console.log('Updated AI Confidence:', newAiConfidence)
      console.log('Updated Skills:', updatedSkills)

      const newProgress = {
        ...prev,
        completedSimulations: [...prev.completedSimulations, currentSimulationRun.simulationId],
        simulationsCompleted: prev.simulationsCompleted + 1,
        readinessScore: Math.min(prev.readinessScore + impact.readinessImpact, 1000),
        employabilityScore: Math.min(prev.employabilityScore + impact.employabilityImpact, 100),
        skills: updatedSkills,
        skillsTracked: updatedSkills.length,
        unlockedPathways: [...prev.unlockedPathways, ...impact.unlockedPathways],
        milestonesCompleted: prev.milestonesCompleted + 1,
        aiConfidence: newAiConfidence,
        recommendationStrength: Math.min(prev.recommendationStrength + impact.recommendationStrengthChange, 100),
        simulationPerformance: {
          ...prev.simulationPerformance,
          [currentSimulationRun.simulationId]: finalScore
        },
        simulationMemory: updateSimulationMemory(
          prev.simulationMemory,
          currentSimulationRun.simulationId,
          finalScore,
          simulationSkills
        ),
        opportunitiesMatched: prev.opportunitiesMatched + 1,
        currentSimulationRun: {
          ...currentSimulationRun,
          isComplete: true
        }
      }

      // Save to Supabase user_progress table
      if (currentUser && isAuthenticated) {
        supabase
          .from('user_progress')
          .upsert({
            user_id: currentUser.id,
            readiness_score: newProgress.readinessScore,
            employability_score: newProgress.employabilityScore,
            simulations_completed: newProgress.simulationsCompleted,
            completed_simulations: newProgress.completedSimulations,
            skills: newProgress.skills,
            simulation_performance: newProgress.simulationPerformance,
            ai_confidence: newProgress.aiConfidence,
            recommendation_strength: newProgress.recommendationStrength,
            milestones_completed: newProgress.milestonesCompleted,
            opportunities_matched: newProgress.opportunitiesMatched,
            unlocked_pathways: newProgress.unlockedPathways,
          }, {
            onConflict: 'user_id'
          })
          .then(({ error }) => {
            if (error) {
              console.error("Failed to save simulation progress to Supabase:", error)
            } else {
              console.log("Simulation progress saved to Supabase successfully")
            }
          })
      }

      return newProgress
    })
  }, [currentUser, isAuthenticated])

  const clearSimulationRun = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentSimulationRun: null
    }))
  }, [])

  const getAIInsights = useCallback((): AIInsights => {
    const skills = progress.skills
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level)
    
    const strongestSkill = sortedSkills[0]?.name || "None"
    const weakestSkill = sortedSkills[sortedSkills.length - 1]?.name || "None"
    
    // Determine readiness trend based on recent performance
    const recentScores = Object.values(progress.simulationPerformance).slice(-3)
    const avgRecentScore = recentScores.length > 0 
      ? recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length 
      : 0
    
    const readinessTrend: "improving" | "stable" | "declining" = 
      avgRecentScore >= 80 ? "improving" : 
      avgRecentScore >= 60 ? "stable" : "declining"
    
    // Determine confidence level
    const confidenceLevel: "low" | "medium" | "high" =
      progress.aiConfidence >= 75 ? "high" :
      progress.aiConfidence >= 50 ? "medium" : "low"
    
    // Generate recommended next action
    let recommendedNextAction = "Continue completing simulations to build your profile"
    
    if (progress.readinessScore >= 500 && !progress.unlockedPathways.includes("DevOps")) {
      recommendedNextAction = "Complete more simulations to unlock DevOps pathway"
    } else if (progress.readinessScore >= 700 && !progress.unlockedPathways.includes("Security")) {
      recommendedNextAction = "You're ready for advanced Security simulations"
    } else if (progress.simulationsCompleted < 5) {
      recommendedNextAction = "Complete 5 simulations to unlock milestone rewards"
    } else if (progress.certificationsEarned === 0 && progress.employabilityScore >= 80) {
      recommendedNextAction = "Consider earning a certification to boost your profile"
    }
    
    return {
      readinessTrend,
      strongestSkill,
      weakestSkill,
      recommendedNextAction,
      unlockedOpportunities: progress.opportunitiesMatched,
      pathwayProgress: profile.pathwayProgress,
      confidenceLevel
    }
  }, [progress, profile])

  const value = useMemo(
    () => ({
      progress,

      profile,

      hasHydrated,

      increaseReadiness,

      completeSimulation,

      setPathway,

      unlockPathway,

      addOpportunity,

      addCompletedSimulation,

      updateProfile,

      completeOnboarding,

      recordSimulationCompletion,

      resetProgress,

      // Connected Intelligence methods
      recordSimulationWithImpact,

      updateScoring,

      earnCertification,

      getAIInsights,

      // Simulation State Management methods
      startSimulation,
      recordSimulationDecision,
      completeSimulationRun,
      clearSimulationRun,
    }),
    [
      progress,
      profile,
      hasHydrated,
      increaseReadiness,
      completeSimulation,
      setPathway,
      unlockPathway,
      addOpportunity,
      addCompletedSimulation,
      updateProfile,
      completeOnboarding,
      recordSimulationCompletion,
      resetProgress,
      recordSimulationWithImpact,
      updateScoring,
      earnCertification,
      getAIInsights,
      startSimulation,
      recordSimulationDecision,
      completeSimulationRun,
      clearSimulationRun,
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
