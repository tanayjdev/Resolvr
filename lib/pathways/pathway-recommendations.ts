export interface PathRecommendation {
  title: string

  reason: string

  priority:
    | "high"
    | "medium"
    | "low"

  category:
    | "learning"
    | "simulation"
    | "career"
    | "project"
    | "certification"
}

// ============================================================
// Types
// ============================================================

export type CareerPathway =
  | "Machine Learning"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Frontend Engineering"

interface RecommendationOptions {
  readinessScore: number

  simulationsCompleted: number

  currentPathway: CareerPathway
}

// ============================================================
// Main Function
// ============================================================

export function getPathwayRecommendations({
  readinessScore,

  simulationsCompleted,

  currentPathway,
}: RecommendationOptions): PathRecommendation[] {
  const recommendations: PathRecommendation[] =
    []

  // ==========================================================
  // Pathway-Specific Recommendations
  // ==========================================================

  switch (currentPathway) {
    // ========================================================
    // Machine Learning
    // ========================================================

    case "Machine Learning":
      recommendations.push(
        {
          title:
            "Build an ML Portfolio Project",

          reason:
            "Real-world ML projects significantly improve employability and recruiter visibility.",

          priority: "high",

          category:
            "project",
        },

        {
          title:
            "Complete Kubernetes Simulation",

          reason:
            "Infrastructure knowledge improves ML deployment and MLOps readiness.",

          priority: "high",

          category:
            "simulation",
        },

        {
          title:
            "Study Model Deployment Systems",

          reason:
            "Production AI systems require deployment, scaling, and monitoring expertise.",

          priority:
            "medium",

          category:
            "learning",
        }
      )

      break

    // ========================================================
    // Cybersecurity
    // ========================================================

    case "Cybersecurity":
      recommendations.push(
        {
          title:
            "Practice Incident Response Simulations",

          reason:
            "Hands-on security response experience improves real-world operational readiness.",

          priority: "high",

          category:
            "simulation",
        },

        {
          title:
            "Learn SIEM & Monitoring Systems",

          reason:
            "Security monitoring is critical for enterprise cybersecurity roles.",

          priority:
            "medium",

          category:
            "learning",
        },

        {
          title:
            "Prepare for Security Certifications",

          reason:
            "Industry certifications accelerate credibility and hiring opportunities.",

          priority:
            "medium",

          category:
            "certification",
        }
      )

      break

    // ========================================================
    // Cloud Computing
    // ========================================================

    case "Cloud Computing":
      recommendations.push(
        {
          title:
            "Deploy a Kubernetes Cluster",

          reason:
            "Cloud-native deployment experience is highly valuable for DevOps and infrastructure roles.",

          priority: "high",

          category:
            "project",
        },

        {
          title:
            "Complete Infrastructure Failure Simulations",

          reason:
            "Operational resilience and failover recovery are core cloud engineering skills.",

          priority: "high",

          category:
            "simulation",
        },

        {
          title:
            "Study CI/CD Pipelines",

          reason:
            "Automation and deployment workflows are essential cloud engineering competencies.",

          priority:
            "medium",

          category:
            "learning",
        }
      )

      break

    // ========================================================
    // Frontend Engineering
    // ========================================================

    case "Frontend Engineering":
      recommendations.push(
        {
          title:
            "Build a Production-Grade React App",

          reason:
            "Portfolio-level frontend projects demonstrate engineering maturity.",

          priority: "high",

          category:
            "project",
        },

        {
          title:
            "Improve Web Performance Skills",

          reason:
            "Optimization and responsiveness strongly impact frontend employability.",

          priority:
            "medium",

          category:
            "learning",
        },

        {
          title:
            "Practice System Design Fundamentals",

          reason:
            "Scalable frontend architecture knowledge improves senior-level readiness.",

          priority:
            "medium",

          category:
            "learning",
        }
      )

      break
  }

  // ==========================================================
  // Readiness-Based Recommendations
  // ==========================================================

  if (readinessScore < 500) {
    recommendations.push({
      title:
        "Strengthen Core Technical Fundamentals",

      reason:
        "Foundational improvement is required before advanced specialization pathways unlock.",

      priority: "high",

      category:
        "learning",
    })
  }

  if (readinessScore < 700) {
    recommendations.push({
      title:
        "Increase Readiness Score",

      reason:
        "Higher readiness unlocks advanced pathway milestones and premium opportunities.",

      priority:
        "medium",

      category:
        "career",
    })
  }

  if (readinessScore >= 850) {
    recommendations.push({
      title:
        "Start Applying for Advanced Roles",

      reason:
        "Your readiness indicates strong alignment with internship and industry-level opportunities.",

      priority: "high",

      category:
        "career",
    })
  }

  // ==========================================================
  // Simulation Progression
  // ==========================================================

  if (simulationsCompleted < 3) {
    recommendations.push({
      title:
        "Complete More Simulations",

      reason:
        "Hands-on simulations rapidly improve practical decision-making and employability.",

      priority: "high",

      category:
        "simulation",
    })
  }

  if (
    simulationsCompleted >= 5
  ) {
    recommendations.push({
      title:
        "Attempt Advanced Scenario Challenges",

      reason:
        "Higher-complexity simulations strengthen production-level problem-solving capability.",

      priority:
        "medium",

      category:
        "simulation",
    })
  }

  // ==========================================================
  // Sorting
  // ==========================================================

  const priorityWeight = {
    high: 3,

    medium: 2,

    low: 1,
  }

  return recommendations.sort(
    (a, b) =>
      priorityWeight[
        b.priority
      ] -
      priorityWeight[
        a.priority
      ]
  )
}