import type { ScenarioConfig } from "@/lib/simulations/types"
import type { AlignmentEffects } from "@/lib/simulations/types"

const CICD_MELTDOWN: ScenarioConfig = {
  id: "cicd-meltdown",
  title: "CI/CD Pipeline Meltdown",
  severity: "P1 — Critical",
  briefingSummary:
    "Build times increased by 400% blocking all hotfixes. Runner pools exhausted. Dependency caching not working, causing every build to download all packages.",
  systemAlerts: [
    "ALERT: build queue backed up with 200+ jobs",
    "ALERT: average build time 45 minutes (normally 10)",
    "ALERT: runner pool at 100% utilization",
    "ALERT: hotfix for critical security vulnerability blocked",
  ],
  briefingLogs: [
    "[10:30:02] github-actions | WARN build duration increased 400%",
    "[10:30:05] runner-pool | CRITICAL all runners exhausted",
    "[10:30:09] build-monitor | ERROR queue depth: 200+ jobs",
    "[10:30:14] security-bot | CRITICAL hotfix blocked in queue",
    "[10:30:18] incident-bot | INFO P1 incident declared for pipeline failure",
  ],
  briefingSidebarHint:
    "Identify the bottleneck before taking action. Check if it's resource constraints, dependency issues, or configuration problems.",
  recommendedSkills: [
    { id: "cicd", label: "CI/CD" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "performance", label: "Performance Optimization" }
  ],
  steps: [
    {
      id: "stage-1",
      title: "Initial Diagnosis",
      incidentSummary:
        "Build queue is backed up with 200+ jobs. Average build time is 45 minutes (normally 10). What do you investigate first?",
      logs: [
        "[10:31:01] github-actions | WARN 400% increase in build duration",
        "[10:31:04] runner-pool | INFO 100% utilization across all runners",
        "[10:31:07] build-monitor | ERROR hotfix blocked in queue",
      ],
      sidebarHint:
        "Resource constraints are the most common cause of build slowdowns. Checking utilization first is the right diagnostic approach.",
      aiConfidenceContext: "Diagnostic phase requires systematic investigation.",
      choices: [
        {
          label: "Check runner resource utilization",
          score: 100,
          feedback:
            "Resource constraints are the most common cause of build slowdowns. Checking utilization first is the right diagnostic approach.",
          consequenceLogs: [
            "[10:32:10] runner-monitor | INFO checking CPU/memory/disk usage...",
            "[10:32:15] runner-monitor | INFO CPU at 95%, memory at 88%",
            "[10:32:20] incident-bot | INFO resource constraint identified",
          ],
          aiConfidenceDelta: 7,
          scoreDelta: 10,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 2,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 5,
          },
        },
        {
          label: "Scale up runner pool immediately",
          score: 50,
          feedback:
            "Scaling without understanding the cause may not help and wastes resources. Could exacerbate the problem.",
          consequenceLogs: [
            "[10:32:10] runner-pool | INFO scaling up runners...",
            "[10:32:15] github-actions | WARN build times still high",
            "[10:32:20] incident-bot | WARN scaling ineffective",
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
            riskProfileDelta: "aggressive",
            stabilityImpact: -2,
          },
        },
        {
          label: "Cancel all non-critical builds",
          score: 0,
          feedback:
            "Disruptive to development teams. Doesn't solve the underlying performance issue.",
          consequenceLogs: [
            "[10:32:10] github-actions | INFO cancelling non-critical builds...",
            "[10:32:15] dev-team | WARN builds cancelled unexpectedly",
            "[10:32:20] incident-bot | WARN team productivity impacted",
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
            riskProfileDelta: "conservative",
            stabilityImpact: -1,
          },
        },
      ],
    },
    {
      id: "stage-2",
      title: "Root Cause Identified",
      incidentSummary:
        "Runners are CPU-bound due to a new dependency caching issue. How do you address this?",
      logs: [
        "[10:33:01] cache-monitor | INFO dependency caching not working",
        "[10:33:04] github-actions | ERROR every build downloading all packages",
        "[10:33:07] runner-monitor | INFO CPU at 95% on all runners",
      ],
      sidebarHint:
        "Fix the caching issue to restore normal build times. Consider both immediate mitigation and long-term prevention.",
      aiConfidenceContext: "Root cause identified requires targeted fix.",
      choices: [
        {
          label: "Fix cache configuration and clear queue",
          score: 100,
          feedback:
            "Addresses root cause directly. Clearing the queue prevents overwhelming the system once cache is fixed.",
          consequenceLogs: [
            "[10:34:10] cache-config | INFO updating cache configuration...",
            "[10:34:15] github-actions | INFO clearing build queue...",
            "[10:34:20] incident-bot | INFO cache fix applied",
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
          label: "Disable caching temporarily",
          score: 50,
          feedback:
            "Doesn't solve the problem, just masks it. Builds will still be slow and the queue will remain backed up.",
          consequenceLogs: [
            "[10:34:10] cache-config | INFO disabling caching...",
            "[10:34:15] github-actions | WARN builds still slow",
            "[10:34:20] incident-bot | WARN queue still backed up",
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
          label: "Manually cache dependencies on runners",
          score: 50,
          feedback:
            "Manual intervention is not scalable and error-prone. Doesn't fix the underlying configuration issue.",
          consequenceLogs: [
            "[10:34:10] runner-ops | INFO manually caching dependencies...",
            "[10:34:15] github-actions | WARN manual process slow",
            "[10:34:20] incident-bot | WARN not scalable",
          ],
          aiConfidenceDelta: 4,
          scoreDelta: 6,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 2,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: 3,
          },
        },
      ],
    },
    {
      id: "stage-3",
      title: "Hotfix Priority",
      incidentSummary:
        "Security hotfix is still blocked in the queue. How do you expedite it?",
      logs: [
        "[10:35:01] security-bot | INFO hotfix still blocked",
        "[10:35:04] build-monitor | INFO queue has 150+ jobs ahead",
        "[10:35:07] incident-bot | INFO critical security vulnerability",
      ],
      sidebarHint:
        "Balance the need for speed with system stability. Consider dedicated resources or priority queues.",
      aiConfidenceContext: "Security hotfix requires expedited handling.",
      choices: [
        {
          label: "Create dedicated runner for hotfix",
          score: 100,
          feedback:
            "Isolates the critical build without disrupting the rest of the pipeline. Fast and safe approach.",
          consequenceLogs: [
            "[10:36:10] runner-pool | INFO spinning up dedicated runner...",
            "[10:36:15] github-actions | INFO hotfix building on dedicated runner",
            "[10:36:20] incident-bot | INFO hotfix expedited",
          ],
          aiConfidenceDelta: 10,
          scoreDelta: 14,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 3,
            productAlignment: 0,
            securityAlignment: 1,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 8,
          },
        },
        {
          label: "Cancel all builds ahead of hotfix",
          score: 0,
          feedback:
            "Highly disruptive to development teams. Damages trust in the CI/CD system. Not sustainable.",
          consequenceLogs: [
            "[10:36:10] github-actions | INFO cancelling all builds...",
            "[10:36:15] dev-team | CRITICAL builds cancelled unexpectedly",
            "[10:36:20] incident-bot | WARN team trust damaged",
          ],
          aiConfidenceDelta: 2,
          scoreDelta: 4,
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
        {
          label: "Wait for queue to drain naturally",
          score: 0,
          feedback:
            "Unacceptable delay for a security vulnerability. Puts the organization at significant risk.",
          consequenceLogs: [
            "[10:36:10] build-monitor | INFO waiting for queue to drain...",
            "[10:36:15] security-bot | CRITICAL hotfix still blocked",
            "[10:36:20] incident-bot | CRITICAL security risk ongoing",
          ],
          aiConfidenceDelta: 1,
          scoreDelta: 2,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 0,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: -1,
          },
        },
      ],
    },
  ],
}

export default CICD_MELTDOWN
