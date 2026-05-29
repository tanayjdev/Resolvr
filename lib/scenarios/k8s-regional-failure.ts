import type { ScenarioConfig } from "@/lib/simulations/types"
import type { AlignmentEffects } from "@/lib/simulations/types"

const KUBERNETES_REGIONAL_FAILURE: ScenarioConfig = {
  id: "k8s-regional-failure",
  title: "Kubernetes Regional Failure",
  severity: "P0 — Critical",
  briefingSummary:
    "Complete loss of us-east-1 control plane during peak traffic. Cross-region failover failing. Etcd cluster has lost quorum due to network partition.",
  systemAlerts: [
    "ALERT: us-east-1 control plane unresponsive",
    "ALERT: etcd quorum lost - 2/3 nodes unreachable",
    "ALERT: cross-region failover failing",
    "ALERT: 95th percentile latency at 8s",
    "ALERT: error rate at 40%",
  ],
  briefingLogs: [
    "[09:15:02] k8s-api-server | ERROR connection timeout to etcd cluster",
    "[09:15:05] etcd-monitor | CRITICAL quorum lost - only 1/3 nodes reachable",
    "[09:15:09] dns-service | WARN failover to us-west-2 failing health checks",
    "[09:15:14] load-balancer | CRITICAL 40% error rate on us-east-1 endpoints",
    "[09:15:18] incident-bot | INFO P0 incident declared for control plane failure",
  ],
  briefingSidebarHint:
    "Control plane failure requires immediate assessment. Check etcd health before failover.",
  recommendedSkills: [
    { id: "kubernetes", label: "Kubernetes" },
    { id: "disaster-recovery", label: "Disaster Recovery" },
    { id: "system-design", label: "System Design" }
  ],
  steps: [
    {
      id: "stage-1",
      title: "Initial Assessment",
      incidentSummary:
        "The us-east-1 control plane is unresponsive. Traffic is spiking. What's your first action?",
      logs: [
        "[09:16:01] k8s-api-server | ERROR unable to reach etcd cluster",
        "[09:16:04] etcd-monitor | WARN network partition detected",
        "[09:16:07] incident-bridge | INFO P0 incident opened",
      ],
      sidebarHint:
        "Assess the scope of the failure before taking action. Check if this is a control plane issue or a broader infrastructure problem.",
      aiConfidenceContext: "Initial incident triage requires stable intervention.",
      choices: [
        {
          label: "Initiate immediate failover to us-west-2",
          score: 0,
          feedback:
            "Too aggressive without confirming the scope. Could cause cascading failures if us-west-2 is not prepared.",
          consequenceLogs: [
            "[09:17:10] dns-service | INFO initiating DNS failover...",
            "[09:17:15] load-balancer | WARN us-west-2 health checks failing",
            "[09:17:20] incident-bot | CRITICAL cascading failure detected",
          ],
          aiConfidenceDelta: -5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 2,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: -4,
          },
        },
        {
          label: "Investigate control plane logs first",
          score: 100,
          feedback:
            "Proper diagnostic approach. Understanding the root cause before action prevents unnecessary disruption.",
          consequenceLogs: [
            "[09:17:10] k8s-api-server | INFO checking etcd health...",
            "[09:17:15] etcd-monitor | INFO confirmed quorum loss",
            "[09:17:20] incident-bot | INFO root cause identified",
          ],
          aiConfidenceDelta: 8,
          scoreDelta: 12,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 3,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 6,
          },
        },
        {
          label: "Scale up control plane replicas",
          score: 50,
          feedback:
            "Won't help if the control plane is completely down. May waste valuable time during a critical incident.",
          consequenceLogs: [
            "[09:17:10] k8s-controller | INFO scaling up API servers...",
            "[09:17:15] k8s-api-server | ERROR still unable to reach etcd",
            "[09:17:20] incident-bot | WARN scaling ineffective",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 1,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 2,
          },
        },
      ],
    },
    {
      id: "stage-2",
      title: "Root Cause Identified",
      incidentSummary:
        "Etcd cluster in us-east-1 has lost quorum due to network partition. What's your next step?",
      logs: [
        "[09:18:01] etcd-monitor | INFO 2/3 nodes unreachable",
        "[09:18:04] k8s-api-server | ERROR data writes failing",
        "[09:18:07] incident-bridge | INFO etcd quorum loss confirmed",
      ],
      sidebarHint:
        "Etcd quorum loss is a critical failure. You need to restore quorum or failover to maintain data consistency.",
      aiConfidenceContext: "Quorum loss requires decisive action to prevent data inconsistency.",
      choices: [
        {
          label: "Force restore etcd from backup in new region",
          score: 100,
          feedback:
            "Clean restore is the safest approach for quorum loss. Ensures data consistency and avoids split-brain scenarios.",
          consequenceLogs: [
            "[09:19:10] etcd-restore | INFO initiating restore in us-west-2...",
            "[09:19:15] k8s-controller | INFO spinning up new etcd cluster",
            "[09:19:20] incident-bot | INFO restore progressing",
          ],
          aiConfidenceDelta: 10,
          scoreDelta: 15,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 3,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 8,
          },
        },
        {
          label: "Attempt to recover lost etcd nodes",
          score: 50,
          feedback:
            "Low probability of success during a network partition. Wastes critical time when the system is already degraded.",
          consequenceLogs: [
            "[09:19:10] network-ops | INFO attempting to recover nodes...",
            "[09:19:15] etcd-monitor | WARN nodes still unreachable",
            "[09:19:20] incident-bot | WARN recovery unsuccessful",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 1,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 2,
          },
        },
        {
          label: "Enable etcd read-only mode and continue",
          score: 0,
          feedback:
            "Read-only mode doesn't solve the control plane issue. Creates data inconsistency and doesn't restore service.",
          consequenceLogs: [
            "[09:19:10] etcd-config | INFO enabling read-only mode...",
            "[09:19:15] k8s-api-server | ERROR control plane still down",
            "[09:19:20] incident-bot | CRITICAL service still unavailable",
          ],
          aiConfidenceDelta: 2,
          scoreDelta: 3,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: -1,
          },
        },
      ],
    },
    {
      id: "stage-3",
      title: "Traffic Management",
      incidentSummary:
        "New etcd cluster is coming up in us-west-2. How do you manage traffic during the transition?",
      logs: [
        "[09:20:01] etcd-restore | INFO new cluster 60% ready",
        "[09:20:04] dns-service | INFO DNS TTL set to 300s",
        "[09:20:07] load-balancer | INFO current error rate 35%",
      ],
      sidebarHint:
        "Smooth traffic migration is critical. Consider DNS propagation, load balancer health checks, and gradual rollout.",
      aiConfidenceContext: "Traffic migration requires careful coordination to avoid service disruption.",
      choices: [
        {
          label: "Gradual traffic shift with health checks",
          score: 100,
          feedback:
            "Gradual rollout minimizes risk and allows for quick rollback if issues arise. Best practice for production migrations.",
          consequenceLogs: [
            "[09:21:10] load-balancer | INFO initiating weighted routing...",
            "[09:21:15] dns-service | INFO traffic shifting 10% to us-west-2",
            "[09:21:20] incident-bot | INFO migration progressing smoothly",
          ],
          aiConfidenceDelta: 12,
          scoreDelta: 18,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 4,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 10,
          },
        },
        {
          label: "Cut over immediately when ready",
          score: 50,
          feedback:
            "Sudden cutover risks overwhelming the new region and hiding issues. No rollback capability if problems emerge.",
          consequenceLogs: [
            "[09:21:10] dns-service | INFO instant cutover to us-west-2...",
            "[09:21:15] load-balancer | WARN us-west-2 latency spiking",
            "[09:21:20] incident-bot | WARN performance degraded",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 2,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: -3,
          },
        },
        {
          label: "Wait for full 100% readiness before shifting",
          score: 50,
          feedback:
            "Prolongs the outage unnecessarily. Partial readiness is sufficient for gradual traffic migration.",
          consequenceLogs: [
            "[09:21:10] etcd-restore | INFO waiting for 100% readiness...",
            "[09:21:15] load-balancer | INFO still serving from degraded region",
            "[09:21:20] incident-bot | WARN outage extended",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 1,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 2,
          },
        },
      ],
    },
    {
      id: "stage-4",
      title: "Post-Incident Analysis",
      incidentSummary:
        "Service is restored. What's your priority for post-incident work?",
      logs: [
        "[09:22:01] load-balancer | INFO us-west-2 handling 100% traffic",
        "[09:22:04] etcd-restore | INFO restore complete",
        "[09:22:07] incident-bot | INFO total outage duration: 47 minutes",
      ],
      sidebarHint:
        "Post-incident analysis is crucial for preventing recurrence. Focus on root cause, timeline, and actionable improvements.",
      aiConfidenceContext: "Post-incident work ensures learning and prevention.",
      choices: [
        {
          label: "Conduct full post-mortem with all teams",
          score: 100,
          feedback:
            "Comprehensive post-mortem is essential for learning and preventing similar incidents. Builds organizational resilience.",
          consequenceLogs: [
            "[09:23:10] incident-bot | INFO scheduling post-mortem meeting...",
            "[09:23:15] docs-team | INFO documenting timeline and root cause",
            "[09:23:20] incident-bot | INFO action items being tracked",
          ],
          aiConfidenceDelta: 10,
          scoreDelta: 15,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 3,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 8,
          },
        },
        {
          label: "Quick fix and move on",
          score: 0,
          feedback:
            "Misses learning opportunity and doesn't address systemic issues. Likely to repeat similar incidents.",
          consequenceLogs: [
            "[09:23:10] incident-bot | INFO closing incident without post-mortem...",
            "[09:23:15] docs-team | WARN no documentation created",
            "[09:23:20] incident-bot | WARN no action items tracked",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: -2,
          },
        },
        {
          label: "Focus only on us-east-1 recovery",
          score: 50,
          feedback:
            "Important but should not delay post-mortem. Can be done in parallel with analysis.",
          consequenceLogs: [
            "[09:23:10] k8s-controller | INFO recovering us-east-1...",
            "[09:23:15] etcd-monitor | INFO bringing etcd nodes back online",
            "[09:23:20] incident-bot | INFO recovery in progress",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 2,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 4,
          },
        },
      ],
    },
  ],
}

export default KUBERNETES_REGIONAL_FAILURE
