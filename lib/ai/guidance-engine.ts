// ============================================================
// AI Guidance Engine
// ============================================================
// Generates dynamic guidance messages based on user state

import type { UserProgress } from "@/lib/types/user-state"
import type { AIInsights } from "@/context/user-context"

export interface GuidanceMessage {
  id: string
  type: "achievement" | "recommendation" | "milestone" | "unlock" | "improvement"
  title: string
  message: string
  priority: "high" | "medium" | "low"
  timestamp: number
}

export interface GuidanceContext {
  progress: UserProgress
  insights: AIInsights
  recentSimulationId?: string
  recentSimulationScore?: number
}

/**
 * Generate dynamic guidance messages based on user state
 */
export function generateGuidance(context: GuidanceContext): GuidanceMessage[] {
  const messages: GuidanceMessage[] = []
  const { progress, insights, recentSimulationId, recentSimulationScore } = context

  // Achievement messages
  if (recentSimulationScore && recentSimulationScore >= 90) {
    messages.push({
      id: `sim-excellent-${Date.now()}`,
      type: "achievement",
      title: "Excellent Performance!",
      message: `You scored ${recentSimulationScore} on the simulation. Your ${insights.strongestSkill} skills are exceptional.`,
      priority: "high",
      timestamp: Date.now()
    })
  }

  // Milestone messages
  if (progress.milestonesCompleted > 0) {
    const milestoneMessages = [
      "First simulation completed! You're on your way.",
      "Readiness reached 500! Great progress.",
      "5 simulations completed! Building momentum.",
      "Readiness reached 700! Advanced level unlocked.",
      "First certification earned! Impressive achievement.",
      "10 simulations completed! Dedicated learner.",
      "Readiness reached 900! Expert level.",
      "AI Systems pathway unlocked! Elite status."
    ]
    
    const milestoneIndex = Math.min(progress.milestonesCompleted - 1, milestoneMessages.length - 1)
    if (milestoneIndex >= 0) {
      messages.push({
        id: `milestone-${progress.milestonesCompleted}`,
        type: "milestone",
        title: "Milestone Achieved",
        message: milestoneMessages[milestoneIndex],
        priority: "high",
        timestamp: Date.now()
      })
    }
  }

  // Unlock messages
  const newlyUnlocked = progress.unlockedPathways.filter(p => 
    p !== "Machine Learning" && p !== "Backend" // Exclude default pathways
  )
  
  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach(pathway => {
      messages.push({
        id: `unlock-${pathway}`,
        type: "unlock",
        title: "New Pathway Unlocked",
        message: `You've unlocked the ${pathway} pathway! Advanced simulations are now available.`,
        priority: "high",
        timestamp: Date.now()
      })
    })
  }

  // Improvement messages
  if (insights.readinessTrend === "improving") {
    messages.push({
      id: `trend-improving-${Date.now()}`,
      type: "improvement",
      title: "Performance Trending Up",
      message: "Your recent simulation performance shows consistent improvement. Keep up the great work!",
      priority: "medium",
      timestamp: Date.now()
    })
  }

  // Recommendation messages
  if (progress.readinessScore >= 500 && !progress.unlockedPathways.includes("DevOps")) {
    messages.push({
      id: `rec-devops-${Date.now()}`,
      type: "recommendation",
      title: "DevOps Pathway Available",
      message: "With your current readiness, you're ready to tackle DevOps simulations. Unlock it now!",
      priority: "medium",
      timestamp: Date.now()
    })
  }

  if (progress.readinessScore >= 700 && !progress.unlockedPathways.includes("Security")) {
    messages.push({
      id: `rec-security-${Date.now()}`,
      type: "recommendation",
      title: "Security Pathway Available",
      message: "Your skills are strong enough for Security simulations. Consider this pathway.",
      priority: "medium",
      timestamp: Date.now()
    })
  }

  if (progress.certificationsEarned === 0 && progress.employabilityScore >= 80) {
    messages.push({
      id: `rec-cert-${Date.now()}`,
      type: "recommendation",
      title: "Certification Opportunity",
      message: "Your employability score is excellent. Earning a certification could boost your profile further.",
      priority: "low",
      timestamp: Date.now()
    })
  }

  // Skill-specific messages
  if (insights.strongestSkill !== "None") {
    messages.push({
      id: `skill-strong-${Date.now()}`,
      type: "achievement",
      title: "Strong Skill Identified",
      message: `Your strongest skill is ${insights.strongestSkill}. Leverage this in your career path.`,
      priority: "low",
      timestamp: Date.now()
    })
  }

  if (insights.weakestSkill !== "None" && insights.weakestSkill !== insights.strongestSkill) {
    messages.push({
      id: `skill-weak-${Date.now()}`,
      type: "recommendation",
      title: "Growth Opportunity",
      message: `Consider improving your ${insights.weakestSkill} skills to become more well-rounded.`,
      priority: "low",
      timestamp: Date.now()
    })
  }

  // Sort by priority and timestamp
  return messages.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.timestamp - a.timestamp
  })
}

/**
 * Generate a specific guidance message for simulation completion
 */
export function generateSimulationCompletionMessage(
  simulationId: string,
  score: number,
  readinessIncrease: number,
  unlockedPathways: string[]
): GuidanceMessage {
  let title = "Simulation Completed"
  let message = `You completed the simulation with a score of ${score}.`
  
  if (score >= 90) {
    title = "Outstanding Performance!"
    message = `Exceptional work! You scored ${score} and gained +${readinessIncrease} readiness.`
  } else if (score >= 75) {
    title = "Great Performance"
    message = `Well done! You scored ${score} and gained +${readinessIncrease} readiness.`
  } else if (score >= 60) {
    title = "Good Performance"
    message = `Nice work! You scored ${score} and gained +${readinessIncrease} readiness. Keep practicing!`
  } else {
    title = "Simulation Completed"
    message = `You scored ${score}. Review the feedback and try again to improve.`
  }

  if (unlockedPathways.length > 0) {
    message += ` Unlocked: ${unlockedPathways.join(", ")}.`
  }

  return {
    id: `sim-complete-${simulationId}-${Date.now()}`,
    type: "achievement",
    title,
    message,
    priority: score >= 75 ? "high" : "medium",
    timestamp: Date.now()
  }
}

/**
 * Generate pathway-specific guidance
 */
export function generatePathwayGuidance(
  pathway: string,
  progress: number
): GuidanceMessage {
  const messages: Record<string, { title: string; message: string }> = {
    "Machine Learning": {
      title: "ML Pathway Progress",
      message: `You're ${progress}% through the ML pathway. Focus on Python and algorithms.`
    },
    "Backend": {
      title: "Backend Pathway Progress",
      message: `You're ${progress}% through the Backend pathway. Database and API skills are key.`
    },
    "DevOps": {
      title: "DevOps Pathway Progress",
      message: `You're ${progress}% through the DevOps pathway. Docker and Kubernetes are essential.`
    },
    "Cloud Infrastructure": {
      title: "Cloud Pathway Progress",
      message: `You're ${progress}% through the Cloud pathway. AWS/Azure skills are in high demand.`
    },
    "Security": {
      title: "Security Pathway Progress",
      message: `You're ${progress}% through the Security pathway. Network security is critical.`
    },
    "AI Systems": {
      title: "AI Systems Pathway Progress",
      message: `You're ${progress}% through the AI Systems pathway. Advanced ML techniques await.`
    }
  }

  const guidance = messages[pathway] || {
    title: "Pathway Progress",
    message: `You're ${progress}% through this pathway. Keep going!`
  }

  return {
    id: `pathway-${pathway}-${Date.now()}`,
    type: "recommendation",
    title: guidance.title,
    message: guidance.message,
    priority: "medium",
    timestamp: Date.now()
  }
}

/**
 * Generate readiness milestone guidance
 */
export function generateReadinessMilestone(currentReadiness: number, previousReadiness: number): GuidanceMessage | null {
  const milestones = [
    { threshold: 500, title: "Readiness Milestone: Intermediate", message: "You've reached intermediate readiness! More pathways are now available." },
    { threshold: 700, title: "Readiness Milestone: Advanced", message: "Advanced readiness achieved! You're ready for complex simulations." },
    { threshold: 900, title: "Readiness Milestone: Expert", message: "Expert readiness! Elite pathways and opportunities await." }
  ]

  for (const milestone of milestones) {
    if (previousReadiness < milestone.threshold && currentReadiness >= milestone.threshold) {
      return {
        id: `readiness-milestone-${milestone.threshold}-${Date.now()}`,
        type: "milestone",
        title: milestone.title,
        message: milestone.message,
        priority: "high",
        timestamp: Date.now()
      }
    }
  }

  return null
}
