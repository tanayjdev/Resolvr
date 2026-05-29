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
  pathwayAlignmentChanges: Record<string, number>
}

export interface DecisionScore {
  baseScore: number
  riskFactor: number
  stabilityImpact: number
  pathwayAlignment: Record<string, number>
  confidenceImpact: number
  consequences: string[]
}

export interface SimulationMemory {
  totalSimulations: number
  averageScore: number
  strengths: string[]
  weaknesses: string[]
  riskProfile: 'conservative' | 'balanced' | 'aggressive'
  pathwayAffinities: Record<string, number>
  lastSimulationId: string | null
  lastSimulationScore: number
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
  
  // Readiness impact: 8-25 points based on performance quality
  // High quality (90-100): 20-25 points
  // Average (70-89): 12-19 points
  // Low quality (40-69): 5-11 points
  // Poor (0-39): 1-4 points
  let readinessImpact: number
  if (simulationScore >= 90) {
    readinessImpact = Math.round(20 + ((simulationScore - 90) / 10) * 5)
  } else if (simulationScore >= 70) {
    readinessImpact = Math.round(12 + ((simulationScore - 70) / 20) * 7)
  } else if (simulationScore >= 40) {
    readinessImpact = Math.round(5 + ((simulationScore - 40) / 30) * 6)
  } else {
    readinessImpact = Math.round(1 + (simulationScore / 40) * 3)
  }
  
  // Employability impact: 2-8 points based on performance quality
  let employabilityImpact: number
  if (simulationScore >= 90) {
    employabilityImpact = Math.round(6 + ((simulationScore - 90) / 10) * 2)
  } else if (simulationScore >= 70) {
    employabilityImpact = Math.round(4 + ((simulationScore - 70) / 20) * 2)
  } else if (simulationScore >= 40) {
    employabilityImpact = Math.round(2 + ((simulationScore - 40) / 30) * 2)
  } else {
    employabilityImpact = Math.round(1 + (simulationScore / 40))
  }
  
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
  
  // Calculate pathway alignment changes based on simulation type and performance
  const pathwayAlignmentChanges = calculatePathwayAlignment(simulationId, simulationScore, simulationSkills)
  
  return {
    readinessImpact,
    employabilityImpact,
    skillGains,
    unlockedPathways,
    aiConfidenceChange,
    recommendationStrengthChange,
    pathwayAlignmentChanges
  }
}

/**
 * Calculate pathway alignment changes based on simulation type and performance
 */
function calculatePathwayAlignment(
  simulationId: string,
  simulationScore: number,
  simulationSkills: string[]
): Record<string, number> {
  const scoreFactor = simulationScore / 100
  const alignmentChanges: Record<string, number> = {}
  
  // Determine pathway alignment based on simulation skills
  const pathwaySkillMap: Record<string, string[]> = {
    'Machine Learning': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Infrastructure'],
    'Cloud Infrastructure': ['AWS', 'Azure', 'GCP', 'Cloud', 'Infrastructure'],
    'Security': ['Security', 'Penetration Testing', 'Network Security', 'Cybersecurity'],
    'Backend': ['Node.js', 'Python', 'Java', 'API', 'Database'],
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'CSS', 'UI']
  }
  
  // Calculate alignment for each pathway based on skills used
  Object.entries(pathwaySkillMap).forEach(([pathway, skills]) => {
    const matchingSkills = simulationSkills.filter(skill => 
      skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))
    )
    
    if (matchingSkills.length > 0) {
      alignmentChanges[pathway] = Math.round(matchingSkills.length * 5 * scoreFactor)
    }
  })
  
  return alignmentChanges
}

/**
 * Calculate weighted decision score based on decision quality
 */
export function calculateDecisionScore(
  decisionType: 'safe' | 'risky' | 'reckless' | 'optimal',
  context: 'production' | 'development' | 'emergency'
): DecisionScore {
  const baseScores = {
    safe: { base: 75, risk: 0.1, stability: 10, confidence: 5 },
    risky: { base: 60, risk: 0.5, stability: 0, confidence: -5 },
    reckless: { base: 30, risk: 0.9, stability: -15, confidence: -15 },
    optimal: { base: 95, risk: 0.05, stability: 15, confidence: 10 }
  }
  
  const config = baseScores[decisionType]
  const contextMultiplier = context === 'production' ? 1.2 : context === 'emergency' ? 0.8 : 1.0
  
  const consequences: string[] = []
  if (decisionType === 'reckless') {
    consequences.push('System instability risk increased')
    consequences.push('Recovery steps added')
  }
  if (decisionType === 'risky') {
    consequences.push('Moderate risk to system stability')
  }
  if (decisionType === 'optimal') {
    consequences.push('Excellent decision pattern')
  }
  
  return {
    baseScore: Math.round(config.base * contextMultiplier),
    riskFactor: config.risk,
    stabilityImpact: config.stability,
    pathwayAlignment: calculateDecisionPathwayAlignment(decisionType),
    confidenceImpact: config.confidence,
    consequences
  }
}

/**
 * Calculate pathway alignment for a specific decision
 */
function calculateDecisionPathwayAlignment(decisionType: string): Record<string, number> {
  const alignments: Record<string, Record<string, number>> = {
    safe: {
      'DevOps': 5,
      'Cloud Infrastructure': 5,
      'Security': 3
    },
    risky: {
      'Machine Learning': 2,
      'Backend': 2
    },
    reckless: {
      'Security': -5,
      'DevOps': -3
    },
    optimal: {
      'Machine Learning': 8,
      'DevOps': 8,
      'Cloud Infrastructure': 7,
      'Security': 6
    }
  }
  
  return alignments[decisionType] || {}
}

/**
 * Update simulation memory with new performance data
 */
export function updateSimulationMemory(
  currentMemory: SimulationMemory,
  simulationId: string,
  simulationScore: number,
  skills: string[]
): SimulationMemory {
  const totalSimulations = currentMemory.totalSimulations + 1
  const averageScore = Math.round(
    ((currentMemory.averageScore * currentMemory.totalSimulations) + simulationScore) / totalSimulations
  )
  
  // Update strengths and weaknesses based on performance
  const newStrengths = [...currentMemory.strengths]
  const newWeaknesses = [...currentMemory.weaknesses]
  
  if (simulationScore >= 85) {
    skills.forEach(skill => {
      if (!newStrengths.includes(skill)) {
        newStrengths.push(skill)
      }
      // Remove from weaknesses if present
      const weaknessIndex = newWeaknesses.indexOf(skill)
      if (weaknessIndex > -1) {
        newWeaknesses.splice(weaknessIndex, 1)
      }
    })
  } else if (simulationScore < 60) {
    skills.forEach(skill => {
      if (!newWeaknesses.includes(skill)) {
        newWeaknesses.push(skill)
      }
    })
  }
  
  // Update risk profile based on recent performance
  let riskProfile: 'conservative' | 'balanced' | 'aggressive' = currentMemory.riskProfile
  if (totalSimulations >= 3) {
    const recentScores = [currentMemory.lastSimulationScore, simulationScore]
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    
    if (avgRecent >= 85) {
      riskProfile = 'aggressive'
    } else if (avgRecent >= 65) {
      riskProfile = 'balanced'
    } else {
      riskProfile = 'conservative'
    }
  }
  
  // Update pathway affinities
  const newAffinities = { ...currentMemory.pathwayAffinities }
  skills.forEach(skill => {
    const pathway = determineSkillPathway(skill)
    if (pathway) {
      newAffinities[pathway] = (newAffinities[pathway] || 0) + Math.round(simulationScore / 10)
    }
  })
  
  return {
    totalSimulations,
    averageScore,
    strengths: newStrengths,
    weaknesses: newWeaknesses,
    riskProfile,
    pathwayAffinities: newAffinities,
    lastSimulationId: simulationId,
    lastSimulationScore: simulationScore
  }
}

/**
 * Determine which pathway a skill belongs to
 */
function determineSkillPathway(skill: string): string | null {
  const pathwayMap: Record<string, string> = {
    'Python': 'Machine Learning',
    'Machine Learning': 'Machine Learning',
    'TensorFlow': 'Machine Learning',
    'PyTorch': 'Machine Learning',
    'Docker': 'DevOps',
    'Kubernetes': 'DevOps',
    'CI/CD': 'DevOps',
    'Linux': 'DevOps',
    'AWS': 'Cloud Infrastructure',
    'Azure': 'Cloud Infrastructure',
    'GCP': 'Cloud Infrastructure',
    'Security': 'Security',
    'Penetration Testing': 'Security',
    'Network Security': 'Security',
    'Node.js': 'Backend',
    'Java': 'Backend',
    'API': 'Backend',
    'Database': 'Backend',
    'React': 'Frontend',
    'JavaScript': 'Frontend',
    'TypeScript': 'Frontend',
    'CSS': 'Frontend'
  }
  
  return pathwayMap[skill] || null
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
