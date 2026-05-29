import type { ScenarioConfig } from "@/lib/simulations/types"
import PRODUCTION_AI_INCIDENT from "./production-ai-incident"
import KUBERNETES_REGIONAL_FAILURE from "./k8s-regional-failure"
import CICD_MELTDOWN from "./cicd-meltdown"
import SECURITY_TOKEN_BREACH from "./security-token-breach"
import REC_ENGINE_DRIFT from "./rec-engine-drift"

export interface ScenarioMetadata {
  id: string
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  category: "AI Systems" | "Cloud Infrastructure" | "Security" | "DevOps" | "System Design"
  readinessImpact: number
  incidentSummary: string
  isAvailable: boolean
}

export const SCENARIO_REGISTRY: ScenarioMetadata[] = [
  {
    id: "production-ai-incident",
    title: "Production AI Incident",
    difficulty: "Advanced",
    duration: "15 min",
    category: "AI Systems",
    readinessImpact: 25,
    incidentSummary: "Recommendation engine degrading after model rollout. Spiking latency and collapsing confidence scores.",
    isAvailable: true,
  },
  {
    id: "k8s-regional-failure",
    title: "Kubernetes Regional Failure",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Cloud Infrastructure",
    readinessImpact: 30,
    incidentSummary: "Complete loss of us-east-1 control plane during peak traffic. Cross-region failover failing.",
    isAvailable: true,
  },
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    difficulty: "Intermediate",
    duration: "10 min",
    category: "DevOps",
    readinessImpact: 15,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
    isAvailable: true,
  },
  {
    id: "security-token-breach",
    title: "Security Token Breach",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Security",
    readinessImpact: 35,
    incidentSummary: "GitHub admin token leaked in public repository. Active data exfiltration detected.",
    isAvailable: true,
  },
  {
    id: "rec-engine-drift",
    title: "Recommendation Engine Drift",
    difficulty: "Intermediate",
    duration: "15 min",
    category: "AI Systems",
    readinessImpact: 20,
    incidentSummary: "Slow conversion drop over 72 hours tracked to embedding space drift. Investigate feature pipelines.",
    isAvailable: true,
  },
]

export const getScenarioConfig = (id: string): ScenarioConfig | null => {
  const configs: Record<string, ScenarioConfig> = {
    "production-ai-incident": PRODUCTION_AI_INCIDENT,
    "k8s-regional-failure": KUBERNETES_REGIONAL_FAILURE,
    "cicd-meltdown": CICD_MELTDOWN,
    "security-token-breach": SECURITY_TOKEN_BREACH,
    "rec-engine-drift": REC_ENGINE_DRIFT,
  }
  return configs[id] || null
}
