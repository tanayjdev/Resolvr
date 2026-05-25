export interface SimulationDecision {
  id: string

  text: string

  hiddenScore: 0 | 50 | 100

  feedbackText: string

  consequenceText: string
}

export interface SimulationStep {
  id: string

  title: string

  incidentSummary: string

  logs: string[]

  decisions: SimulationDecision[]

  sidebarHint: string
}

export interface ProductionAIIncidentConfig {
  simulationId: string

  title: string

  severity: string

  briefingSummary: string

  systemAlerts: string[]

  briefingLogs: string[]

  briefingSidebarHint: string

  decisionSteps: SimulationStep[]
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
