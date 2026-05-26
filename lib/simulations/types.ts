export interface SkillImpact {
  id: string
  label: string
}

export interface Choice {
  label: string
  score: 0 | 50 | 100
  feedback: string
  nextStep?: string
  consequenceLogs: string[]
  aiConfidenceDelta: number
}

export interface SimulationStep {
  id: string
  title: string
  incidentSummary: string
  logs: string[]
  choices: Choice[]
  sidebarHint: string
  aiConfidenceContext: string
}

export interface ScenarioConfig {
  id: string
  title: string
  severity: string
  briefingSummary: string
  systemAlerts: string[]
  briefingLogs: string[]
  briefingSidebarHint: string
  steps: SimulationStep[]
  recommendedSkills: SkillImpact[]
}

export type SimulationViewPhase =
  | "briefing"
  | "decision"
  | "feedback"
  | "evaluation"

export interface PerformanceTier {
  label: string
  toneClass: string
}

export interface EngineeringEvaluation {
  summary: string
  nextSkill: string
}
