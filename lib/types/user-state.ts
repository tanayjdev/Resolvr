import type { CareerPathway } from "@/lib/pathways/pathway-engine"

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

  // Connected Intelligence fields
  certificationsEarned: number

  milestonesCompleted: number

  aiConfidence: number

  recommendationStrength: number

  simulationPerformance: Record<string, number> // simulationId -> score
}

export const DEFAULT_PROGRESS: UserProgress = {
  readinessScore: 620,

  simulationsCompleted: 18,

  employabilityScore: 87,

  skillsTracked: 24,

  opportunitiesMatched: 42,

  currentPathway: "Machine Learning",

  unlockedPathways: ["Machine Learning", "Backend"],

  completedSimulations: ["Kubernetes Incident"],

  interests: ["AI", "Cloud"],

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

  // Connected Intelligence fields
  certificationsEarned: 0,

  milestonesCompleted: 2,

  aiConfidence: 65,

  recommendationStrength: 70,

  simulationPerformance: {},
}
