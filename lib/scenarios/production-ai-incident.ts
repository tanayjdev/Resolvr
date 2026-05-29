import type { ScenarioConfig } from "@/lib/simulations/types"
import type { AlignmentEffects } from "@/lib/simulations/types"

const PRODUCTION_AI_INCIDENT: ScenarioConfig = {
  id: "production-ai-incident",
  title: "Production AI Incident",
  severity: "P1 — Critical",
  briefingSummary:
    "The production recommendation engine is degrading after a model rollout. Inference latency is spiking, confidence scores are collapsing, and customer conversion is dropping in real time.",
  systemAlerts: [
    "ALERT: rec-engine latency p99 > 2400ms (threshold 600ms)",
    "ALERT: model confidence mean dropped 18% in 12 minutes",
    "ALERT: error budget burn rate 4.2x normal",
    "ALERT: canary deployment regression detected on v2.14.0",
  ],
  briefingLogs: [
    "[08:41:02] inference-gateway | ERROR batch timeout on shard-7",
    "[08:41:05] model-serving | WARN confidence calibration drift detected",
    "[08:41:09] traffic-router | WARN fallback path engaged for 12% requests",
    "[08:41:14] metrics-pipeline | CRITICAL conversion drop -9.4% QoQ window",
    "[08:41:18] deploy-bot | INFO rollback candidate build v2.13.8 available",
  ],
  briefingSidebarHint:
    "Inference latency increasing rapidly. Monitor confidence drift and rollback readiness.",
  recommendedSkills: [
    { id: "incident-response", label: "Incident Response" },
    { id: "systems-design", label: "Systems Design" }
  ],
  steps: [
    {
      id: "decision-triage",
      title: "Triage: Serving Degradation",
      incidentSummary:
        "Live traffic shows unstable inference batches and rising timeout rates. Leadership wants a decision in the next 5 minutes.",
      logs: [
        "[08:42:01] autoscale | WARN GPU pool saturation at 93%",
        "[08:42:04] rec-engine | ERROR timeout spike on ranking stage",
        "[08:42:07] on-call | INFO incident bridge opened",
      ],
      sidebarHint:
        "AI model confidence degrading. Validate blast radius before changes.",
      aiConfidenceContext: "Initial incident triage requires stable intervention.",
      choices: [
        {
          label: "Restart all model pods immediately without traffic shift",
          score: 0,
          feedback:
            "A blind restart increases unknown blast radius and can amplify data skew during peak traffic.",
          consequenceLogs: [
            "[08:43:10] k8s-controller | INFO terminating 500 pods...",
            "[08:43:12] inference-gateway | CRITICAL 502 Bad Gateway spike",
            "[08:43:15] metrics-pipeline | ALERT total conversion drop 45%",
          ],
          aiConfidenceDelta: -30,
          scoreDelta: -20,
          alignmentEffects: {
            mlAlignment: -5,
            infraAlignment: -10,
            productAlignment: -5,
            securityAlignment: -5
          },
          riskEffects: {
            riskProfileDelta: 'aggressive',
            stabilityImpact: -15
          }
        },
        {
          label: "Rollback serving deployment to last stable release and freeze new traffic",
          score: 100,
          feedback:
            "Rollback-first is the correct production instinct when a canary regression is active.",
          consequenceLogs: [
            "[08:43:10] deploy-bot | INFO rollback initiated to v2.13.8",
            "[08:43:15] traffic-router | INFO redirecting traffic to stable endpoints",
            "[08:43:20] metrics-pipeline | INFO latency recovering to p99 500ms",
          ],
          aiConfidenceDelta: +15,
          scoreDelta: 25,
          alignmentEffects: {
            mlAlignment: 5,
            infraAlignment: 15,
            productAlignment: 10,
            securityAlignment: 5
          },
          riskEffects: {
            riskProfileDelta: 'conservative',
            stabilityImpact: 15
          }
        },
        {
          label: "Scale replicas by 3x and keep the new model version live",
          score: 50,
          feedback:
            "Scaling helps capacity but does not address model quality regression under bad inputs.",
          consequenceLogs: [
            "[08:43:10] autoscale | INFO scaling deployment to 1500 replicas",
            "[08:43:25] rec-engine | WARN timeouts reduced but confidence still degrading",
            "[08:43:30] metrics-pipeline | ALERT conversion still dropping",
          ],
          aiConfidenceDelta: -10,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 5,
            infraAlignment: 10,
            productAlignment: 0,
            securityAlignment: 0
          },
          riskEffects: {
            riskProfileDelta: 'balanced',
            stabilityImpact: 0
          }
        },
      ],
    },
    {
      id: "decision-diagnosis",
      title: "Diagnosis: Feature Pipeline Integrity",
      incidentSummary:
        "Post-rollback metrics are stabilizing, but feature freshness checks show anomalies in the online embedding pipeline.",
      logs: [
        "[08:46:12] feature-store | WARN stale embedding window detected",
        "[08:46:15] data-quality | ERROR schema mismatch on user-context v3",
        "[08:46:19] rec-engine | INFO latency recovering on primary region",
      ],
      sidebarHint:
        "Production traffic unstable. Verify data contracts before re-enabling experiments.",
      aiConfidenceContext: "Feature store integrity is paramount for recovery.",
      choices: [
        {
          label: "Ignore feature warnings and re-enable A/B traffic at 50%",
          score: 0,
          feedback:
            "Reintroducing experiment traffic before data integrity checks risks repeated customer impact.",
          consequenceLogs: [
            "[08:47:05] traffic-router | INFO A/B traffic restored",
            "[08:47:10] rec-engine | CRITICAL schema validation failed on 50% traffic",
            "[08:47:15] data-quality | FATAL feature store poisoned",
          ],
          aiConfidenceDelta: -35,
          scoreDelta: -25,
          alignmentEffects: {
            mlAlignment: -10,
            infraAlignment: -5,
            productAlignment: -10,
            securityAlignment: -5
          },
          riskEffects: {
            riskProfileDelta: 'aggressive',
            stabilityImpact: -20
          }
        },
        {
          label: "Run contract validation, pause experiments, and compare offline vs online feature parity",
          score: 100,
          feedback:
            "Strong diagnosis discipline — isolating data drift before traffic changes is production-grade.",
          consequenceLogs: [
            "[08:47:05] data-quality | INFO executing contract validation",
            "[08:47:12] feature-store | INFO schema mismatch isolated to user-context v3",
            "[08:47:18] deploy-bot | INFO hotfix patch path verified",
          ],
          aiConfidenceDelta: +20,
          scoreDelta: 30,
          alignmentEffects: {
            mlAlignment: 10,
            infraAlignment: 10,
            productAlignment: 15,
            securityAlignment: 5
          },
          riskEffects: {
            riskProfileDelta: 'conservative',
            stabilityImpact: 20
          }
        },
        {
          label: "Flush caches only and resume full traffic in 10 minutes",
          score: 50,
          feedback:
            "Cache invalidation can help, but without contract checks the underlying drift may remain.",
          consequenceLogs: [
            "[08:47:05] redis-cluster | INFO FLUSHALL executed",
            "[08:47:15] rec-engine | WARN cache miss latency spike",
            "[08:47:25] data-quality | ERROR schema mismatch returned",
          ],
          aiConfidenceDelta: -15,
          scoreDelta: 10,
          alignmentEffects: {
            mlAlignment: 5,
            infraAlignment: 10,
            productAlignment: 5,
            securityAlignment: 0
          },
          riskEffects: {
            riskProfileDelta: 'balanced',
            stabilityImpact: 5
          }
        },
      ],
    },
    {
      id: "decision-recovery",
      title: "Recovery: Safe Relaunch Plan",
      incidentSummary:
        "Root cause isolated to a feature schema mismatch. You must choose the safest path to restore full production confidence.",
      logs: [
        "[08:52:03] deploy-bot | INFO hotfix branch ready for canary",
        "[08:52:06] sre-bot | WARN only one rollback window left in change freeze",
        "[08:52:10] product | INFO customer comms draft awaiting engineering sign-off",
      ],
      sidebarHint:
        "Canary path available. Prioritize controlled recovery with observability gates.",
      aiConfidenceContext: "Execution of the safe relaunch determines final resolution.",
      choices: [
        {
          label: "Push hotfix directly to 100% production with no staged gates",
          score: 0,
          feedback:
            "Skipping staged validation removes safety controls during an active P1 incident.",
          consequenceLogs: [
            "[08:53:10] deploy-bot | INFO deploying directly to 100% production",
            "[08:53:20] metrics-pipeline | ALERT unexplained secondary latency spike",
            "[08:53:25] sre-bot | CRITICAL rollback window exhausted",
          ],
          aiConfidenceDelta: -40,
          scoreDelta: -30,
          alignmentEffects: {
            mlAlignment: -15,
            infraAlignment: -20,
            productAlignment: -10,
            securityAlignment: -10
          },
          riskEffects: {
            riskProfileDelta: 'aggressive',
            stabilityImpact: -25
          }
        },
        {
          label: "Deploy hotfix via guarded canary with confidence and latency SLO gates",
          score: 100,
          feedback:
            "Guarded canary with explicit SLO gates is the strongest production recovery pattern.",
          consequenceLogs: [
            "[08:53:10] deploy-bot | INFO deploying canary (5%)",
            "[08:53:30] sre-bot | INFO SLO gates passed: latency OK, confidence OK",
            "[08:53:45] deploy-bot | SUCCESS rolling out to 100%",
          ],
          aiConfidenceDelta: +25,
          scoreDelta: 35,
          alignmentEffects: {
            mlAlignment: 15,
            infraAlignment: 20,
            productAlignment: 15,
            securityAlignment: 10
          },
          riskEffects: {
            riskProfileDelta: 'conservative',
            stabilityImpact: 25
          }
        },
        {
          label: "Delay fix until tomorrow to avoid change risk tonight",
          score: 50,
          feedback:
            "Delaying recovery reduces immediate change risk but prolongs customer-facing degradation.",
          consequenceLogs: [
            "[08:53:10] change-management | INFO incident mitigated, resolution delayed",
            "[08:53:15] product | WARN SLA penalty threshold reached",
            "[08:53:20] metrics-pipeline | INFO operating in degraded state",
          ],
          aiConfidenceDelta: -20,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 5,
            productAlignment: 10,
            securityAlignment: 0
          },
          riskEffects: {
            riskProfileDelta: 'conservative',
            stabilityImpact: 0
          }
        },
      ],
    },
  ],
}

export default PRODUCTION_AI_INCIDENT
