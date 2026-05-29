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

import type {
  Opportunity,
  OpportunityFilters,
  OpportunitySort,
  SimulationConfig,
  SimulationRun,
  SimulationResult,
  ReadinessAnalysis,
  SkillGapAnalysis,
  PathwayProgress,
  AIInsight,
  AIRecommendation,
  Notification,
  UserPreferences,
} from "@/lib/types/enhanced-data-models"

// ============================================================
// App State Context
// ============================================================

interface AppState {
  // Opportunities
  opportunities: Opportunity[]
  opportunityFilters: OpportunityFilters
  opportunitySort: OpportunitySort
  savedOpportunities: string[]
  appliedOpportunities: string[]
  
  // Simulations
  availableSimulations: SimulationConfig[]
  currentSimulationRun: SimulationRun | null
  simulationHistory: SimulationResult[]
  
  // Readiness
  readinessAnalysis: ReadinessAnalysis | null
  
  // Skills
  skillGapAnalysis: SkillGapAnalysis | null
  
  // Pathway
  pathwayProgress: PathwayProgress | null
  
  // AI Insights
  aiInsights: AIInsight[]
  aiRecommendations: AIRecommendation[]
  
  // Notifications
  notifications: Notification[]
  unreadNotificationCount: number
  
  // User Preferences
  userPreferences: UserPreferences
}

interface AppStateActions {
  // Opportunities
  setOpportunities: (opportunities: Opportunity[]) => void
  setOpportunityFilters: (filters: Partial<OpportunityFilters>) => void
  setOpportunitySort: (sort: OpportunitySort) => void
  toggleSaveOpportunity: (opportunityId: string) => void
  applyToOpportunity: (opportunityId: string) => void
  
  // Simulations
  startSimulation: (simulationId: string) => void
  makeSimulationDecision: (stageId: string, optionId: string) => void
  completeSimulation: (result: SimulationResult) => void
  cancelSimulation: () => void
  
  // Readiness
  setReadinessAnalysis: (analysis: ReadinessAnalysis) => void
  
  // Skills
  setSkillGapAnalysis: (analysis: SkillGapAnalysis) => void
  
  // Pathway
  setPathwayProgress: (progress: PathwayProgress) => void
  
  // AI Insights
  addAIInsight: (insight: AIInsight) => void
  addAIRecommendation: (recommendation: AIRecommendation) => void
  clearAIRecommendations: () => void
  
  // Notifications
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  
  // User Preferences
  setUserPreferences: (preferences: Partial<UserPreferences>) => void
  
  // Reset
  resetAppState: () => void
}

interface AppStateContextType {
  state: AppState
  actions: AppStateActions
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

// ============================================================
// Default State
// ============================================================

const defaultFilters: OpportunityFilters = {
  matchPercentage: null,
  workType: null,
  salaryRange: null,
  roleCategory: null,
  skills: [],
  location: null,
  experienceLevel: null,
  postedDate: null,
  topMatchesOnly: false,
  searchQuery: "",
}

const defaultSort: OpportunitySort = {
  by: "match",
  order: "desc",
}

const defaultPreferences: UserPreferences = {
  careerGoals: [],
  skillFocus: [],
  preferredTechnologies: [],
  industryPreferences: [],
  learningPace: "moderate",
  specialization: "",
  notifications: {
    opportunities: true,
    simulations: true,
    readiness: true,
    pathway: true,
  },
}

const defaultState: AppState = {
  opportunities: [],
  opportunityFilters: defaultFilters,
  opportunitySort: defaultSort,
  savedOpportunities: [],
  appliedOpportunities: [],
  availableSimulations: [],
  currentSimulationRun: null,
  simulationHistory: [],
  readinessAnalysis: null,
  skillGapAnalysis: null,
  pathwayProgress: null,
  aiInsights: [],
  aiRecommendations: [],
  notifications: [],
  unreadNotificationCount: 0,
  userPreferences: defaultPreferences,
}

// ============================================================
// Provider
// ============================================================

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("resolvr-app-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setState((prev) => ({
          ...prev,
          ...parsed,
          // Reset runtime-only state
          currentSimulationRun: null,
        }))
      } catch (error) {
        console.error("Failed to load app state:", error)
      }
    }
  }, [])

  // Save state to localStorage on change
  useEffect(() => {
    const stateToSave = {
      ...state,
      // Don't save runtime-only state
      currentSimulationRun: null,
    }
    localStorage.setItem("resolvr-app-state", JSON.stringify(stateToSave))
  }, [state])

  // ============================================================
  // Actions
  // ============================================================

  const actions: AppStateActions = useMemo(() => ({
    // Opportunities
    setOpportunities: (opportunities) => {
      setState((prev) => ({ ...prev, opportunities }))
    },

    setOpportunityFilters: (filters) => {
      setState((prev) => ({
        ...prev,
        opportunityFilters: { ...prev.opportunityFilters, ...filters },
      }))
    },

    setOpportunitySort: (sort) => {
      setState((prev) => ({ ...prev, opportunitySort: sort }))
    },

    toggleSaveOpportunity: (opportunityId) => {
      setState((prev) => {
        const isSaved = prev.savedOpportunities.includes(opportunityId)
        const savedOpportunities = isSaved
          ? prev.savedOpportunities.filter((id) => id !== opportunityId)
          : [...prev.savedOpportunities, opportunityId]

        // Update opportunity saved status
        const opportunities = prev.opportunities.map((opp) =>
          opp.id === opportunityId ? { ...opp, isSaved: !isSaved } : opp
        )

        return { ...prev, savedOpportunities, opportunities }
      })
    },

    applyToOpportunity: (opportunityId) => {
      setState((prev) => {
        if (prev.appliedOpportunities.includes(opportunityId)) {
          return prev
        }

        const appliedOpportunities = [...prev.appliedOpportunities, opportunityId]

        // Update opportunity applied status
        const opportunities = prev.opportunities.map((opp) =>
          opp.id === opportunityId ? { ...opp, isApplied: true } : opp
        )

        // Add notification
        const notification: Notification = {
          id: `apply-${opportunityId}-${Date.now()}`,
          type: "opportunity",
          title: "Application Submitted",
          message: "Your application has been submitted successfully",
          timestamp: new Date(),
          isRead: false,
          priority: "medium",
        }

        return {
          ...prev,
          appliedOpportunities,
          opportunities,
          notifications: [notification, ...prev.notifications],
          unreadNotificationCount: prev.unreadNotificationCount + 1,
        }
      })
    },

    // Simulations
    startSimulation: (simulationId) => {
      setState((prev) => ({
        ...prev,
        currentSimulationRun: {
          simulationId,
          currentStageIndex: 0,
          decisions: [],
          runningScore: 0,
          runningConfidence: 0,
          runningStability: 0,
          isComplete: false,
          startTime: new Date(),
        },
      }))
    },

    makeSimulationDecision: (stageId, optionId) => {
      setState((prev) => {
        if (!prev.currentSimulationRun) return prev

        // This would normally calculate the decision impact
        // For now, we'll add a placeholder decision
        const decision = {
          stageId,
          optionId,
          timestamp: new Date(),
          scoreDelta: 5,
          confidenceDelta: 3,
          stabilityDelta: 2,
          alignmentEffects: {
            pathwayAffinity: 1,
            skillGains: [],
            skillLosses: [],
          },
        }

        return {
          ...prev,
          currentSimulationRun: {
            ...prev.currentSimulationRun,
            decisions: [...prev.currentSimulationRun.decisions, decision],
            runningScore: prev.currentSimulationRun.runningScore + decision.scoreDelta,
            runningConfidence: prev.currentSimulationRun.runningConfidence + decision.confidenceDelta,
            runningStability: prev.currentSimulationRun.runningStability + decision.stabilityDelta,
            currentStageIndex: prev.currentSimulationRun.currentStageIndex + 1,
          },
        }
      })
    },

    completeSimulation: (result) => {
      setState((prev) => {
        const notification: Notification = {
          id: `sim-${result.simulationId}-${Date.now()}`,
          type: "simulation",
          title: "Simulation Completed",
          message: `You completed ${result.simulationId} with a score of ${result.score}`,
          timestamp: new Date(),
          isRead: false,
          priority: "high",
        }

        return {
          ...prev,
          currentSimulationRun: null,
          simulationHistory: [result, ...prev.simulationHistory],
          notifications: [notification, ...prev.notifications],
          unreadNotificationCount: prev.unreadNotificationCount + 1,
        }
      })
    },

    cancelSimulation: () => {
      setState((prev) => ({
        ...prev,
        currentSimulationRun: null,
      }))
    },

    // Readiness
    setReadinessAnalysis: (analysis) => {
      setState((prev) => ({ ...prev, readinessAnalysis: analysis }))
    },

    // Skills
    setSkillGapAnalysis: (analysis) => {
      setState((prev) => ({ ...prev, skillGapAnalysis: analysis }))
    },

    // Pathway
    setPathwayProgress: (progress) => {
      setState((prev) => ({ ...prev, pathwayProgress: progress }))
    },

    // AI Insights
    addAIInsight: (insight) => {
      setState((prev) => ({
        ...prev,
        aiInsights: [insight, ...prev.aiInsights],
      }))
    },

    addAIRecommendation: (recommendation) => {
      setState((prev) => ({
        ...prev,
        aiRecommendations: [recommendation, ...prev.aiRecommendations],
      }))
    },

    clearAIRecommendations: () => {
      setState((prev) => ({ ...prev, aiRecommendations: [] }))
    },

    // Notifications
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date(),
        isRead: false,
      }

      setState((prev) => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications],
        unreadNotificationCount: prev.unreadNotificationCount + 1,
      }))
    },

    markNotificationRead: (notificationId) => {
      setState((prev) => {
        const notifications = prev.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )

        const unreadNotificationCount = notifications.filter((n) => !n.isRead).length

        return { ...prev, notifications, unreadNotificationCount }
      })
    },

    markAllNotificationsRead: () => {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notif) => ({ ...notif, isRead: true })),
        unreadNotificationCount: 0,
      }))
    },

    clearNotifications: () => {
      setState((prev) => ({
        ...prev,
        notifications: [],
        unreadNotificationCount: 0,
      }))
    },

    // User Preferences
    setUserPreferences: (preferences) => {
      setState((prev) => ({
        ...prev,
        userPreferences: { ...prev.userPreferences, ...preferences },
      }))
    },

    // Reset
    resetAppState: () => {
      setState(defaultState)
    },
  }), [])

  const value = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  )

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider")
  }
  return context
}

// ============================================================
// Selectors
// ============================================================

export function useFilteredOpportunities() {
  const { state } = useAppState()

  return useMemo(() => {
    let filtered = [...state.opportunities]

    // Apply filters
    if (state.opportunityFilters.matchPercentage !== null) {
      filtered = filtered.filter(
        (opp) => opp.match >= state.opportunityFilters.matchPercentage!
      )
    }

    if (state.opportunityFilters.workType !== null) {
      filtered = filtered.filter(
        (opp) => opp.workType === state.opportunityFilters.workType
      )
    }

    if (state.opportunityFilters.salaryRange !== null) {
      filtered = filtered.filter((opp) => {
        const salary = parseInt(opp.salary.replace(/[^0-9]/g, ""))
        return (
          salary >= state.opportunityFilters.salaryRange!.min &&
          salary <= state.opportunityFilters.salaryRange!.max
        )
      })
    }

    if (state.opportunityFilters.experienceLevel !== null) {
      filtered = filtered.filter(
        (opp) => opp.experienceLevel === state.opportunityFilters.experienceLevel
      )
    }

    if (state.opportunityFilters.topMatchesOnly) {
      filtered = filtered.filter((opp) => opp.match >= 85)
    }

    if (state.opportunityFilters.searchQuery) {
      const query = state.opportunityFilters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.company.toLowerCase().includes(query) ||
          opp.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(query)
          )
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const multiplier = state.opportunitySort.order === "asc" ? 1 : -1

      switch (state.opportunitySort.by) {
        case "match":
          return (a.match - b.match) * multiplier
        case "newest":
          return (
            (b.postedDate.getTime() - a.postedDate.getTime()) * multiplier
          )
        case "salary":
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ""))
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ""))
          return (salaryA - salaryB) * multiplier
        case "relevance":
          return (a.pathwayAlignment - b.pathwayAlignment) * multiplier
        default:
          return 0
      }
    })

    return filtered
  }, [state.opportunities, state.opportunityFilters, state.opportunitySort])
}

export function useUnreadNotifications() {
  const { state } = useAppState()
  return state.notifications.filter((n) => !n.isRead)
}

export function useSimulationStats() {
  const { state } = useAppState()
  
  return useMemo(() => {
    const completed = state.simulationHistory.length
    const averageScore =
      completed > 0
        ? state.simulationHistory.reduce((sum, sim) => sum + sim.score, 0) /
          completed
        : 0
    const totalReadinessGain = state.simulationHistory.reduce(
      (sum, sim) => sum + sim.readinessGain,
      0
    )

    return {
      completed,
      averageScore,
      totalReadinessGain,
    }
  }, [state.simulationHistory])
}
