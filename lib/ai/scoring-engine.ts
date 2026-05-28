// ============================================================
// AI Scoring Engine
// ============================================================
// Realistic mock calculations for user progression and scoring

export interface ScoringInput {
  readinessScore: number
  employabilityScore: number
  simulationsCompleted: number
  skillsTracked: number
  opportunitiesMatched: number
  completedSimulations: string[]
  unlockedPathways: string[]
  skills: Array<{ name: string; level: number }>
  simulationPerformance?: Map<string, number> // simulationId -> score (0-100)
}

export interface ScoringOutput {
  readinessScore: number
  employabilityScore: number
  aiConfidence: number
  recommendationStrength: number
  skillMastery: number
  pathwayReadiness: number
  certificationsEarned: number
  milestonesCompleted: number
}

export interface SimulationImpact {
  readinessImpact: number
  employabilityImpact: number
  skillGains: Array<{ skill: string; gain: number }>
  unlockedPathways: string[]
  aiConfidenceChange: number
  recommendationStrengthChange: number
}

/**
 * Calculate readiness score based on multiple factors
 * Formula: (simulations * 15) + (skillAvg * 0.4) + (opportunities * 2) + baseScore
 */
export function calculateReadinessScore(input: ScoringInput): number {
  const { simulationsCompleted, skills, opportunitiesMatched } = input
  
  // Calculate average skill level
  const skillAvg = skills.length > 0 
    ? skills.reduce((sum, s) => sum + s.level, 0) / skills.length 
    : 0
  
  // Base readiness calculation
  const baseScore = 400
  const simulationBonus = simulationsCompleted * 15
  const skillBonus = skillAvg * 4
  const opportunityBonus = opportunitiesMatched * 2
  
  const totalScore = baseScore + simulationBonus + skillBonus + opportunityBonus
  
  // Cap at 1000
  return Math.min(totalScore, 1000)
}

/**
 * Calculate employability score based on readiness and market factors
 * Formula: (readiness / 10) + (simulations * 3) + (certifications * 10)
 */
export function calculateEmployabilityScore(input: ScoringInput, certificationsEarned: number = 0): number {
  const { readinessScore, simulationsCompleted } = input
  
  const baseScore = readinessScore / 10
  const simulationBonus = simulationsCompleted * 3
  const certificationBonus = certificationsEarned * 10
  
  const totalScore = baseScore + simulationBonus + certificationBonus
  
  // Cap at 100
  return Math.min(totalScore, 100)
}

/**
 * Calculate AI confidence in recommendations
 * Based on data completeness and user engagement
 */
export function calculateAIConfidence(input: ScoringInput): number {
  const { skillsTracked, simulationsCompleted, skills } = input
  
  // More data = higher confidence
  const dataCompleteness = (skillsTracked / 20) * 40 // max 40 points
  const engagementScore = (simulationsCompleted / 10) * 40 // max 40 points
  const skillDiversity = Math.min(skills.length * 5, 20) // max 20 points
  
  const confidence = dataCompleteness + engagementScore + skillDiversity
  
  return Math.min(confidence, 100)
}

/**
 * Calculate recommendation strength
 * Based on skill alignment and market demand
 */
export function calculateRecommendationStrength(input: ScoringInput): number {
  const { skills, readinessScore } = input
  
  // Higher readiness and more skills = stronger recommendations
  const readinessFactor = (readinessScore / 1000) * 50
  const skillFactor = Math.min(skills.length * 5, 50)
  
  const strength = readinessFactor + skillFactor
  
  return Math.min(strength, 100)
}

/**
 * Calculate skill mastery level
 * Average of all skill levels normalized to 0-100
 */
export function calculateSkillMastery(input: ScoringInput): number {
  const { skills } = input
  
  if (skills.length === 0) return 0
  
  const avgLevel = skills.reduce((sum, s) => sum + s.level, 0) / skills.length
  
  // Normalize 0-100 scale to 0-100 (assuming skill levels are 0-100)
  return avgLevel
}

/**
 * Calculate pathway readiness
 * Based on readiness score and completed simulations in pathway
 */
export function calculatePathwayReadiness(input: ScoringInput, pathwaySimulations: string[]): number {
  const { readinessScore, completedSimulations } = input
  
  const pathwayCompletion = pathwaySimulations.length > 0
    ? completedSimulations.filter(s => pathwaySimulations.includes(s)).length / pathwaySimulations.length
    : 0
  
  const readinessFactor = (readinessScore / 1000) * 70
  const completionFactor = pathwayCompletion * 30
  
  return Math.min(readinessFactor + completionFactor, 100)
}

/**
 * Calculate simulation completion impact
 * Returns the impact of completing a simulation on various metrics
 */
export function calculateSimulationImpact(
  input: ScoringInput,
  simulationId: string,
  simulationScore: number,
  simulationSkills: string[]
): SimulationImpact {
  const scoreFactor = simulationScore / 100
  
  // Readiness impact: 8-25 points based on performance
  const readinessImpact = Math.round(8 + (scoreFactor * 17))
  
  // Employability impact: 2-5 points
  const employabilityImpact = Math.round(2 + (scoreFactor * 3))
  
  // Skill gains for related skills
  const skillGains = simulationSkills.map(skill => ({
    skill,
    gain: Math.round(5 + (scoreFactor * 10))
  }))
  
  // Unlock pathways based on readiness threshold
  const newReadiness = Math.min(input.readinessScore + readinessImpact, 1000)
  const unlockedPathways = calculateUnlockedPathways(newReadiness, input.unlockedPathways || [])
  
  // AI confidence and recommendation strength changes
  const aiConfidenceChange = Math.round(scoreFactor * 5)
  const recommendationStrengthChange = Math.round(scoreFactor * 3)
  
  return {
    readinessImpact,
    employabilityImpact,
    skillGains,
    unlockedPathways,
    aiConfidenceChange,
    recommendationStrengthChange
  }
}

/**
 * Calculate which pathways should be unlocked based on readiness
 */
export function calculateUnlockedPathways(
  readinessScore: number,
  currentlyUnlocked: string[]
): string[] {
  const allPathways = [
    { id: "Machine Learning", threshold: 400 },
    { id: "Backend", threshold: 300 },
    { id: "DevOps", threshold: 500 },
    { id: "Cloud Infrastructure", threshold: 600 },
    { id: "Security", threshold: 700 },
    { id: "AI Systems", threshold: 800 },
  ]
  
  const newlyUnlocked = allPathways
    .filter(p => readinessScore >= p.threshold && !currentlyUnlocked.includes(p.id))
    .map(p => p.id)
  
  return newlyUnlocked
}

/**
 * Calculate milestone completion
 */
export function calculateMilestonesCompleted(
  input: ScoringInput,
  certificationsEarned: number
): number {
  let milestones = 0
  
  // Milestone 1: Complete first simulation
  if (input.simulationsCompleted >= 1) milestones++
  
  // Milestone 2: Reach 500 readiness
  if (input.readinessScore >= 500) milestones++
  
  // Milestone 3: Complete 5 simulations
  if (input.simulationsCompleted >= 5) milestones++
  
  // Milestone 4: Reach 700 readiness
  if (input.readinessScore >= 700) milestones++
  
  // Milestone 5: Earn first certification
  if (certificationsEarned >= 1) milestones++
  
  // Milestone 6: Complete 10 simulations
  if (input.simulationsCompleted >= 10) milestones++
  
  // Milestone 7: Reach 900 readiness
  if (input.readinessScore >= 900) milestones++
  
  // Milestone 8: Unlock advanced pathway
  if (input.unlockedPathways?.includes("AI Systems")) milestones++
  
  return milestones
}

/**
 * Complete scoring calculation
 * Returns all scoring outputs based on input
 */
export function calculateCompleteScoring(
  input: ScoringInput,
  certificationsEarned: number = 0,
  pathwaySimulations: string[] = []
): ScoringOutput {
  return {
    readinessScore: calculateReadinessScore(input),
    employabilityScore: calculateEmployabilityScore(input, certificationsEarned),
    aiConfidence: calculateAIConfidence(input),
    recommendationStrength: calculateRecommendationStrength(input),
    skillMastery: calculateSkillMastery(input),
    pathwayReadiness: calculatePathwayReadiness(input, pathwaySimulations),
    certificationsEarned,
    milestonesCompleted: calculateMilestonesCompleted(input, certificationsEarned)
  }
}
