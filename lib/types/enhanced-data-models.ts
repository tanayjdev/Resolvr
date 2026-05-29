// ============================================================
// Enhanced Data Models for Centralized State Management
// ============================================================

// ============================================================
// Opportunity Types
// ============================================================

export interface Opportunity {
  id: string
  title: string
  company: string
  location: string
  salary: string
  match: number
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead"
  workType: "Remote" | "Hybrid" | "Onsite"
  requiredSkills: string[]
  missingSkills: string[]
  aiRanking: "Top Match" | "High Match" | "Strong Match" | "Good Match" | "Moderate Match"
  posted: string
  postedDate: Date
  whyMatch: string
  readinessAnalysis: {
    score: number
    strengths: string[]
    gaps: string[]
  }
  pathwayAlignment: number
  careerGrowth: string
  recommendedSimulations: string[]
  recommendedResources: Resource[]
  companyOverview: string
  isSaved: boolean
  isApplied: boolean
}

export interface Resource {
  id: string
  title: string
  type: "course" | "article" | "video" | "documentation"
  url: string
  duration?: string
  provider: string
}

export interface OpportunityFilters {
  matchPercentage: number | null
  workType: "Remote" | "Hybrid" | "Onsite" | null
  salaryRange: { min: number; max: number } | null
  roleCategory: string | null
  skills: string[]
  location: string | null
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | null
  postedDate: Date | null
  topMatchesOnly: boolean
  searchQuery: string
}

export interface OpportunitySort {
  by: "match" | "newest" | "salary" | "relevance"
  order: "asc" | "desc"
}

// ============================================================
// Simulation Types
// ============================================================

export interface SimulationStage {
  id: string
  title: string
  description: string
  scenario: string
  options: SimulationOption[]
  aiGuidance: string
  timeLimit?: number
  impactPreview: {
    readiness: number
    confidence: number
    stability: number
  }
}

export interface SimulationOption {
  id: string
  label: string
  description: string
  consequences: {
    readinessDelta: number
    confidenceDelta: number
    stabilityDelta: number
    riskProfileChange: 'conservative' | 'balanced' | 'aggressive' | null
    alignmentEffects: {
      pathwayAffinity: number
      skillGains: string[]
      skillLosses: string[]
    }
  }
  isRecommended: boolean
  aiReasoning: string
}

export interface SimulationConfig {
  id: string
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  category: "AI Systems" | "Cloud Infrastructure" | "Security" | "DevOps" | "System Design"
  readinessImpact: number
  incidentSummary: string
  stages: SimulationStage[]
  skillsTested: string[]
  prerequisites: string[]
  learningObjectives: string[]
  isAvailable: boolean
}

export interface SimulationRun {
  simulationId: string
  currentStageIndex: number
  decisions: SimulationDecision[]
  runningScore: number
  runningConfidence: number
  runningStability: number
  isComplete: boolean
  startTime: Date
  endTime?: Date
}

export interface SimulationDecision {
  stageId: string
  optionId: string
  timestamp: Date
  scoreDelta: number
  confidenceDelta: number
  stabilityDelta: number
  alignmentEffects: {
    pathwayAffinity: number
    skillGains: string[]
    skillLosses: string[]
  }
}

export interface SimulationResult {
  simulationId: string
  score: number
  confidence: number
  stability: number
  readinessGain: number
  skillGains: string[]
  skillLosses: string[]
  pathwayAffinity: number
  recommendations: string[]
  completedAt: Date
}

// ============================================================
// Readiness Types
// ============================================================

export interface ReadinessBreakdown {
  overall: number
  technical: number
  softSkills: number
  domain: number
  confidence: number
  stability: number
}

export interface ReadinessHistory {
  date: Date
  score: number
  event: string
  impact: number
}

export interface ReadinessAnalysis {
  breakdown: ReadinessBreakdown
  strengths: string[]
  weaknesses: string[]
  simulationImpact: number
  confidenceAnalysis: string
  careerPrediction: string
  recommendations: string[]
  history: ReadinessHistory[]
}

// ============================================================
// Skill Types
// ============================================================

export interface EnhancedSkill {
  name: string
  level: number
  category: "Technical" | "Soft" | "Domain"
  demandScore: number
  improvementRate: number
  lastUpdated: Date
  relatedOpportunities: number
  recommendedResources: Resource[]
  recommendedSimulations: string[]
}

export interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  gap: number
  industryDemand: number
  estimatedImprovementTime: string
  recommendedActions: string[]
}

export interface SkillGapAnalysis {
  missingSkills: SkillGap[]
  recommendedLearningPath: LearningPathStep[]
  simulationsToImprove: string[]
  industryDemandScore: number
  estimatedImprovementTimeline: string
  aiActionPlan: string
}

export interface LearningPathStep {
  order: number
  skill: string
  resource: Resource
  simulation?: string
  estimatedTime: string
}

// ============================================================
// Pathway Types
// ============================================================

export interface PathwayMilestone {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  completionCriteria: string[]
  progress: number
  isCompleted: boolean
  estimatedCompletion: Date
  aiInsights: string
  recommendedResources: Resource[]
  recommendedSimulations: string[]
}

export interface PathwayProgress {
  pathwayId: string
  currentStage: string
  milestones: PathwayMilestone[]
  overallProgress: number
  estimatedCompletion: Date
  specializations: string[]
  careerGoals: string[]
}

// ============================================================
// AI Insights Types
// ============================================================

export interface AIInsight {
  type: "readiness" | "skill" | "opportunity" | "pathway" | "general"
  title: string
  content: string
  confidence: number
  timestamp: Date
  actionable: boolean
  relatedData?: any
}

export interface AIRecommendation {
  type: "simulation" | "learning" | "opportunity" | "pathway"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  reasoning: string
  expectedImpact: string
  actionItems: string[]
  relatedId?: string
}

// ============================================================
// Notification Types
// ============================================================

export interface Notification {
  id: string
  type: "simulation" | "opportunity" | "readiness" | "pathway" | "system"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  priority: "high" | "medium" | "low"
}

// ============================================================
// User Preferences Types
// ============================================================

export interface UserPreferences {
  careerGoals: string[]
  skillFocus: string[]
  preferredTechnologies: string[]
  industryPreferences: string[]
  learningPace: "intensive" | "moderate" | "relaxed"
  specialization: string
  notifications: {
    opportunities: boolean
    simulations: boolean
    readiness: boolean
    pathway: boolean
  }
}
