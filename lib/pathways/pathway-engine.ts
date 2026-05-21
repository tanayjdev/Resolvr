import type { PathwayNode } from "@/components/dashboard/pathway-graph"

// ============================================================
// Types
// ============================================================

export type CareerPathway =
  | "Machine Learning"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Frontend Engineering"

interface BuildPathwayOptions {
  readinessScore: number

  simulationsCompleted: number

  currentPathway: CareerPathway
}

// ============================================================
// Helpers
// ============================================================

function getStatus(
  current: number,
  completedThreshold: number,
  currentThreshold: number
): "completed" | "current" | "locked" {
  if (current >= completedThreshold) {
    return "completed"
  }

  if (current >= currentThreshold) {
    return "current"
  }

  return "locked"
}

// ============================================================
// Specialization Builder
// ============================================================

function buildSpecializationChildren(
  pathway: CareerPathway,
  simulationsCompleted: number
): PathwayNode[] {
  switch (pathway) {
    case "Machine Learning":
      return [
        {
          id: "3-1",

          title: "Machine Learning",

          status:
            simulationsCompleted >= 2
              ? "current"
              : "locked",
        },

        {
          id: "3-2",

          title: "Deep Learning",

          status:
            simulationsCompleted >= 4
              ? "current"
              : "locked",
        },

        {
          id: "3-3",

          title: "MLOps Systems",

          status:
            simulationsCompleted >= 6
              ? "current"
              : "locked",
        },
      ]

    case "Cybersecurity":
      return [
        {
          id: "3-1",

          title: "Network Security",

          status:
            simulationsCompleted >= 2
              ? "current"
              : "locked",
        },

        {
          id: "3-2",

          title: "Incident Response",

          status:
            simulationsCompleted >= 4
              ? "current"
              : "locked",
        },

        {
          id: "3-3",

          title: "Threat Intelligence",

          status:
            simulationsCompleted >= 6
              ? "current"
              : "locked",
        },
      ]

    case "Cloud Computing":
      return [
        {
          id: "3-1",

          title: "Cloud Infrastructure",

          status:
            simulationsCompleted >= 2
              ? "current"
              : "locked",
        },

        {
          id: "3-2",

          title: "Kubernetes",

          status:
            simulationsCompleted >= 4
              ? "current"
              : "locked",
        },

        {
          id: "3-3",

          title: "DevOps Automation",

          status:
            simulationsCompleted >= 6
              ? "current"
              : "locked",
        },
      ]

    case "Frontend Engineering":
      return [
        {
          id: "3-1",

          title: "React Systems",

          status:
            simulationsCompleted >= 2
              ? "current"
              : "locked",
        },

        {
          id: "3-2",

          title: "Performance Optimization",

          status:
            simulationsCompleted >= 4
              ? "current"
              : "locked",
        },

        {
          id: "3-3",

          title: "Design Engineering",

          status:
            simulationsCompleted >= 6
              ? "current"
              : "locked",
        },
      ]

    default:
      return []
  }
}

// ============================================================
// Main Builder
// ============================================================

export function buildPathwayData({
  readinessScore,

  simulationsCompleted,

  currentPathway,
}: BuildPathwayOptions): PathwayNode[] {
  return [
    // ========================================================
    // Foundation
    // ========================================================

    {
      id: "1",

      title: "Foundation Skills",

      status: "completed",

      description:
        "Core technical and computational fundamentals.",

      children: [
        {
          id: "1-1",

          title:
            "Programming Basics",

          status: "completed",
        },

        {
          id: "1-2",

          title:
            "Data Structures",

          status: "completed",
        },

        {
          id: "1-3",

          title:
            "System Thinking",

          status:
            readinessScore >= 25
              ? "completed"
              : "current",
        },
      ],
    },

    // ========================================================
    // Core Competencies
    // ========================================================

    {
      id: "2",

      title:
        "Core Competencies",

      status: getStatus(
        readinessScore,
        55,
        30
      ),

      description:
        "Professional and technical growth milestones.",

      children: [
        {
          id: "2-1",

          title:
            "Problem Solving",

          status: getStatus(
            readinessScore,
            40,
            20
          ),
        },

        {
          id: "2-2",

          title:
            "Communication",

          status: getStatus(
            readinessScore,
            45,
            25
          ),
        },

        {
          id: "2-3",

          title:
            "Collaboration",

          status: getStatus(
            readinessScore,
            55,
            35
          ),
        },
      ],
    },

    // ========================================================
    // Specialization
    // ========================================================

    {
      id: "3",

      title:
        currentPathway,

      status: getStatus(
        readinessScore,
        85,
        60
      ),

      description:
        "AI-personalized specialization pathway.",

      children:
        buildSpecializationChildren(
          currentPathway,
          simulationsCompleted
        ),
    },

    // ========================================================
    // Industry Readiness
    // ========================================================

    {
      id: "4",

      title:
        "Industry Readiness",

      status: getStatus(
        readinessScore,
        100,
        85
      ),

      description:
        "Career preparation and employability acceleration.",

      children: [
        {
          id: "4-1",

          title:
            "Portfolio Projects",

          status: getStatus(
            readinessScore,
            90,
            75
          ),
        },

        {
          id: "4-2",

          title:
            "Interview Preparation",

          status: getStatus(
            readinessScore,
            95,
            80
          ),
        },

        {
          id: "4-3",

          title:
            "Industry Applications",

          status: getStatus(
            readinessScore,
            100,
            90
          ),
        },
      ],
    },
  ]
}