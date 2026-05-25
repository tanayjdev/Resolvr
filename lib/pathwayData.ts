import type { PathwayNode } from "@/components/dashboard/pathway-graph"

import type { CareerPathway } from "@/lib/pathways/pathway-engine"

import {
  CAREER_GOAL_OPTIONS,
  type CareerGoalOption,
} from "@/lib/onboarding/options"

import type { SkillLevel } from "@/lib/types/user-profile"

import {
  computeReadinessScore,
  type ReadinessInput,
} from "@/lib/readiness-engine"

export type CareerGoal = CareerGoalOption

export interface PathwayData {
  pathwayKey: CareerPathway

  specializationTitle: string

  specializationDescription: string

  childTitles: [
    string,
    string,
    string,
  ]
}

export interface DashboardOpportunity {
  id: string

  title: string

  company: string

  location: string

  postedAt: string

  type: "internship" | "fulltime" | "parttime"

  matchScore: number

  tags: string[]

  reason: string
}

export interface GuidanceCard {
  id: string

  type:
    | "pathway"
    | "skill"
    | "opportunity"
    | "action"

  title: string

  description: string

  priority?: "high" | "normal"
}

export interface AdaptiveDashboardInput {
  careerGoal: string

  interests: string[]

  skillLevel: SkillLevel

  readinessScore: number

  pathwayProgress: number

  completedSimulations: string[]

  recommendedSkills: string[]

  onboardingComplete: boolean

  simulationsCompleted: number
}

export const PATHWAY_MAP: Record<
  CareerGoal,
  PathwayData
> = {
  "AI Engineer": {
    pathwayKey: "Machine Learning",
    specializationTitle:
      "Machine Learning / AI Specialization",
    specializationDescription:
      "Model training, deployment, and production AI systems.",
    childTitles: [
      "ML Foundations",
      "Deep Learning",
      "MLOps Systems",
    ],
  },

  "Data Scientist": {
    pathwayKey: "Machine Learning",
    specializationTitle:
      "Analytics / ML / Data Pathway",
    specializationDescription:
      "Statistical modeling, experimentation, and data products.",
    childTitles: [
      "Data Analytics",
      "Machine Learning",
      "Experimentation",
    ],
  },

  "Backend Developer": {
    pathwayKey: "Frontend Engineering",
    specializationTitle:
      "API / System Design / Backend Pathway",
    specializationDescription:
      "Scalable services, APIs, and distributed architecture.",
    childTitles: [
      "API Design",
      "System Design",
      "Distributed Systems",
    ],
  },

  "Cloud Engineer": {
    pathwayKey: "Cloud Computing",
    specializationTitle:
      "Kubernetes / AWS / Cloud Infrastructure",
    specializationDescription:
      "Cloud-native architecture, reliability, and platform engineering.",
    childTitles: [
      "AWS Foundations",
      "Kubernetes",
      "Cloud Reliability",
    ],
  },

  "DevOps Engineer": {
    pathwayKey: "Cloud Computing",
    specializationTitle:
      "Docker / CI-CD / Infrastructure Automation",
    specializationDescription:
      "Delivery pipelines, observability, and infrastructure as code.",
    childTitles: [
      "Docker",
      "CI/CD Pipelines",
      "Infrastructure Automation",
    ],
  },
}

export const OPPORTUNITY_MAP: Record<
  CareerGoal,
  DashboardOpportunity[]
> = {
  "AI Engineer": [
    {
      id: "ai-ml-intern",
      title: "ML Engineering Intern",
      company: "Swiggy",
      location: "Bangalore",
      postedAt: "2 days ago",
      type: "internship",
      matchScore: 91,
      tags: ["Python", "LLMs", "TensorFlow"],
      reason:
        "Aligned with your AI Engineer goal and ML simulation momentum.",
    },
    {
      id: "ai-research",
      title: "AI Research Fellow",
      company: "NVIDIA",
      location: "Remote",
      postedAt: "5 days ago",
      type: "internship",
      matchScore: 86,
      tags: ["Deep Learning", "PyTorch"],
      reason:
        "Strong fit for advanced model experimentation and deployment skills.",
    },
  ],

  "Data Scientist": [
    {
      id: "ds-analytics",
      title: "Data Science Intern",
      company: "Flipkart",
      location: "Bangalore",
      postedAt: "1 day ago",
      type: "internship",
      matchScore: 90,
      tags: [
        "Data Analytics",
        "Python",
        "SQL",
      ],
      reason:
        "Matches analytics interests and your data science career trajectory.",
    },
    {
      id: "ds-ml-product",
      title: "ML Product Analyst",
      company: "Razorpay",
      location: "Remote",
      postedAt: "4 days ago",
      type: "internship",
      matchScore: 84,
      tags: [
        "Experimentation",
        "Machine Learning",
      ],
      reason:
        "Combines experimentation rigor with applied ML product delivery.",
    },
  ],

  "Backend Developer": [
    {
      id: "be-platform",
      title: "Backend Platform Intern",
      company: "Razorpay",
      location: "Remote",
      postedAt: "1 day ago",
      type: "internship",
      matchScore: 92,
      tags: [
        "Node.js",
        "API Design",
        "System Design",
      ],
      reason:
        "Prioritizes API and platform engineering strengths from your pathway.",
    },
    {
      id: "be-services",
      title: "Distributed Services Intern",
      company: "Uber",
      location: "Hyderabad",
      postedAt: "3 days ago",
      type: "internship",
      matchScore: 87,
      tags: [
        "Microservices",
        "System Design",
      ],
      reason:
        "Supports backend scalability skills and architecture milestones.",
    },
  ],

  "Cloud Engineer": [
    {
      id: "cloud-sre",
      title: "Cloud SRE Intern",
      company: "Google",
      location: "Bengaluru",
      postedAt: "2 days ago",
      type: "internship",
      matchScore: 91,
      tags: ["AWS", "Kubernetes", "Cloud"],
      reason:
        "Targets cloud infrastructure goals and Kubernetes simulation progress.",
    },
    {
      id: "cloud-platform",
      title: "Cloud Platform Engineer Intern",
      company: "Microsoft",
      location: "Remote",
      postedAt: "6 days ago",
      type: "internship",
      matchScore: 85,
      tags: [
        "Cloud",
        "Infrastructure",
      ],
      reason:
        "Matches cloud architecture interests and platform reliability focus.",
    },
  ],

  "DevOps Engineer": [
    {
      id: "devops-infra",
      title: "DevOps Intern",
      company: "Zerodha",
      location: "Bangalore",
      postedAt: "3 days ago",
      type: "internship",
      matchScore: 89,
      tags: ["Docker", "CI/CD", "Kubernetes"],
      reason:
        "Aligned with infrastructure automation and CI/CD pathway milestones.",
    },
    {
      id: "devops-release",
      title: "Release Engineering Intern",
      company: "Atlassian",
      location: "Remote",
      postedAt: "5 days ago",
      type: "internship",
      matchScore: 84,
      tags: [
        "CI/CD",
        "Infrastructure",
      ],
      reason:
        "Strengthens delivery pipeline skills tied to your DevOps specialization.",
    },
  ],
}

export const GUIDANCE_MAP: Record<
  CareerGoal,
  GuidanceCard[]
> = {
  "AI Engineer": [
    {
      id: "ai-pathway",
      type: "pathway",
      title: "Accelerate ML Track",
      description:
        "Your AI Engineer pathway is progressing — prioritize deployment simulations next.",
      priority: "high",
    },
    {
      id: "ai-skill",
      type: "skill",
      title: "Advance ML Deployment Skills",
      description:
        "Add one production-focused simulation to improve model serving readiness.",
      priority: "high",
    },
    {
      id: "ai-action",
      type: "action",
      title: "Complete Kubernetes Incident Simulation",
      description:
        "Incident response practice improves reliability skills for AI platform roles.",
    },
    {
      id: "ai-opp",
      type: "opportunity",
      title: "Target ML Internship Matches",
      description:
        "New ML internships align with your TensorFlow and LLM interest profile.",
    },
  ],

  "Data Scientist": [
    {
      id: "ds-pathway",
      type: "pathway",
      title: "Deepen Analytics Milestone",
      description:
        "Your data pathway benefits from one more experimentation-focused module.",
      priority: "high",
    },
    {
      id: "ds-skill",
      type: "skill",
      title: "Strengthen Statistical Modeling",
      description:
        "Increase weekly practice on inference and experimentation to raise readiness.",
    },
    {
      id: "ds-action",
      type: "action",
      title: "Complete Data Analytics Simulation",
      description:
        "Finish the analytics simulation to unlock advanced ML product recommendations.",
    },
    {
      id: "ds-opp",
      type: "opportunity",
      title: "Explore Data Science Internships",
      description:
        "Analytics and ML product roles are now highly aligned with your profile.",
    },
  ],

  "Backend Developer": [
    {
      id: "be-pathway",
      type: "pathway",
      title: "Advance API Milestone",
      description:
        "Your backend pathway is active — focus on API reliability and design depth next.",
      priority: "high",
    },
    {
      id: "be-skill",
      type: "skill",
      title: "Strengthen System Design",
      description:
        "Dedicated architecture practice can improve platform engineering readiness.",
      priority: "high",
    },
    {
      id: "be-action",
      type: "action",
      title: "Complete API Reliability Simulation",
      description:
        "Service reliability drills unlock the next backend specialization node.",
    },
    {
      id: "be-opp",
      type: "opportunity",
      title: "Prioritize Platform Internships",
      description:
        "API and distributed systems roles are strongly matched to your interests.",
    },
  ],

  "Cloud Engineer": [
    {
      id: "cloud-pathway",
      type: "pathway",
      title: "Progress Cloud Infrastructure Track",
      description:
        "Cloud milestones are within reach — prioritize AWS and Kubernetes practice.",
      priority: "high",
    },
    {
      id: "cloud-skill",
      type: "skill",
      title: "Strengthen Kubernetes Operations",
      description:
        "Additional cluster operations practice improves cloud employability signals.",
      priority: "high",
    },
    {
      id: "cloud-action",
      type: "action",
      title: "Complete Kubernetes Incident Simulation",
      description:
        "Incident simulations directly improve SRE and cloud platform readiness.",
    },
    {
      id: "cloud-opp",
      type: "opportunity",
      title: "Review Cloud SRE Matches",
      description:
        "AWS and Kubernetes tagged roles are top matches for your current pathway.",
    },
  ],

  "DevOps Engineer": [
    {
      id: "devops-pathway",
      type: "pathway",
      title: "Advance CI/CD Milestone",
      description:
        "Your DevOps track is progressing — pipeline automation should be the next focus.",
      priority: "high",
    },
    {
      id: "devops-skill",
      type: "skill",
      title: "Improve Infrastructure Automation",
      description:
        "More IaC and release engineering practice will raise pathway completion velocity.",
    },
    {
      id: "devops-action",
      type: "action",
      title: "Complete Docker Delivery Simulation",
      description:
        "Container delivery simulations unlock infrastructure automation milestones.",
    },
    {
      id: "devops-opp",
      type: "opportunity",
      title: "Target DevOps Internship Matches",
      description:
        "CI/CD and infrastructure roles are highly aligned with your specialization.",
    },
  ],
}

const NEUTRAL_OPPORTUNITIES: DashboardOpportunity[] =
  [
    {
      id: "neutral-1",
      title: "Technology Intern",
      company: "PathWeaver Network",
      location: "Remote",
      postedAt: "Recently",
      type: "internship",
      matchScore: 72,
      tags: ["Career Exploration"],
      reason:
        "Complete onboarding to unlock role-specific opportunity matching.",
    },
    {
      id: "neutral-2",
      title: "Graduate Trainee",
      company: "Innovation Labs",
      location: "Hybrid",
      postedAt: "Recently",
      type: "internship",
      matchScore: 68,
      tags: ["General Tech"],
      reason:
        "Personalized matches appear after your profile setup is complete.",
    },
  ]

const NEUTRAL_GUIDANCE: GuidanceCard[] = [
  {
    id: "neutral-1",
    type: "action",
    title: "Complete Onboarding",
    description:
      "Finish setup to personalize pathway, guidance, and opportunity recommendations.",
    priority: "high",
  },
  {
    id: "neutral-2",
    type: "pathway",
    title: "Explore Default Pathway",
    description:
      "A starter roadmap is available while your adaptive profile is being configured.",
  },
  {
    id: "neutral-3",
    type: "skill",
    title: "Build Core Foundations",
    description:
      "Complete your first simulation to generate skill-gap insights.",
  },
  {
    id: "neutral-4",
    type: "opportunity",
    title: "Unlock Smart Matching",
    description:
      "Opportunity ranking activates once career goal and interests are provided.",
  },
]

export function resolveCareerGoal(
  careerGoal: string
): CareerGoal {
  if (
    CAREER_GOAL_OPTIONS.includes(
      careerGoal as CareerGoal
    )
  ) {
    return careerGoal as CareerGoal
  }

  return "AI Engineer"
}

export function getPathwayDataForCareerGoal(
  careerGoal: string
): PathwayData {
  return PATHWAY_MAP[
    resolveCareerGoal(careerGoal)
  ]
}

function interestMatchBoost(
  opportunity: DashboardOpportunity,
  interests: string[]
): number {
  const overlap = opportunity.tags.filter(
    (tag) =>
      interests.some(
        (interest) =>
          tag
            .toLowerCase()
            .includes(
              interest.toLowerCase()
            ) ||
          interest
            .toLowerCase()
            .includes(
              tag.toLowerCase()
            )
      )
  ).length

  return overlap * 3
}

function simulationMatchBoost(
  opportunity: DashboardOpportunity,
  completedSimulations: string[]
): number {
  const keywords = [
    "kubernetes",
    "ml",
    "api",
    "docker",
    "cloud",
    "data",
  ]

  const completedKeyword =
    completedSimulations
      .join(" ")
      .toLowerCase()

  const hasMatch = keywords.some(
    (keyword) =>
      completedKeyword.includes(
        keyword
      ) &&
      opportunity.tags
        .join(" ")
        .toLowerCase()
        .includes(keyword)
  )

  return hasMatch ? 4 : 0
}

export function getAdaptiveOpportunities(
  input: AdaptiveDashboardInput
): DashboardOpportunity[] {
  if (!input.onboardingComplete) {
    return NEUTRAL_OPPORTUNITIES
  }

  const goal = resolveCareerGoal(
    input.careerGoal
  )

  const base =
    OPPORTUNITY_MAP[goal] ?? []

  return base
    .map((opportunity) => {
      const boostedScore =
        opportunity.matchScore +
        interestMatchBoost(
          opportunity,
          input.interests
        ) +
        simulationMatchBoost(
          opportunity,
          input.completedSimulations
        ) +
        Math.floor(
          input.readinessScore / 20
        )

      return {
        ...opportunity,
        matchScore: Math.min(
          99,
          boostedScore
        ),
        reason: `${opportunity.reason} Readiness signals: ${input.readinessScore}%.`,
      }
    })
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    )
}

export function getAdaptiveGuidance(
  input: AdaptiveDashboardInput
): GuidanceCard[] {
  if (!input.onboardingComplete) {
    return NEUTRAL_GUIDANCE
  }

  const goal = resolveCareerGoal(
    input.careerGoal
  )

  const base = [
    ...(GUIDANCE_MAP[goal] ?? []),
  ]

  const dynamic: GuidanceCard[] = []

  if (
    input.completedSimulations.length ===
    0
  ) {
    dynamic.push({
      id: "dynamic-sim",
      type: "action",
      title:
        "Complete Your First Simulation",
      description:
        "Launch a pathway simulation to unlock adaptive readiness and skill-gap tracking.",
      priority: "high",
    })
  }

  if (
    !input.completedSimulations.includes(
      "Kubernetes Incident"
    ) &&
    (goal === "Cloud Engineer" ||
      goal === "DevOps Engineer" ||
      input.interests.includes("Cloud"))
  ) {
    dynamic.push({
      id: "dynamic-k8s",
      type: "action",
      title:
        "Complete Kubernetes Incident Simulation",
      description:
        "This simulation is a high-impact step for cloud and infrastructure readiness.",
      priority: "high",
    })
  }

  if (
    input.interests.includes(
      "System Design"
    )
  ) {
    dynamic.push({
      id: "dynamic-sd",
      type: "skill",
      title: "Strengthen System Design",
      description:
        "Your interests indicate architecture depth should be the next skill focus.",
      priority: "high",
    })
  }

  if (input.pathwayProgress < 40) {
    dynamic.push({
      id: "dynamic-path",
      type: "pathway",
      title: `Advance ${PATHWAY_MAP[goal].specializationTitle}`,
      description:
        "Increase weekly commitment to move your specialization milestone forward.",
    })
  }

  const merged = [
    ...dynamic,
    ...base,
  ]

  const seen = new Set<string>()

  return merged
    .filter((card) => {
      if (seen.has(card.id)) {
        return false
      }

      seen.add(card.id)
      return true
    })
    .slice(0, 4)
}

export function buildAdaptiveReadinessInput(
  profile: {
    interests: string[]
    skillLevel: SkillLevel
    pathwayProgress: number
    onboardingComplete: boolean
    recommendedSkills: string[]
    completedSimulations: string[]
  }
): ReadinessInput {
  return {
    skillLevel: profile.skillLevel,
    completedSimulations:
      profile.completedSimulations,
    pathwayProgress:
      profile.pathwayProgress,
    onboardingComplete:
      profile.onboardingComplete,
    recommendedSkills:
      profile.recommendedSkills,
    interests: profile.interests,
  }
}

export function getComputedReadinessScore(
  profile: {
    skillLevel: SkillLevel
    completedSimulations: string[]
    pathwayProgress: number
    onboardingComplete: boolean
    recommendedSkills: string[]
    interests: string[]
  }
): number {
  return computeReadinessScore(
    buildAdaptiveReadinessInput(
      profile
    )
  )
}

export function buildSpecializationNodes(
  config: PathwayData,
  simulationsCompleted: number,
  completedSimulations: string[]
): PathwayNode[] {
  const thresholds = [2, 4, 6]

  return config.childTitles.map(
    (title, index) => {
      const threshold =
        thresholds[index] ?? 6

      let status: PathwayNode["status"] =
        "locked"

      if (
        simulationsCompleted >=
        threshold
      ) {
        status = "current"
      }

      if (
        completedSimulations.some(
          (sim) =>
            sim
              .toLowerCase()
              .includes(
                title
                  .split(" ")[0]
                  ?.toLowerCase() ?? ""
              )
        )
      ) {
        status = "current"
      }

      return {
        id: `3-${index + 1}`,
        title,
        status,
      }
    }
  )
}

export const ONBOARDING_PROMPT_TEXT =
  "Complete onboarding to personalize your dashboard"

export interface FeaturedSimulationData {
  id: string

  title: string

  description: string

  difficulty:
    | "beginner"
    | "intermediate"
    | "advanced"

  duration: string

  completion?: number

  featured?: boolean
}

export const FEATURED_SIMULATION_MAP: Record<
  CareerGoal,
  FeaturedSimulationData
> = {
  "AI Engineer": {
    id: "ai-sim-1",
    title: "Recommendation Engine Incident",
    description:
      "Your AI recommendation system accuracy dropped after a production model update. Diagnose and stabilize performance.",
    difficulty: "advanced",
    duration: "45 min",
    completion: 35,
    featured: true,
  },

  "Data Scientist": {
    id: "ds-sim-1",
    title: "Experimentation Pipeline Failure",
    description:
      "An A/B testing pipeline is producing biased cohorts. Investigate data quality and restore reliable insights.",
    difficulty: "intermediate",
    duration: "40 min",
    completion: 42,
    featured: true,
  },

  "Backend Developer": {
    id: "be-sim-1",
    title: "API Latency Crisis",
    description:
      "A production API is failing under traffic spikes. Investigate bottlenecks and restore service reliability.",
    difficulty: "intermediate",
    duration: "35 min",
    completion: 52,
    featured: true,
  },

  "Cloud Engineer": {
    id: "cloud-sim-1",
    title: "Kubernetes Cluster Failure",
    description:
      "Multiple services degraded after a failed deployment. Use diagnostics to recover cloud reliability.",
    difficulty: "advanced",
    duration: "50 min",
    completion: 28,
    featured: true,
  },

  "DevOps Engineer": {
    id: "devops-sim-1",
    title: "CI/CD Pipeline Outage",
    description:
      "Release automation is blocked by failing checks. Restore deployment flow and infrastructure stability.",
    difficulty: "advanced",
    duration: "48 min",
    completion: 31,
    featured: true,
  },
}

export function getFeaturedSimulation(
  careerGoal: string,
  onboardingComplete: boolean
): FeaturedSimulationData {
  if (!onboardingComplete) {
    return FEATURED_SIMULATION_MAP["AI Engineer"]
  }

  const goal = resolveCareerGoal(careerGoal)

  return FEATURED_SIMULATION_MAP[goal]
}
