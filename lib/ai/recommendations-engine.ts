// ============================================================
// Recommendations Engine
// ============================================================
// Generates dynamic recommendations based on user state

import type { UserProgress } from "@/lib/types/user-state"
import type { AIInsights } from "@/context/user-context"
import type { SimulationMemory } from "@/lib/ai/scoring-engine"

export interface Recommendation {
  id: string
  type: "simulation" | "pathway" | "skill" | "certification" | "opportunity"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: string
  impact: string
  actionUrl?: string
}

export interface RecommendationContext {
  progress: UserProgress
  insights: AIInsights
  simulationMemory: SimulationMemory
}

/**
 * Generate dynamic recommendations based on user state
 */
export function generateRecommendations(context: RecommendationContext): Recommendation[] {
  const { progress, insights, simulationMemory } = context
  const recommendations: Recommendation[] = []

  // Behavior-based recommendations based on simulation memory
  if (simulationMemory.totalSimulations >= 3) {
    // Risk profile-based recommendations
    if (simulationMemory.riskProfile === 'aggressive') {
      recommendations.push({
        id: 'risk-training',
        type: 'simulation',
        title: 'Production Stability Training',
        description: 'Your risk tolerance is high. Practice conservative decision-making for production environments.',
        priority: 'high',
        estimatedTime: '45 min',
        impact: 'Improve production readiness'
      })
    } else if (simulationMemory.riskProfile === 'conservative') {
      recommendations.push({
        id: 'risk-growth',
        type: 'simulation',
        title: 'Advanced Scenario Challenges',
        description: 'Your decision patterns are cautious. Try more complex scenarios to build confidence.',
        priority: 'medium',
        estimatedTime: '60 min',
        impact: 'Expand decision-making skills'
      })
    }

    // Pathway affinity-based recommendations
    const topPathway = Object.entries(simulationMemory.pathwayAffinities)
      .sort((a, b) => b[1] - a[1])[0]
    if (topPathway && topPathway[1] > 50) {
      recommendations.push({
        id: `pathway-focus-${topPathway[0]}`,
        type: 'pathway',
        title: `${topPathway[0]} Specialization`,
        description: `Your performance shows strong alignment with ${topPathway[0]}. Deepen this specialization.`,
        priority: 'high',
        estimatedTime: '4-6 weeks',
        impact: 'Career specialization'
      })
    }

    // Strength-based recommendations
    if (simulationMemory.strengths.length > 0) {
      const topStrength = simulationMemory.strengths[0]
      recommendations.push({
        id: `strength-advance-${topStrength}`,
        type: 'skill',
        title: `Advance ${topStrength} Skills`,
        description: `Leverage your ${topStrength} strength in advanced scenarios and certifications.`,
        priority: 'medium',
        estimatedTime: '2-3 weeks',
        impact: 'Specialization'
      })
    }

    // Weakness-based recommendations
    if (simulationMemory.weaknesses.length > 0) {
      const weakness = simulationMemory.weaknesses[0]
      recommendations.push({
        id: `weakness-improve-${weakness}`,
        type: 'skill',
        title: `Improve ${weakness} Skills`,
        description: `Focus on ${weakness} to address performance gaps and improve overall readiness.`,
        priority: 'high',
        estimatedTime: '1-2 weeks',
        impact: 'Balanced skill set'
      })
    }
  }

  // Simulation recommendations based on skills
  if (progress.skills.length > 0) {
    const strongestSkill = progress.skills[0]?.name
    
    if (strongestSkill === "Python" || strongestSkill === "Machine Learning") {
      recommendations.push({
        id: "sim-ml-advanced",
        type: "simulation",
        title: "Advanced ML Simulation",
        description: `Your ${strongestSkill} skills are strong. Try advanced ML model deployment scenarios.`,
        priority: "high",
        estimatedTime: "30 min",
        impact: "+15 readiness"
      })
    }

    if (strongestSkill === "Docker" || strongestSkill === "Kubernetes") {
      recommendations.push({
        id: "sim-devops-advanced",
        type: "simulation",
        title: "DevOps Pipeline Simulation",
        description: `Leverage your ${strongestSkill} expertise in complex CI/CD scenarios.`,
        priority: "high",
        estimatedTime: "45 min",
        impact: "+20 readiness"
      })
    }
  }

  // Pathway recommendations based on readiness
  if (progress.readinessScore >= 500 && !progress.unlockedPathways.includes("DevOps")) {
    recommendations.push({
      id: "path-devops",
      type: "pathway",
      title: "Unlock DevOps Pathway",
      description: "Your readiness score qualifies you for the DevOps career pathway.",
      priority: "high",
      estimatedTime: "2-3 weeks",
      impact: "New career opportunities"
    })
  }

  if (progress.readinessScore >= 700 && !progress.unlockedPathways.includes("Security")) {
    recommendations.push({
      id: "path-security",
      type: "pathway",
      title: "Unlock Security Pathway",
      description: "Advanced security simulations and career opportunities await.",
      priority: "high",
      estimatedTime: "3-4 weeks",
      impact: "Specialized career track"
    })
  }

  if (progress.readinessScore >= 800 && !progress.unlockedPathways.includes("AI Systems")) {
    recommendations.push({
      id: "path-ai-systems",
      type: "pathway",
      title: "Unlock AI Systems Pathway",
      description: "Elite AI systems engineering pathway for top performers.",
      priority: "high",
      estimatedTime: "4-6 weeks",
      impact: "Elite career opportunities"
    })
  }

  // Skill gap recommendations
  if (progress.skills.length < 5) {
    recommendations.push({
      id: "skill-expand",
      type: "skill",
      title: "Expand Your Skill Set",
      description: "Complete more simulations to discover and develop new skills.",
      priority: "medium",
      estimatedTime: "1-2 hours",
      impact: "+3 skills tracked"
    })
  }

  // Certification recommendations
  if (progress.certificationsEarned === 0 && progress.employabilityScore >= 75) {
    recommendations.push({
      id: "cert-first",
      type: "certification",
      title: "Earn Your First Certification",
      description: "Your employability score is excellent. A certification will boost your profile.",
      priority: "medium",
      estimatedTime: "1-3 months",
      impact: "+10 employability"
    })
  }

  if (progress.certificationsEarned === 1 && progress.employabilityScore >= 85) {
    recommendations.push({
      id: "cert-advanced",
      type: "certification",
      title: "Advanced Certification",
      description: "Consider an advanced certification to specialize further.",
      priority: "low",
      estimatedTime: "3-6 months",
      impact: "Specialization"
    })
  }

  // Milestone-based recommendations
  if (progress.simulationsCompleted < 5) {
    recommendations.push({
      id: "milestone-5-sims",
      type: "simulation",
      title: "Complete 5 Simulations",
      description: `You've completed ${progress.simulationsCompleted} simulations. Reach 5 to unlock milestone rewards.`,
      priority: "medium",
      estimatedTime: "2-3 hours",
      impact: "Milestone rewards"
    })
  }

  if (progress.simulationsCompleted >= 5 && progress.simulationsCompleted < 10) {
    recommendations.push({
      id: "milestone-10-sims",
      type: "simulation",
      title: "Complete 10 Simulations",
      description: `You've completed ${progress.simulationsCompleted} simulations. Aim for 10 for expert status.`,
      priority: "low",
      estimatedTime: "5-8 hours",
      impact: "Expert status"
    })
  }

  // Readiness-based recommendations
  if (progress.readinessScore < 500) {
    recommendations.push({
      id: "readiness-boost",
      type: "simulation",
      title: "Boost Your Readiness",
      description: "Focus on completing simulations to reach the 500 readiness milestone.",
      priority: "high",
      estimatedTime: "2-3 hours",
      impact: "Pathway unlocks"
    })
  }

  if (progress.readinessScore >= 500 && progress.readinessScore < 700) {
    recommendations.push({
      id: "readiness-advanced",
      type: "simulation",
      title: "Reach Advanced Level",
      description: "You're at intermediate level. Push to 700 readiness for advanced pathways.",
      priority: "medium",
      estimatedTime: "4-6 hours",
      impact: "Advanced pathways"
    })
  }

  // Opportunity-based recommendations
  if (progress.opportunitiesMatched < 10) {
    recommendations.push({
      id: "opp-increase",
      type: "opportunity",
      title: "Increase Opportunity Matches",
      description: "Complete more simulations to improve your opportunity matching.",
      priority: "medium",
      estimatedTime: "3-5 hours",
      impact: "More job matches"
    })
  }

  // Sort by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Generate skill-specific recommendations
 */
export function generateSkillRecommendations(
  skills: Array<{ name: string; level: number }>
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Find weak skills
  const weakSkills = skills.filter(s => s.level < 50)
  
  weakSkills.forEach(skill => {
    recommendations.push({
      id: `skill-improve-${skill.name}`,
      type: "skill",
      title: `Improve ${skill.name}`,
      description: `Your ${skill.name} level is ${skill.level}. Practice with related simulations.`,
      priority: "medium",
      estimatedTime: "1-2 hours",
      impact: `+10-15 ${skill.name}`
    })
  })

  // Find strong skills to leverage
  const strongSkills = skills.filter(s => s.level >= 80)
  
  strongSkills.forEach(skill => {
    recommendations.push({
      id: `skill-leverage-${skill.name}`,
      type: "skill",
      title: `Leverage ${skill.name}`,
      description: `Your ${skill.name} skills are excellent. Focus on advanced scenarios.`,
      priority: "low",
      estimatedTime: "2-3 hours",
      impact: "Specialization"
    })
  })

  return recommendations
}

/**
 * Generate pathway-specific recommendations
 */
export function generatePathwayRecommendations(
  currentPathway: string,
  unlockedPathways: string[],
  readinessScore: number
): Recommendation[] {
  const recommendations: Recommendation[] = []

  const pathwaySimulations: Record<string, string[]> = {
    "Machine Learning": ["ml-basics", "neural-networks", "model-deployment"],
    "Backend": ["api-design", "database-optimization", "microservices"],
    "DevOps": ["docker-basics", "kubernetes-cluster", "ci-cd-pipeline"],
    "Cloud Infrastructure": ["aws-basics", "azure-fundamentals", "gcp-intro"],
    "Security": ["network-security", "web-security", "penetration-testing"],
    "AI Systems": ["ml-ops", "ai-deployment", "large-scale-ml"]
  }

  // Recommend next simulation in current pathway
  if (currentPathway && pathwaySimulations[currentPathway]) {
    const sims = pathwaySimulations[currentPathway]
    recommendations.push({
      id: `pathway-next-${currentPathway}`,
      type: "simulation",
      title: `Continue ${currentPathway} Pathway`,
      description: `Complete the next simulation in your ${currentPathway} journey.`,
      priority: "high",
      estimatedTime: "30-45 min",
      impact: "Pathway progress"
    })
  }

  // Recommend unlocking new pathways
  const lockedPathways = Object.keys(pathwaySimulations).filter(
    p => !unlockedPathways.includes(p)
  )

  lockedPathways.forEach(pathway => {
    const threshold: Record<string, number> = {
      "Machine Learning": 0,
      "Backend": 0,
      "DevOps": 500,
      "Cloud Infrastructure": 600,
      "Security": 700,
      "AI Systems": 800
    }

    if (readinessScore >= threshold[pathway]) {
      recommendations.push({
        id: `pathway-unlock-${pathway}`,
        type: "pathway",
        title: `Unlock ${pathway} Pathway`,
        description: `Your readiness qualifies you for the ${pathway} pathway.`,
        priority: "medium",
        estimatedTime: "2-4 weeks",
        impact: "New career track"
      })
    }
  })

  return recommendations
}

/**
 * Get personalized recommendation summary
 */
export function getRecommendationSummary(context: RecommendationContext): string {
  const { progress, insights } = context

  if (insights.readinessTrend === "improving") {
    return `Great progress! Your ${insights.strongestSkill} skills are improving. ${insights.recommendedNextAction}`
  }

  if (progress.readinessScore < 500) {
    return "Focus on completing simulations to reach intermediate readiness and unlock new pathways."
  }

  if (progress.readinessScore >= 500 && progress.readinessScore < 700) {
    return "You're making good progress. Continue building skills to unlock advanced pathways."
  }

  if (progress.readinessScore >= 700) {
    return "Excellent readiness! Consider specializing with certifications or advanced pathways."
  }

  return insights.recommendedNextAction
}
