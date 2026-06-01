// ============================================================
// Recommendation Engine
// ============================================================
// This file provides personalized recommendations based on
// the user's persona, skills, progress, and interests.
// ============================================================

import type { CareerTrack, ExperienceLevel, TimeCommitment, PersonaData, Skill } from "@/lib/personas/persona-config"
import type { UserProgress } from "@/lib/types/user-state"

// ============================================================
// Types
// ============================================================

export interface Recommendation {
  id: string
  type: "skill" | "pathway" | "simulation" | "opportunity" | "resource"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: string
  impact: number
  category: string
}

export interface PersonalizedInsight {
  type: "strength" | "weakness" | "opportunity" | "trend"
  title: string
  description: string
  actionable: boolean
  action?: string
}

export interface RecommendationContext {
  persona: PersonaData
  progress: UserProgress
  experienceLevel: ExperienceLevel
  timeCommitment: TimeCommitment
}

// ============================================================
// Recommendation Engine
// ============================================================

export function generateRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Skill recommendations
  const skillRecommendations = generateSkillRecommendations(context)
  recommendations.push(...skillRecommendations)
  
  // Pathway recommendations
  const pathwayRecommendations = generatePathwayRecommendations(context)
  recommendations.push(...pathwayRecommendations)
  
  // Simulation recommendations
  const simulationRecommendations = generateSimulationRecommendations(context)
  recommendations.push(...simulationRecommendations)
  
  // Opportunity recommendations
  const opportunityRecommendations = generateOpportunityRecommendations(context)
  recommendations.push(...opportunityRecommendations)
  
  // Resource recommendations
  const resourceRecommendations = generateResourceRecommendations(context)
  recommendations.push(...resourceRecommendations)
  
  // Sort by priority and impact
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.impact - a.impact
  }).slice(0, 10)
}

export function generatePersonalizedInsights(context: RecommendationContext): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = []
  
  // Strength insights
  const strengthInsights = generateStrengthInsights(context)
  insights.push(...strengthInsights)
  
  // Weakness insights
  const weaknessInsights = generateWeaknessInsights(context)
  insights.push(...weaknessInsights)
  
  // Opportunity insights
  const opportunityInsights = generateOpportunityInsights(context)
  insights.push(...opportunityInsights)
  
  // Trend insights
  const trendInsights = generateTrendInsights(context)
  insights.push(...trendInsights)
  
  return insights
}

// ============================================================
// Skill Recommendations
// ============================================================

function generateSkillRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { persona, progress, experienceLevel } = context
  
  // Find weak skills (below 60%)
  const weakSkills = persona.skills.filter(skill => {
    const userSkill = progress.skills.find(s => s.name === skill.name)
    const level = userSkill ? userSkill.level : skill.level
    return level < 60
  })
  
  // Generate recommendations for weak skills
  weakSkills.slice(0, 3).forEach((skill, index) => {
    recommendations.push({
      id: `skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`,
      type: "skill",
      title: `Improve ${skill.name}`,
      description: `Your ${skill.name} skill is below optimal. Focus on this to boost your overall readiness.`,
      priority: index === 0 ? "high" : "medium",
      estimatedTime: experienceLevel === "beginner" ? "2-3 weeks" : "1-2 weeks",
      impact: 15,
      category: "Skill Development",
    })
  })
  
  // Find skills close to mastery (70-80%)
  const nearMasterySkills = persona.skills.filter(skill => {
    const userSkill = progress.skills.find(s => s.name === skill.name)
    const level = userSkill ? userSkill.level : skill.level
    return level >= 70 && level < 80
  })
  
  // Generate recommendations for near-mastery skills
  nearMasterySkills.slice(0, 2).forEach(skill => {
    recommendations.push({
      id: `skill-mastery-${skill.name.toLowerCase().replace(/\s+/g, '-')}`,
      type: "skill",
      title: `Master ${skill.name}`,
      description: `You're close to mastering ${skill.name}. A little more practice will get you there.`,
      priority: "medium",
      estimatedTime: "1 week",
      impact: 10,
      category: "Skill Mastery",
    })
  })
  
  return recommendations
}

// ============================================================
// Pathway Recommendations
// ============================================================

function generatePathwayRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { persona, timeCommitment } = context
  
  // Get pathways that are not completed
  const incompletePathways = persona.pathways.filter(p => p.progress < 100)
  
  // Sort by progress (focus on pathways with some progress)
  incompletePathways.sort((a, b) => b.progress - a.progress)
  
  // Generate recommendations
  incompletePathways.slice(0, 2).forEach((pathway, index) => {
    const nextStep = pathway.steps.find(s => !s.completed)
    recommendations.push({
      id: `pathway-${pathway.id}`,
      type: "pathway",
      title: `Continue ${pathway.title}`,
      description: nextStep 
        ? `Next step: ${nextStep.title} (${nextStep.duration})`
        : `Continue your progress in ${pathway.title}`,
      priority: index === 0 ? "high" : "medium",
      estimatedTime: timeCommitment === "casual" ? "4-6 weeks" : "2-4 weeks",
      impact: 20,
      category: "Career Pathway",
    })
  })
  
  // If no pathways in progress, recommend starting one
  if (incompletePathways.length === 0 || incompletePathways.every(p => p.progress === 0)) {
    const firstPathway = persona.pathways[0]
    if (firstPathway) {
      recommendations.push({
        id: `pathway-start-${firstPathway.id}`,
        type: "pathway",
        title: `Start ${firstPathway.title}`,
        description: `Begin your journey with ${firstPathway.title}. This will build a strong foundation.`,
        priority: "high",
        estimatedTime: firstPathway.estimatedTime,
        impact: 25,
        category: "Career Pathway",
      })
    }
  }
  
  return recommendations
}

// ============================================================
// Simulation Recommendations
// ============================================================

function generateSimulationRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { persona, progress } = context
  
  // Get available simulations
  const availableSimulations = persona.simulations.filter(s => s.isAvailable)
  
  // Sort by readiness impact
  availableSimulations.sort((a, b) => b.readinessImpact - a.readinessImpact)
  
  // Generate recommendations
  availableSimulations.slice(0, 3).forEach((simulation, index) => {
    recommendations.push({
      id: `simulation-${simulation.id}`,
      type: "simulation",
      title: simulation.title,
      description: simulation.incidentSummary,
      priority: index === 0 ? "high" : "medium",
      estimatedTime: simulation.duration,
      impact: simulation.readinessImpact,
      category: simulation.category,
    })
  })
  
  return recommendations
}

// ============================================================
// Opportunity Recommendations
// ============================================================

function generateOpportunityRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { persona } = context
  
  // Get high-match opportunities
  const highMatchOpportunities = persona.opportunities.filter(o => o.match >= 80)
  
  // Sort by match percentage
  highMatchOpportunities.sort((a, b) => b.match - a.match)
  
  // Generate recommendations
  highMatchOpportunities.slice(0, 2).forEach((opportunity, index) => {
    recommendations.push({
      id: `opportunity-${opportunity.id}`,
      type: "opportunity",
      title: `Apply to ${opportunity.title} at ${opportunity.company}`,
      description: `${opportunity.match}% match with your skills. ${opportunity.aiRanking}.`,
      priority: index === 0 ? "high" : "medium",
      estimatedTime: "1-2 hours",
      impact: 30,
      category: "Career Opportunity",
    })
  })
  
  return recommendations
}

// ============================================================
// Resource Recommendations
// ============================================================

function generateResourceRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { persona, experienceLevel } = context
  
  // Career-specific resources
  const resources: Record<CareerTrack, string[]> = {
    "ai-engineer": [
      "Complete TensorFlow Developer Certificate",
      "Read 'Deep Learning' by Ian Goodfellow",
      "Build an end-to-end ML project",
    ],
    "web-developer": [
      "Complete React Advanced Patterns course",
      "Read 'You Don't Know JS' series",
      "Build a full-stack Next.js application",
    ],
    "cloud-engineer": [
      "Get AWS Solutions Architect certified",
      "Complete Kubernetes Administrator certification",
      "Build a cloud infrastructure project",
    ],
    cybersecurity: [
      "Get CEH or CISSP certified",
      "Practice on HackTheBox platform",
      "Build a home security lab",
    ],
    "data-science": [
      "Complete Kaggle competitions",
      "Read 'Python for Data Analysis'",
      "Build a data visualization portfolio",
    ],
    "product-manager": [
      "Complete Product School courses",
      "Read 'Inspired' by Marty Cagan",
      "Build a product case study",
    ],
  }
  
  const careerResources = resources[persona.id] || []
  
  careerResources.slice(0, 2).forEach((resource, index) => {
    recommendations.push({
      id: `resource-${index}`,
      type: "resource",
      title: resource,
      description: experienceLevel === "beginner" 
        ? "This resource will help build your foundation."
        : "This resource will help you advance your skills.",
      priority: "low",
      estimatedTime: "2-4 weeks",
      impact: 12,
      category: "Learning Resource",
    })
  })
  
  return recommendations
}

// ============================================================
// Insight Generators
// ============================================================

function generateStrengthInsights(context: RecommendationContext): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = []
  const { persona, progress } = context
  
  // Find top skills
  const topSkills = persona.skills
    .map(skill => {
      const userSkill = progress.skills.find(s => s.name === skill.name)
      return { ...skill, level: userSkill ? userSkill.level : skill.level }
    })
    .sort((a, b) => b.level - a.level)
    .slice(0, 2)
  
  topSkills.forEach(skill => {
    insights.push({
      type: "strength",
      title: `Strong in ${skill.name}`,
      description: `Your ${skill.name} skill at ${skill.level}% is a key strength. Leverage this in your career.`,
      actionable: false,
    })
  })
  
  return insights
}

function generateWeaknessInsights(context: RecommendationContext): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = []
  const { persona, progress } = context
  
  // Find weak skills
  const weakSkills = persona.skills
    .map(skill => {
      const userSkill = progress.skills.find(s => s.name === skill.name)
      return { ...skill, level: userSkill ? userSkill.level : skill.level }
    })
    .sort((a, b) => a.level - b.level)
    .slice(0, 2)
  
  weakSkills.forEach(skill => {
    insights.push({
      type: "weakness",
      title: `Improve ${skill.name}`,
      description: `Your ${skill.name} skill at ${skill.level}% needs improvement. Focus on this area.`,
      actionable: true,
      action: `Complete ${skill.name} learning path`,
    })
  })
  
  return insights
}

function generateOpportunityInsights(context: RecommendationContext): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = []
  const { persona } = context
  
  // Check for high-match opportunities
  const highMatchCount = persona.opportunities.filter(o => o.match >= 80).length
  
  if (highMatchCount >= 2) {
    insights.push({
      type: "opportunity",
      title: "Strong Job Market Position",
      description: `You have ${highMatchCount} high-match job opportunities. Your skills are in demand.`,
      actionable: true,
      action: "Review and apply to matched opportunities",
    })
  } else {
    insights.push({
      type: "opportunity",
      title: "Improve Job Match",
      description: "Complete more simulations and pathways to increase your job match percentage.",
      actionable: true,
      action: "Focus on skill development",
    })
  }
  
  return insights
}

function generateTrendInsights(context: RecommendationContext): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = []
  const { progress } = context
  
  // Readiness trend
  if (progress.readinessScore >= 750) {
    insights.push({
      type: "trend",
      title: "Excellent Readiness",
      description: "Your readiness score is excellent. You're well-positioned for career opportunities.",
      actionable: false,
    })
  } else if (progress.readinessScore >= 650) {
    insights.push({
      type: "trend",
      title: "Good Readiness",
      description: "Your readiness score is good. Continue improving to reach excellence.",
      actionable: true,
      action: "Complete more simulations to boost readiness",
    })
  } else {
    insights.push({
      type: "trend",
      title: "Readiness Needs Improvement",
      description: "Your readiness score needs improvement. Focus on skill development.",
      actionable: true,
      action: "Prioritize skill development pathways",
    })
  }
  
  return insights
}

// ============================================================
// Helper Functions
// ============================================================

export function getRecommendationPriority(priority: string): number {
  switch (priority) {
    case "high": return 3
    case "medium": return 2
    case "low": return 1
    default: return 0
  }
}

export function filterRecommendationsByType(
  recommendations: Recommendation[],
  type: Recommendation["type"]
): Recommendation[] {
  return recommendations.filter(r => r.type === type)
}

export function filterRecommendationsByPriority(
  recommendations: Recommendation[],
  priority: Recommendation["priority"]
): Recommendation[] {
  return recommendations.filter(r => r.priority === priority)
}
