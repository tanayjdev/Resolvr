import type { ScenarioConfig } from "@/lib/simulations/types"
import type { AlignmentEffects } from "@/lib/simulations/types"

const SECURITY_TOKEN_BREACH: ScenarioConfig = {
  id: "security-token-breach",
  title: "Security Token Breach",
  severity: "P0 — Critical",
  briefingSummary:
    "GitHub admin token leaked in public repository. Active data exfiltration detected. Token has 500+ API calls in the last hour with admin privileges.",
  systemAlerts: [
    "ALERT: GitHub admin token found in public repo",
    "ALERT: 500+ API calls detected in last hour",
    "ALERT: active data exfiltration in progress",
    "ALERT: token has admin privileges",
  ],
  briefingLogs: [
    "[11:45:02] security-scanner | CRITICAL token detected in public repo",
    "[11:45:05] api-monitor | ALERT 500+ API calls in last hour",
    "[11:45:09] security-bot | CRITICAL active exfiltration detected",
    "[11:45:14] incident-bot | INFO P0 incident declared for credential leak",
    "[11:45:18] github-api | INFO token has admin privileges",
  ],
  briefingSidebarHint:
    "Immediate containment is critical. Every minute the token is active increases exposure. Prioritize revocation over investigation.",
  recommendedSkills: [
    { id: "security", label: "Security" },
    { id: "incident-response", label: "Incident Response" },
    { id: "access-control", label: "Access Control" }
  ],
  steps: [
    {
      id: "stage-1",
      title: "Initial Response",
      incidentSummary:
        "Security alert: GitHub admin token found in public repo. Active API calls detected. What's your immediate action?",
      logs: [
        "[11:46:01] security-scanner | CRITICAL token exposed in repo",
        "[11:46:04] api-monitor | ALERT 500+ API calls in last hour",
        "[11:46:07] incident-bridge | INFO P0 incident opened",
      ],
      sidebarHint:
        "Immediate revocation is the correct first step. Stops ongoing exfiltration and limits damage. Investigation can follow.",
      aiConfidenceContext: "Credential leak requires immediate containment.",
      choices: [
        {
          label: "Revoke token immediately",
          score: 100,
          feedback:
            "Immediate revocation is the correct first step. Stops ongoing exfiltration and limits damage. Investigation can follow.",
          consequenceLogs: [
            "[11:47:10] github-api | INFO revoking token...",
            "[11:47:15] security-bot | INFO token revoked successfully",
            "[11:47:20] incident-bot | INFO exfiltration stopped",
          ],
          aiConfidenceDelta: 12,
          scoreDelta: 18,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 4,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: 10,
          },
        },
        {
          label: "Investigate scope first",
          score: 0,
          feedback:
            "Every minute of delay increases data loss. Investigation can happen after containment. Wrong priority.",
          consequenceLogs: [
            "[11:47:10] security-bot | INFO investigating scope...",
            "[11:47:15] api-monitor | CRITICAL exfiltration continuing",
            "[11:47:20] incident-bot | CRITICAL data loss increasing",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 1,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: -2,
          },
        },
        {
          label: "Rotate token instead of revoking",
          score: 50,
          feedback:
            "Rotation doesn't invalidate the leaked token. Attacker still has access until rotation completes. Too slow.",
          consequenceLogs: [
            "[11:47:10] github-api | INFO rotating token...",
            "[11:47:15] security-bot | WARN old token still valid",
            "[11:47:20] incident-bot | WARN exfiltration continuing",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 2,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 4,
          },
        },
      ],
    },
    {
      id: "stage-2",
      title: "Impact Assessment",
      incidentSummary:
        "Token is revoked. Now assess the damage. What's your priority?",
      logs: [
        "[11:48:01] github-api | INFO token revoked",
        "[11:48:04] api-monitor | INFO token was active for 2 hours",
        "[11:48:07] security-bot | INFO 15 repositories accessed",
      ],
      sidebarHint:
        "Understand the full scope of the breach before remediation. Prioritize high-value assets and assess data exposure.",
      aiConfidenceContext: "Assessment phase requires thorough investigation.",
      choices: [
        {
          label: "Comprehensive forensic analysis",
          score: 100,
          feedback:
            "Thorough analysis is essential for understanding the full impact and informing remediation decisions.",
          consequenceLogs: [
            "[11:49:10] forensics-team | INFO analyzing all API logs...",
            "[11:49:15] security-bot | INFO identifying accessed data",
            "[11:49:20] incident-bot | INFO impact assessment complete",
          ],
          aiConfidenceDelta: 12,
          scoreDelta: 16,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 4,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 10,
          },
        },
        {
          label: "Focus on sensitive repositories only",
          score: 50,
          feedback:
            "May miss lateral movement or access to other sensitive data. Incomplete assessment risks missing critical exposure.",
          consequenceLogs: [
            "[11:49:10] forensics-team | INFO analyzing 3 repos...",
            "[11:49:15] security-bot | WARN other repos not checked",
            "[11:49:20] incident-bot | WARN incomplete assessment",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 2,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 4,
          },
        },
        {
          label: "Assume worst case and rotate all secrets",
          score: 50,
          feedback:
            "Overly aggressive response that causes unnecessary disruption. Doesn't provide insight for prevention.",
          consequenceLogs: [
            "[11:49:10] security-bot | INFO rotating all secrets...",
            "[11:49:15] dev-team | WARN services disrupted",
            "[11:49:20] incident-bot | WARN unnecessary disruption",
          ],
          aiConfidenceDelta: 7,
          scoreDelta: 10,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 2,
          },
          riskEffects: {
            riskProfileDelta: "aggressive",
            stabilityImpact: 6,
          },
        },
      ],
    },
    {
      id: "stage-3",
      title: "Containment & Remediation",
      incidentSummary:
        "Analysis shows customer data was accessed from 2 repositories. What's your remediation strategy?",
      logs: [
        "[11:50:01] forensics-team | INFO PII data accessed from 2 repos",
        "[11:50:04] security-bot | INFO no evidence of exfiltration yet",
        "[11:50:07] incident-bot | INFO 500 customers affected",
      ],
      sidebarHint:
        "Balance customer notification with investigation. Consider legal requirements and trust implications.",
      aiConfidenceContext: "Remediation requires careful communication planning.",
      choices: [
        {
          label: "Notify affected customers immediately",
          score: 100,
          feedback:
            "Transparent communication builds trust and meets regulatory requirements. Customers can take protective action.",
          consequenceLogs: [
            "[11:51:10] comms-team | INFO sending customer notifications...",
            "[11:51:15] legal-team | INFO regulatory requirements met",
            "[11:51:20] incident-bot | INFO notifications sent",
          ],
          aiConfidenceDelta: 14,
          scoreDelta: 18,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 4,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 12,
          },
        },
        {
          label: "Wait for forensic confirmation before notifying",
          score: 0,
          feedback:
            "Delays notification beyond regulatory requirements. Damages trust if customers find out later. Risky approach.",
          consequenceLogs: [
            "[11:51:10] forensics-team | INFO continuing investigation...",
            "[11:51:15] legal-team | WARN regulatory deadline approaching",
            "[11:51:20] incident-bot | WARN compliance risk",
          ],
          aiConfidenceDelta: 4,
          scoreDelta: 6,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 1,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: -3,
          },
        },
        {
          label: "Notify only if exfiltration confirmed",
          score: 0,
          feedback:
            "Violates regulatory requirements and best practices. Severe reputational and legal risk if discovered.",
          consequenceLogs: [
            "[11:51:10] security-bot | INFO waiting for confirmation...",
            "[11:51:15] legal-team | CRITICAL regulatory violation risk",
            "[11:51:20] incident-bot | CRITICAL legal and reputational risk",
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
      ],
    },
    {
      id: "stage-4",
      title: "Prevention & Hardening",
      incidentSummary:
        "Incident is contained. How do you prevent this from happening again?",
      logs: [
        "[11:52:01] security-bot | INFO incident contained",
        "[11:52:04] forensics-team | INFO root cause: developer committed token",
        "[11:52:07] incident-bot | INFO no pre-commit hooks or secret scanning",
      ],
      sidebarHint:
        "Implement defense-in-depth. Multiple layers of prevention are needed to catch secrets before they're committed.",
      aiConfidenceContext: "Prevention requires layered security controls.",
      choices: [
        {
          label: "Implement comprehensive secret scanning",
          score: 100,
          feedback:
            "Defense-in-depth approach with multiple detection points. Best practice for secret management.",
          consequenceLogs: [
            "[11:53:10] security-config | INFO adding pre-commit hooks...",
            "[11:53:15] ci-cd-bot | INFO adding CI/CD scanning...",
            "[11:53:20] incident-bot | INFO secret scanning enabled",
          ],
          aiConfidenceDelta: 12,
          scoreDelta: 16,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 4,
          },
          riskEffects: {
            riskProfileDelta: "balanced",
            stabilityImpact: 10,
          },
        },
        {
          label: "Add pre-commit hooks only",
          score: 50,
          feedback:
            "Single point of failure. Developers can bypass hooks. Doesn't catch secrets already in repositories.",
          consequenceLogs: [
            "[11:53:10] git-config | INFO adding pre-commit hooks...",
            "[11:53:15] security-bot | WARN hooks can be bypassed",
            "[11:53:20] incident-bot | INFO partial protection",
          ],
          aiConfidenceDelta: 5,
          scoreDelta: 8,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 2,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 4,
          },
        },
        {
          label: "Developer training only",
          score: 0,
          feedback:
            "Training is important but not sufficient. Human error will still occur. Need technical controls.",
          consequenceLogs: [
            "[11:53:10] training-team | INFO scheduling security training...",
            "[11:53:15] security-bot | WARN training not sufficient",
            "[11:53:20] incident-bot | WARN technical controls needed",
          ],
          aiConfidenceDelta: 3,
          scoreDelta: 5,
          alignmentEffects: {
            mlAlignment: 0,
            infraAlignment: 0,
            productAlignment: 0,
            securityAlignment: 1,
          },
          riskEffects: {
            riskProfileDelta: "conservative",
            stabilityImpact: 2,
          },
        },
      ],
    },
  ],
}

export default SECURITY_TOKEN_BREACH
