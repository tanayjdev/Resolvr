// ============================================================
// Simulation Engine Architecture
// ============================================================

import type {
  SimulationConfig,
  SimulationStage,
  SimulationOption,
  SimulationRun,
  SimulationDecision,
  SimulationResult,
} from "@/lib/types/enhanced-data-models"

// ============================================================
// Simulation Engine
// ============================================================

export class SimulationEngine {
  private run: SimulationRun
  private config: SimulationConfig

  constructor(config: SimulationConfig) {
    this.config = config
    this.run = {
      simulationId: config.id,
      currentStageIndex: 0,
      decisions: [],
      runningScore: 0,
      runningConfidence: 0,
      runningStability: 0,
      isComplete: false,
      startTime: new Date(),
    }
  }

  // Get current stage
  getCurrentStage(): SimulationStage | null {
    if (this.run.currentStageIndex >= this.config.stages.length) {
      return null
    }
    return this.config.stages[this.run.currentStageIndex]
  }

  // Make a decision
  makeDecision(optionId: string): SimulationDecision {
    const currentStage = this.getCurrentStage()
    if (!currentStage) {
      throw new Error("No current stage available")
    }

    const option = currentStage.options.find((opt) => opt.id === optionId)
    if (!option) {
      throw new Error(`Option ${optionId} not found in current stage`)
    }

    const decision: SimulationDecision = {
      stageId: currentStage.id,
      optionId,
      timestamp: new Date(),
      scoreDelta: option.consequences.readinessDelta,
      confidenceDelta: option.consequences.confidenceDelta,
      stabilityDelta: option.consequences.stabilityDelta,
      alignmentEffects: option.consequences.alignmentEffects,
    }

    // Update run state
    this.run.decisions.push(decision)
    this.run.runningScore += decision.scoreDelta
    this.run.runningConfidence += decision.confidenceDelta
    this.run.runningStability += decision.stabilityDelta
    this.run.currentStageIndex++

    // Check if complete
    if (this.run.currentStageIndex >= this.config.stages.length) {
      this.run.isComplete = true
      this.run.endTime = new Date()
    }

    return decision
  }

  // Get current run state
  getRunState(): SimulationRun {
    return { ...this.run }
  }

  // Calculate final result
  getResult(): SimulationResult {
    if (!this.run.isComplete) {
      throw new Error("Simulation is not complete")
    }

    const totalScore = this.run.runningScore
    const maxPossibleScore = this.config.stages.length * 20 // Assuming max 20 points per decision
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100)

    // Calculate skill gains/losses from decisions
    const skillGains = new Set<string>()
    const skillLosses = new Set<string>()

    this.run.decisions.forEach((decision) => {
      decision.alignmentEffects.skillGains.forEach((skill) => skillGains.add(skill))
      decision.alignmentEffects.skillLosses.forEach((skill) => skillLosses.add(skill))
    })

    // Calculate pathway affinity
    const pathwayAffinity = this.run.decisions.reduce(
      (sum, decision) => sum + decision.alignmentEffects.pathwayAffinity,
      0
    )

    // Calculate readiness gain
    const readinessGain = Math.round(normalizedScore * (this.config.readinessImpact / 100))

    // Generate recommendations based on performance
    const recommendations = this.generateRecommendations(normalizedScore)

    return {
      simulationId: this.config.id,
      score: normalizedScore,
      confidence: this.run.runningConfidence,
      stability: this.run.runningStability,
      readinessGain,
      skillGains: Array.from(skillGains),
      skillLosses: Array.from(skillLosses),
      pathwayAffinity,
      recommendations,
      completedAt: this.run.endTime || new Date(),
    }
  }

  // Generate AI recommendations based on performance
  private generateRecommendations(score: number): string[] {
    const recommendations: string[] = []

    if (score >= 80) {
      recommendations.push("Excellent decision-making under pressure")
      recommendations.push("Consider more complex incident scenarios")
    } else if (score >= 60) {
      recommendations.push("Good performance, focus on response time")
      recommendations.push("Review documentation for similar incidents")
    } else if (score >= 40) {
      recommendations.push("Practice incident response procedures")
      recommendations.push("Study system architecture dependencies")
    } else {
      recommendations.push("Complete foundational training modules")
      recommendations.push("Review incident response best practices")
    }

    return recommendations
  }

  // Reset simulation
  reset(): void {
    this.run = {
      simulationId: this.config.id,
      currentStageIndex: 0,
      decisions: [],
      runningScore: 0,
      runningConfidence: 0,
      runningStability: 0,
      isComplete: false,
      startTime: new Date(),
    }
  }

  // Get progress percentage
  getProgress(): number {
    return Math.round((this.run.currentStageIndex / this.config.stages.length) * 100)
  }

  // Check if simulation is complete
  isComplete(): boolean {
    return this.run.isComplete
  }
}

// ============================================================
// Simulation Factory
// ============================================================

export class SimulationFactory {
  static createEngine(config: SimulationConfig): SimulationEngine {
    return new SimulationEngine(config)
  }

  static validateConfig(config: SimulationConfig): boolean {
    if (!config.id || !config.title) {
      return false
    }

    if (!config.stages || config.stages.length === 0) {
      return false
    }

    for (const stage of config.stages) {
      if (!stage.id || !stage.title || !stage.options || stage.options.length === 0) {
        return false
      }

      for (const option of stage.options) {
        if (!option.id || !option.label) {
          return false
        }
      }
    }

    return true
  }
}

// ============================================================
// Simulation Utilities
// ============================================================

export class SimulationUtils {
  static calculateDifficultyMultiplier(difficulty: string): number {
    const multipliers: Record<string, number> = {
      Beginner: 0.8,
      Intermediate: 1.0,
      Advanced: 1.2,
    }
    return multipliers[difficulty] || 1.0
  }

  static estimateDuration(config: SimulationConfig): number {
    // Estimate in minutes based on stages and difficulty
    const baseTime = config.stages.length * 2 // 2 minutes per stage
    const multiplier = this.calculateDifficultyMultiplier(config.difficulty)
    return Math.round(baseTime * multiplier)
  }

  static getSkillsTested(config: SimulationConfig): string[] {
    const skills = new Set<string>()
    
    config.stages.forEach((stage) => {
      stage.options.forEach((option) => {
        option.consequences.alignmentEffects.skillGains.forEach((skill) => skills.add(skill))
      })
    })

    return Array.from(skills)
  }

  static generatePreview(config: SimulationConfig): {
    stages: number
    estimatedDuration: number
    skillsTested: string[]
    maxScore: number
  } {
    return {
      stages: config.stages.length,
      estimatedDuration: this.estimateDuration(config),
      skillsTested: this.getSkillsTested(config),
      maxScore: config.stages.length * 20,
    }
  }
}
