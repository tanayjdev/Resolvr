// ============================================================
// Dashboard Generator
// ============================================================
// This file generates personalized dashboard data based on
// the user's selected persona (career track, experience level, time commitment).
// ============================================================

import type { UserProgress } from "@/context/user-context"
import type {
  CareerTrack,
  ExperienceLevel,
  TimeCommitment,
  PersonaData,
  Skill,
  Pathway,
  Simulation,
  Opportunity,
} from "@/lib/personas/persona-config"
import {
  getPersonaData,
  adjustPersonaForExperience,
  adjustPersonaForTimeCommitment,
} from "@/lib/personas/persona-config"

// ============================================================
// Types
// ============================================================

export interface DashboardMetrics {
  readinessScore: number
  employabilityScore: number
  aiConfidence: number
  skillsMastered: number
  skillsInDevelopment: number
  pathwaysCompleted: number
  pathwaysInProgress: number
  simulationsCompleted: number
  totalSimulations: number
  opportunitiesMatched: number
  totalOpportunities: number
}

export interface DashboardData {
  persona: PersonaData
  metrics: DashboardMetrics
  topSkills: Skill[]
  weakSkills: Skill[]
  recommendedPathways: Pathway[]
  recommendedSimulations: Simulation[]
  recommendedOpportunities: Opportunity[]
  aiInsights: string[]
  weeklyGoals: string[]
  progressTrend: number[]
}

export interface OnboardingProfile {
  careerTrack: CareerTrack
  experienceLevel: ExperienceLevel
  timeCommitment: TimeCommitment
  interests: string[]
}

// ============================================================
// Dashboard Generator
// ============================================================

export function generateDashboardData(
  profile: OnboardingProfile,
  existingProgress?: UserProgress
): DashboardData {
  // Get base persona data
  let persona = getPersonaData(profile.careerTrack)
  
  // Adjust for experience level
  persona = adjustPersonaForExperience(persona, profile.experienceLevel)
  
  // Adjust for time commitment
  persona = adjustPersonaForTimeCommitment(persona, profile.timeCommitment)
  
  // If user has existing progress, merge it
  if (existingProgress) {
    persona = mergePersonaWithProgress(persona, existingProgress)
  }
  
  // Calculate metrics
  const metrics = calculateMetrics(persona)
  
  // Get top and weak skills
  const topSkills = getTopSkills(persona.skills, 5)
  const weakSkills = getWeakSkills(persona.skills, 3)
  
  // Get recommended items
  const recommendedPathways = getRecommendedPathways(persona.pathways)
  const recommendedSimulations = getRecommendedSimulations(persona.simulations)
  const recommendedOpportunities = getRecommendedOpportunities(persona.opportunities)
  
  // Generate AI insights
  const aiInsights = generateAIInsights(persona, profile)
  
  // Generate weekly goals
  const weeklyGoals = generateWeeklyGoals(persona, profile)
  
  // Generate progress trend
  const progressTrend = generateProgressTrend(persona, existingProgress)
  
  return {
    persona,
    metrics,
    topSkills,
    weakSkills,
    recommendedPathways,
    recommendedSimulations,
    recommendedOpportunities,
    aiInsights,
    weeklyGoals,
    progressTrend,
  }
}

// ============================================================
// Helper Functions
// ============================================================

function mergePersonaWithProgress(
  persona: PersonaData,
  progress: UserProgress
): PersonaData {
  // Merge skills with user progress
  const mergedSkills = persona.skills.map(skill => {
    const userSkill = progress.skills.find((s: Skill) => s.name === skill.name)
    if (userSkill) {
      return { ...skill, level: userSkill.level }
    }
    return skill
  })
  
  // Merge simulations with user progress
  const mergedSimulations = persona.simulations.map(simulation => {
    const isCompleted = progress.completedSimulations.includes(simulation.id)
    return {
      ...simulation,
      isAvailable: !isCompleted,
    }
  })
  
  return {
    ...persona,
    skills: mergedSkills,
    simulations: mergedSimulations,
    readinessScore: progress.readinessScore,
    aiConfidence: progress.aiConfidence,
  }
}

function calculateMetrics(persona: PersonaData): DashboardMetrics {
  const skillsMastered = persona.skills.filter(s => s.level >= 80).length
  const skillsInDevelopment = persona.skills.filter(s => s.level >= 50 && s.level < 80).length
  const pathwaysCompleted = persona.pathways.filter(p => p.progress === 100).length
  const pathwaysInProgress = persona.pathways.filter(p => p.progress > 0 && p.progress < 100).length
  const simulationsCompleted = persona.simulations.filter(s => !s.isAvailable).length
  const totalSimulations = persona.simulations.length
  const opportunitiesMatched = persona.opportunities.filter(o => o.match >= 80).length
  const totalOpportunities = persona.opportunities.length
  
  return {
    readinessScore: persona.readinessScore,
    employabilityScore: persona.employabilityScore,
    aiConfidence: persona.aiConfidence,
    skillsMastered,
    skillsInDevelopment,
    pathwaysCompleted,
    pathwaysInProgress,
    simulationsCompleted,
    totalSimulations,
    opportunitiesMatched,
    totalOpportunities,
  }
}

function getTopSkills(skills: Skill[], count: number): Skill[] {
  return [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, count)
}

function getWeakSkills(skills: Skill[], count: number): Skill[] {
  return [...skills]
    .sort((a, b) => a.level - b.level)
    .slice(0, count)
}

function getRecommendedPathways(pathways: Pathway[]): Pathway[] {
  // Return pathways that are not completed, sorted by progress
  return pathways
    .filter(p => p.progress < 100)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)
}

function getRecommendedSimulations(simulations: Simulation[]): Simulation[] {
  // Return available simulations, sorted by readiness impact
  return simulations
    .filter(s => s.isAvailable)
    .sort((a, b) => b.readinessImpact - a.readinessImpact)
    .slice(0, 3)
}

function getRecommendedOpportunities(opportunities: Opportunity[]): Opportunity[] {
  // Return opportunities with highest match
  return opportunities
    .sort((a, b) => b.match - a.match)
    .slice(0, 3)
}

function generateAIInsights(
  persona: PersonaData,
  profile: OnboardingProfile
): string[] {
  const insights: string[] = []
  
  // Career-specific insights
  insights.push(persona.aiGuidance)
  
  // Experience level insights
  if (profile.experienceLevel === "beginner") {
    insights.push("Focus on building a strong foundation. Complete beginner pathways first.")
  } else if (profile.experienceLevel === "intermediate") {
    insights.push("You're making good progress. Focus on advanced skills and real-world projects.")
  } else {
    insights.push("Your skills are strong. Consider specializing in advanced areas and mentoring others.")
  }
  
  // Time commitment insights
  if (profile.timeCommitment === "casual") {
    insights.push("With limited time, focus on high-impact skills and quick wins.")
  } else if (profile.timeCommitment === "moderate") {
    insights.push("Balanced approach works well. Mix learning with hands-on projects.")
  } else {
    insights.push("Intensive learning pace. Take care to avoid burnout while maximizing progress.")
  }
  
  // Skills insights
  const topSkill = persona.skills[0]
  const weakSkill = persona.skills[persona.skills.length - 1]
  insights.push(`Your strongest skill is ${topSkill.name} at ${topSkill.level}%. Focus on improving ${weakSkill.name}.`)
  
  return insights
}

function generateWeeklyGoals(
  persona: PersonaData,
  profile: OnboardingProfile
): string[] {
  const goals: string[] = []
  
  // Get first recommended pathway
  const firstPathway = persona.pathways.find(p => p.progress < 100)
  if (firstPathway) {
    const nextStep = firstPathway.steps.find(s => !s.completed)
    if (nextStep) {
      goals.push(`Complete "${nextStep.title}" in ${firstPathway.title}`)
    }
  }
  
  // Get first recommended simulation
  const firstSimulation = persona.simulations.find(s => s.isAvailable)
  if (firstSimulation) {
    goals.push(`Complete simulation: ${firstSimulation.title}`)
  }
  
  // Skill improvement goal
  const weakSkill = persona.skills[persona.skills.length - 1]
  goals.push(`Improve ${weakSkill.name} by 5%`)
  
  // Time-specific goal
  if (profile.timeCommitment === "casual") {
    goals.push("Spend 2-3 hours on learning this week")
  } else if (profile.timeCommitment === "moderate") {
    goals.push("Spend 5-7 hours on learning this week")
  } else {
    goals.push("Spend 10+ hours on learning this week")
  }
  
  return goals
}

function generateProgressTrend(
  persona: PersonaData,
  existingProgress?: UserProgress
): number[] {
  // Generate a trend of readiness scores over the last 6 weeks
  const baseScore = persona.readinessScore
  const trend: number[] = []
  
  for (let i = 5; i >= 0; i--) {
    // Simulate progress with some randomness
    const progress = baseScore - (i * 15) + Math.random() * 10
    trend.push(Math.max(0, Math.min(100, progress)))
  }
  
  // If user has existing progress, use that as the latest value
  if (existingProgress) {
    trend[trend.length - 1] = existingProgress.readinessScore
  }
  
  return trend
}

// ============================================================
// Profile Validation
// ============================================================

export function validateOnboardingProfile(
  profile: Partial<OnboardingProfile>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!profile.careerTrack) {
    errors.push("Career track is required")
  }
  
  if (!profile.experienceLevel) {
    errors.push("Experience level is required")
  }
  
  if (!profile.timeCommitment) {
    errors.push("Time commitment is required")
  }
  
  if (!profile.interests || profile.interests.length === 0) {
    errors.push("At least one interest is required")
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============================================================
// Export Functions
// ============================================================

export function getCareerTrackLabel(track: CareerTrack): string {
  const labels: Record<CareerTrack, string> = {
    "ai-engineer": "AI Engineer",
    "web-developer": "Web Developer",
    "cloud-engineer": "Cloud Engineer",
    cybersecurity: "Cybersecurity Specialist",
    "data-science": "Data Scientist",
    "product-manager": "Product Manager",
  }
  return labels[track]
}

export function getExperienceLevelLabel(level: ExperienceLevel): string {
  const labels: Record<ExperienceLevel, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }
  return labels[level]
}

export function getTimeCommitmentLabel(commitment: TimeCommitment): string {
  const labels: Record<TimeCommitment, string> = {
    casual: "Casual (2-3 hrs/week)",
    moderate: "Moderate (5-7 hrs/week)",
    intensive: "Intensive (10+ hrs/week)",
  }
  return labels[commitment]
}
