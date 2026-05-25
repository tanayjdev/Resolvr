import type {
  ProductionAIIncidentConfig,
} from "@/lib/simulations/types"

export const PRODUCTION_AI_INCIDENT: ProductionAIIncidentConfig =
  {
    simulationId: "production-ai-incident",

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

    decisionSteps: [
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
        decisions: [
          {
            id: "triage-restart",
            text: "Restart all model pods immediately without traffic shift",
            hiddenScore: 0,
            feedbackText:
              "A blind restart increases unknown blast radius and can amplify data skew during peak traffic.",
            consequenceText:
              "Restart churn extended the outage window and masked the root regression signal.",
          },
          {
            id: "triage-rollback",
            text: "Rollback serving deployment to last stable release and freeze new traffic",
            hiddenScore: 100,
            feedbackText:
              "Rollback-first is the correct production instinct when a canary regression is active.",
            consequenceText:
              "Traffic stabilized within minutes and error budget burn slowed significantly.",
          },
          {
            id: "triage-scale",
            text: "Scale replicas by 3x and keep the new model version live",
            hiddenScore: 50,
            feedbackText:
              "Scaling helps capacity but does not address model quality regression under bad inputs.",
            consequenceText:
              "Latency improved briefly, but confidence collapse and conversion loss persisted.",
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
        decisions: [
          {
            id: "diag-ignore",
            text: "Ignore feature warnings and re-enable A/B traffic at 50%",
            hiddenScore: 0,
            feedbackText:
              "Reintroducing experiment traffic before data integrity checks risks repeated customer impact.",
            consequenceText:
              "Secondary regression triggered renewed alert storms and stakeholder escalation.",
          },
          {
            id: "diag-validate",
            text: "Run contract validation, pause experiments, and compare offline vs online feature parity",
            hiddenScore: 100,
            feedbackText:
              "Strong diagnosis discipline — isolating data drift before traffic changes is production-grade.",
            consequenceText:
              "Team identified a schema mismatch and prepared a safe patch path.",
          },
          {
            id: "diag-cache",
            text: "Flush caches only and resume full traffic in 10 minutes",
            hiddenScore: 50,
            feedbackText:
              "Cache invalidation can help, but without contract checks the underlying drift may remain.",
            consequenceText:
              "Short-term recovery appeared stable, but confidence anomalies returned on peak load.",
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
        decisions: [
          {
            id: "recovery-full",
            text: "Push hotfix directly to 100% production with no staged gates",
            hiddenScore: 0,
            feedbackText:
              "Skipping staged validation removes safety controls during an active P1 incident.",
            consequenceText:
              "A secondary failure would have extended customer impact and audit risk.",
          },
          {
            id: "recovery-canary",
            text: "Deploy hotfix via guarded canary with confidence and latency SLO gates",
            hiddenScore: 100,
            feedbackText:
              "Guarded canary with explicit SLO gates is the strongest production recovery pattern.",
            consequenceText:
              "Service confidence recovered with measurable, reversible rollout controls.",
          },
          {
            id: "recovery-delay",
            text: "Delay fix until tomorrow to avoid change risk tonight",
            hiddenScore: 50,
            feedbackText:
              "Delaying recovery reduces immediate change risk but prolongs customer-facing degradation.",
            consequenceText:
              "Stakeholders accepted temporary mitigation, but SLA penalties remained likely.",
          },
        ],
      },
    ],
  }
