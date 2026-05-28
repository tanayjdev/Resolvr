// ============================================================
// lib/simulation/mock-data.ts
// Static arrays, seed data, and constants for Resolvr
// ============================================================

import type {
  LogEntry,
  AIFeedback,
  IncidentSnapshot,
  NodeStatus,
  ProgressStep,
  TerminalHistoryLine,
} from "./types"

// ─── Progress Steps ───────────────────────────────────────────────────────────

export const PROGRESS_STEPS: ProgressStep[] = [
  { id: "identify", label: "Identify", number: 1 },
  { id: "diagnose", label: "Diagnose", number: 2 },
  { id: "resolve", label: "Resolve", number: 3 },
  { id: "document", label: "Document", number: 4 },
]

// ─── Seed Logs ────────────────────────────────────────────────────────────────

export const SEED_LOGS: LogEntry[] = [
  {
    id: "1",
    timestamp: "14:23:01",
    level: "critical",
    message: "Node node-east-1a: connection timeout after 30s",
  },
  {
    id: "2",
    timestamp: "14:23:02",
    level: "critical",
    message: "Node node-east-1b: connection timeout after 30s",
  },
  {
    id: "3",
    timestamp: "14:23:03",
    level: "critical",
    message: "Node node-east-1c: connection timeout after 30s",
  },
  {
    id: "4",
    timestamp: "14:23:15",
    level: "warning",
    message: "Load balancer health check failed for 3 targets",
  },
  {
    id: "5",
    timestamp: "14:23:18",
    level: "warning",
    message: "Retry storm detected: 847 retries/sec",
  },
  {
    id: "6",
    timestamp: "14:23:25",
    level: "info",
    message: "Circuit breaker triggered for service auth-api",
  },
  {
    id: "7",
    timestamp: "14:23:30",
    level: "info",
    message: "Failover initiated to us-west-2 region",
  },
  {
    id: "8",
    timestamp: "14:23:45",
    level: "success",
    message: "Partial recovery: 2 services restored",
  },
  {
    id: "9",
    timestamp: "14:24:01",
    level: "warning",
    message: "Database connection pool exhausted",
  },
  {
    id: "10",
    timestamp: "14:24:15",
    level: "info",
    message: "Auto-scaling triggered: adding 2 nodes",
  },
]

// ─── Seed Feedback ────────────────────────────────────────────────────────────

export const SEED_FEEDBACK: AIFeedback[] = [
  {
    id: "1",
    type: "correct",
    message: "Correct identification of node failures in us-east-1 region",
    createdAt: Date.now() - 120_000,
  },
  {
    id: "2",
    type: "correct",
    message: "Good use of kubectl to verify cluster state",
    createdAt: Date.now() - 90_000,
  },
  {
    id: "3",
    type: "warning",
    message: "Missed: Check load balancer health status before proceeding",
    createdAt: Date.now() - 60_000,
  },
  {
    id: "4",
    type: "hint",
    message:
      "Consider checking CloudWatch metrics for network connectivity issues",
    createdAt: Date.now() - 30_000,
  },
]

// ─── Seed Terminal History ─────────────────────────────────────────────────────

export const SEED_TERMINAL_HISTORY: TerminalHistoryLine[] = [
  { text: "operator@resolvr:~$ kubectl get nodes", variant: "primary" },
  {
    text: "NAME           STATUS     ROLES    AGE   VERSION",
    variant: "muted",
  },
  {
    text: "node-east-1a   NotReady   worker   45d   v1.28.2",
    variant: "error",
  },
  {
    text: "node-east-1b   NotReady   worker   45d   v1.28.2",
    variant: "error",
  },
  {
    text: "node-east-1c   NotReady   worker   45d   v1.28.2",
    variant: "error",
  },
  {
    text: "node-west-2a   Ready      worker   45d   v1.28.2",
    variant: "success",
  },
  { text: "operator@resolvr:~$ ", variant: "primary", isPrompt: true },
]

// ─── Seed Incident ────────────────────────────────────────────────────────────

export const SEED_NODES: NodeStatus[] = [
  {
    name: "node-east-1a",
    status: "NotReady",
    role: "worker",
    age: "45d",
    version: "v1.28.2",
  },
  {
    name: "node-east-1b",
    status: "NotReady",
    role: "worker",
    age: "45d",
    version: "v1.28.2",
  },
  {
    name: "node-east-1c",
    status: "NotReady",
    role: "worker",
    age: "45d",
    version: "v1.28.2",
  },
  {
    name: "node-west-2a",
    status: "Ready",
    role: "worker",
    age: "45d",
    version: "v1.28.2",
  },
]

export const SEED_INCIDENT: IncidentSnapshot = {
  state: "active",
  affectedNodes: SEED_NODES,
  latencyMs: 800,
  errorRatePercent: 47,
  affectedServices: 12,
  retriesPerSec: 847,
  circuitBreakersOpen: ["auth-api", "payment-service"],
  recoveredServices: 2,
  escalationLevel: 1,
}

// ─── Dynamic Log Pool (for live simulation) ───────────────────────────────────

export const LIVE_LOG_POOL: Omit<LogEntry, "id" | "timestamp">[] = [
  { level: "info", message: "Health check passed for node-west-2a" },
  { level: "warning", message: "Memory pressure detected on node-west-2a" },
  { level: "info", message: "Service mesh sidecar restarted" },
  { level: "info", message: "Metrics collection resumed" },
  { level: "success", message: "Cache invalidation completed" },
  { level: "warning", message: "Replica set degraded: 2/3 pods running" },
  { level: "info", message: "Etcd leader election in progress" },
  { level: "critical", message: "Persistent volume claim binding timeout" },
  { level: "warning", message: "Horizontal pod autoscaler at max replicas" },
  { level: "success", message: "DNS resolution restored for internal services" },
]

// ─── Escalation Log Pool ──────────────────────────────────────────────────────

export const ESCALATION_LOG_POOL: Omit<LogEntry, "id" | "timestamp">[] = [
  {
    level: "critical",
    message: "ESCALATION: Database primary node unreachable",
  },
  { level: "critical", message: "ESCALATION: API gateway circuit breaker open" },
  {
    level: "critical",
    message: "ESCALATION: SLA breach imminent — 8min remaining",
  },
  {
    level: "warning",
    message: "ESCALATION: Cross-region failover bandwidth saturated",
  },
]

// ─── Suggested Next Actions ───────────────────────────────────────────────────

export const SUGGESTED_ACTIONS = [
  "Check node event logs",
  "Verify network connectivity",
  "Inspect kubelet service status",
  "Review cloud provider AZ health",
  "Drain and cordon affected nodes",
] as const

export type SuggestedAction = (typeof SUGGESTED_ACTIONS)[number]
