export interface Opportunity {
  id: string

  title: string

  company: string

  location: string

  type:
    | "internship"
    | "fulltime"
    | "parttime"

  matchScore: number

  minimumReadiness: number

  pathway: string

  postedAt: string

  description: string

  tags: string[]
}

// ============================================================
// Opportunities Dataset
// ============================================================

export const opportunities: Opportunity[] =
  [
    // ========================================================
    // Machine Learning
    // ========================================================

    {
      id: "1",

      title:
        "ML Engineering Intern",

      company:
        "OpenAI Labs",

      location: "Remote",

      type: "internship",

      matchScore: 94,

      minimumReadiness: 600,

      pathway:
        "Machine Learning",

      postedAt:
        "2 days ago",

      description:
        "Work on production-grade AI systems, model deployment pipelines, and intelligent automation workflows.",

      tags: [
        "Python",
        "PyTorch",
        "MLOps",
      ],
    },

    {
      id: "2",

      title:
        "AI Research Assistant",

      company:
        "DeepMind",

      location: "Remote",

      type: "internship",

      matchScore: 92,

      minimumReadiness: 720,

      pathway:
        "Machine Learning",

      postedAt:
        "4 days ago",

      description:
        "Collaborate on large language model research, experimentation pipelines, and evaluation systems.",

      tags: [
        "LLMs",
        "Research",
        "Transformers",
      ],
    },

    {
      id: "3",

      title:
        "Junior MLOps Engineer",

      company:
        "Hugging Face",

      location:
        "Bangalore",

      type: "fulltime",

      matchScore: 89,

      minimumReadiness: 820,

      pathway:
        "Machine Learning",

      postedAt:
        "1 week ago",

      description:
        "Build scalable ML deployment infrastructure and automate production AI workflows.",

      tags: [
        "Docker",
        "Kubernetes",
        "CI/CD",
      ],
    },

    // ========================================================
    // Cloud Computing
    // ========================================================

    {
      id: "4",

      title:
        "Cloud DevOps Intern",

      company: "AWS",

      location:
        "Bangalore",

      type: "internship",

      matchScore: 90,

      minimumReadiness: 580,

      pathway:
        "Cloud Computing",

      postedAt:
        "3 days ago",

      description:
        "Work with scalable cloud infrastructure, observability systems, and Kubernetes clusters.",

      tags: [
        "AWS",
        "Docker",
        "Kubernetes",
      ],
    },

    {
      id: "5",

      title:
        "Site Reliability Engineer",

      company:
        "Google Cloud",

      location: "Remote",

      type: "fulltime",

      matchScore: 93,

      minimumReadiness: 860,

      pathway:
        "Cloud Computing",

      postedAt:
        "5 days ago",

      description:
        "Improve distributed infrastructure reliability, failover systems, and cloud performance.",

      tags: [
        "SRE",
        "Cloud",
        "Infrastructure",
      ],
    },

    // ========================================================
    // Cybersecurity
    // ========================================================

    {
      id: "6",

      title:
        "Security Operations Intern",

      company:
        "CrowdStrike",

      location: "Remote",

      type: "internship",

      matchScore: 91,

      minimumReadiness: 620,

      pathway:
        "Cybersecurity",

      postedAt:
        "1 day ago",

      description:
        "Monitor threat intelligence systems and assist in real-world incident response workflows.",

      tags: [
        "SOC",
        "Threat Detection",
        "SIEM",
      ],
    },

    {
      id: "7",

      title:
        "Cybersecurity Analyst",

      company:
        "Cloudflare",

      location:
        "Hyderabad",

      type: "fulltime",

      matchScore: 88,

      minimumReadiness: 780,

      pathway:
        "Cybersecurity",

      postedAt:
        "6 days ago",

      description:
        "Investigate infrastructure attacks, improve system resilience, and analyze security telemetry.",

      tags: [
        "Security",
        "Networking",
        "Incident Response",
      ],
    },

    // ========================================================
    // Frontend Engineering
    // ========================================================

    {
      id: "8",

      title:
        "Frontend Engineering Intern",

      company:
        "Vercel",

      location: "Remote",

      type: "internship",

      matchScore: 90,

      minimumReadiness: 540,

      pathway:
        "Frontend Engineering",

      postedAt:
        "2 days ago",

      description:
        "Build high-performance user experiences with React, animations, and scalable UI systems.",

      tags: [
        "React",
        "Next.js",
        "Tailwind",
      ],
    },

    {
      id: "9",

      title:
        "UI Systems Engineer",

      company:
        "Linear",

      location: "Remote",

      type: "fulltime",

      matchScore: 87,

      minimumReadiness: 760,

      pathway:
        "Frontend Engineering",

      postedAt:
        "1 week ago",

      description:
        "Develop scalable frontend architectures and advanced interaction systems.",

      tags: [
        "TypeScript",
        "Performance",
        "Design Systems",
      ],
    },

    // ========================================================
    // Product / Hybrid
    // ========================================================

    {
      id: "10",

      title:
        "Product Strategy Fellow",

      company:
        "Notion",

      location: "Remote",

      type: "parttime",

      matchScore: 84,

      minimumReadiness: 640,

      pathway:
        "Frontend Engineering",

      postedAt:
        "5 days ago",

      description:
        "Collaborate across engineering and product teams to improve user experience strategy.",

      tags: [
        "Product",
        "Analytics",
        "Research",
      ],
    },
  ]