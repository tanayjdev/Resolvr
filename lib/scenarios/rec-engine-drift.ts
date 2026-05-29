import type { ScenarioConfig } from "@/lib/simulations/types"
import type { AlignmentEffects } from "@/lib/simulations/types"

const REC_ENGINE_DRIFT: ScenarioConfig = {
  id: "rec-engine-drift",
  title: "Recommendation Engine Drift",
  severity: "P1 — Critical",
  briefingSummary:
    "Slow conversion drop over 72 hours tracked to embedding space drift. New feature engineering pipeline changed embedding calculation. Old embeddings in cache are incompatible with new model.",
  systemAlerts: [
    "ALERT: conversion rate dropped 15% over 72 hours",
    "ALERT: model accuracy unchanged but business metrics declining",
    "ALERT: A/B test shows new model performing worse than old",
    "ALERT: embedding space drift detected",
  ],
  briefingLogs: [
    "[14:20:02] metrics-pipeline | WARN conversion drop -15% QoQ window",
    "[14:20:05] model-monitor | INFO model accuracy stable",
    "[14:20:09] ab-testing | WARN new model underperforming",
    "[14:20:14] embedding-monitor | ALERT embedding space drift detected",
    "[14:20:18] incident-bot | INFO P1 incident declared for model drift",
  ],
  briefingSidebarHint:
    "When model metrics are normal but business metrics decline, suspect data drift or distribution shift. Check input data first.",
  recommendedSkills: [
    { id: "machine-learning", label: "Machine Learning" },
    { id: "mlops", label: "MLOps" },
    { id: "data-analysis", label: "Data Analysis" }
  ],
  steps: [
    {
      id: "stage-1",
      title: "Initial Detection",
      incidentSummary:
        "Conversion rate dropped 15% over 72 hours. Model metrics look normal. What's your investigation priority?",
      logs: [
        "[14:21:01] metrics-pipeline | INFO conversion declining steadily",
        "[14:21:04] model-monitor | INFO model accuracy unchanged",
        "[14:21:07] ab-testing | INFO new model performing worse",
      ],
      sidebarHint:
        "Data drift is the most common cause of performance degradation when model metrics appear normal. Right diagnostic priority.",
      aiConfidenceContext: "Performance degradation requires data investigation.",
      choices: [
        {
          label: "Analyze input data distribution",
          score: 100,
          feedback:
            "Data drift is the most common cause of performance degradation when model metrics appear normal. Right diagnostic priority.",
          consequenceLogs: [
            "[14:22:10] data-monitor | INFO analyzing input distribution...",
            "[14:22:15] embedding-monitor | ALERT embedding space drift detected",
            "[14:22:20] incident-bot | INFO root cause identified",
          ],
          aiConfidenceDelta: 8,
          scoreDelta: 12,
          alignmentEffects: {
            mlAlignment: 3,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 6,
          },
        },
        {
          label: "Rollback to previous model",
          score: 0,
          feedback:
            "Rollback without understanding the cause doesn't prevent recurrence. May hide the real issue.",
          consequenceLogs: [
            "[14:22:10] model-deploy | INFO rolling back to previous model...",
            "[14:22:15] metrics-pipeline | INFO conversion recovering",
            "[14:22:20] incident-bot | WARN root cause not addressed",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 1,
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
          label: "Retrain model with recent data",
          score: 50,
          feedback:
            "Retraining without understanding the root cause is inefficient and may not solve the problem if it's a data pipeline issue.",
          consequenceLogs: [
            "[14:22:10] model-trainer | INFO initiating retraining...",
            "[14:22:15] metrics-pipeline | INFO conversion still declining",
            "[14:22:20] incident-bot | WARN retraining ineffective",
          ],
          aiConfidenceDelta: 4,
          scoreDelta: 6,
          alignmentEffects: {
            mlAlignment: 2,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 3,
          },
        },
      ],
    },
    {
      id: "stage-2",
      title: "Root Cause Identified",
      incidentSummary:
        "Embedding space has drifted due to a feature pipeline change. How do you address this?",
      logs: [
        "[14:23:01] embedding-monitor | INFO pipeline changed embedding calculation",
        "[14:23:04] cache-monitor | INFO old embeddings in cache incompatible",
        "[14:23:07] incident-bot | INFO pipeline change not validated",
      ],
      sidebarHint:
        "The issue is a pipeline change that wasn't properly validated. Need to fix the pipeline and handle the transition.",
      aiConfidenceContext: "Pipeline change requires rollback and validation.",
      choices: [
        {
          label: "Revert pipeline and clear cache",
          score: 100,
          feedback:
            "Clean rollback that addresses the root cause. Clearing cache ensures consistency. Safe and effective.",
          consequenceLogs: [
            "[14:24:10] pipeline-config | INFO reverting pipeline change...",
            "[14:24:15] cache-manager | INFO clearing embedding cache...",
            "[14:24:20] incident-bot | INFO fix applied",
          ],
          aiConfidenceDelta: 10,
          scoreDelta: 14,
          alignmentEffects: {
            mlAlignment: 3,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 8,
          },
        },
        {
          label: "Update model to use new embeddings",
          score: 50,
          feedback:
            "Treats the symptom not the cause. The pipeline change may have been incorrect. Doesn't prevent similar issues.",
          consequenceLogs: [
            "[14:24:10] model-trainer | INFO retraining with new embeddings...",
            "[14:24:15] metrics-pipeline | INFO conversion still low",
            "[14:24:20] incident-bot | WARN underlying issue not fixed",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 2,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 4,
          },
        },
        {
          label: "Run both embedding versions in parallel",
          score: 0,
          feedback:
            "Doubles infrastructure cost and complexity. Doesn't resolve the inconsistency. Temporary workaround at best.",
          consequenceLogs: [
            "[14:24:10] pipeline-config | INFO running both versions...",
            "[14:24:15] infra-ops | WARN infrastructure cost doubled",
            "[14:24:20] incident-bot | WARN complexity increased",
          ],
          aiConfidenceDelta: 4,
          scoreDelta: 6,
          alignmentEffects: {
            mlAlignment: 1,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: -3,
          },
        },
      ],
    },
    {
      id: "stage-3",
      title: "Prevention Strategy",
      incidentSummary:
        "Pipeline is reverted. How do you prevent this from happening again?",
      logs: [
        "[14:25:01] pipeline-config | INFO pipeline reverted",
        "[14:25:04] cache-manager | INFO cache cleared",
        "[14:25:07] incident-bot | INFO no embedding compatibility tests",
      ],
      sidebarHint:
        "Implement validation gates and monitoring to catch pipeline changes before they affect production.",
      aiConfidenceContext: "Prevention requires automated validation.",
      choices: [
        {
          label: "Add embedding compatibility tests",
          score: 100,
          feedback:
            "Automated validation is the most effective prevention. Catches issues before production deployment.",
          consequenceLogs: [
            "[14:26:10] ci-cd-bot | INFO adding embedding compatibility tests...",
            "[14:26:15] pipeline-config | INFO validation gates added",
            "[14:26:20] incident-bot | INFO prevention implemented",
          ],
          aiConfidenceDelta: 12,
          scoreDelta: 16,
          alignmentEffects: {
            mlAlignment: 4,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 10,
          },
        },
        {
          label: "Manual code review for pipeline changes",
          score: 50,
          feedback:
            "Manual review is error-prone and doesn't scale. Doesn't catch subtle compatibility issues.",
          consequenceLogs: [
            "[14:26:10] code-review | INFO adding review requirement...",
            "[14:26:15] pipeline-config | INFO manual review process",
            "[14:26:20] incident-bot | WARN not scalable",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 2,
          },
        },
        {
          label: "Add drift monitoring alerts",
          score: 50,
          feedback:
            "Monitoring is important but reactive. Doesn't prevent the issue, only detects it faster. Complementary but not sufficient.",
          consequenceLogs: [
            "[14:26:10] monitoring-bot | INFO adding drift alerts...",
            "[14:26:15] alerting-system | INFO thresholds configured",
            "[14:26:20] incident-bot | INFO monitoring added",
          ],
          aiConfidenceDelta: 7,
          scoreDelta: 10,
          alignmentEffects: {
            mlAlignment: 3,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 6,
          },
        },
      ],
    },
    {
      id: "stage-4",
      title: "Monitoring & Validation",
      incidentSummary:
        "Tests are in place. How do you validate they work and monitor ongoing health?",
      logs: [
        "[14:27:01] ci-cd-bot | INFO tests added to pipeline",
        "[14:27:04] monitoring-bot | INFO dashboards configured",
        "[14:27:07] incident-bot | INFO need to validate effectiveness",
      ],
      sidebarHint:
        "Validate test effectiveness and set up ongoing monitoring for both model and pipeline health.",
      aiConfidenceContext: "Validation ensures prevention works.",
      choices: [
        {
          label: "Run tests on historical drift incidents",
          score: 100,
          feedback:
            "Validating against real incidents ensures tests are effective. Provides confidence in the prevention strategy.",
          consequenceLogs: [
            "[14:28:10] test-runner | INFO running tests on historical data...",
            "[14:28:15] ci-cd-bot | INFO tests catching drift correctly",
            "[14:28:20] incident-bot | INFO validation successful",
          ],
          aiConfidenceDelta: 10,
          scoreDelta: 14,
          alignmentEffects: {
            mlAlignment: 3,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 8,
          },
        },
        {
          label: "Set up dashboard for ongoing monitoring",
          score: 50,
          feedback:
            "Monitoring is important but doesn't validate the tests themselves. Should be done in parallel with test validation.",
          consequenceLogs: [
            "[14:28:10] monitoring-bot | INFO creating dashboards...",
            "[14:28:15] grafana | INFO metrics configured",
            "[14:28:20] incident-bot | INFO monitoring active",
          ],
          aiConfidenceDelta: 7,
          scoreDelta: 10,
          alignmentEffects: {
            mlAlignment: 3,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 6,
          },
        },
        {
          label: "Deploy to production and monitor",
          score: 0,
          feedback:
            "Deploying unvalidated tests to production risks false positives that block legitimate deployments. Unsafe approach.",
          consequenceLogs: [
            "[14:28:10] deploy-bot | INFO deploying to production...",
            "[14:28:15] ci-cd-bot | WARN false positives blocking builds",
            "[14:28:20] incident-bot | WARN deployment disrupted",
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
      ],
    },
  ],
}

export default REC_ENGINE_DRIFT
