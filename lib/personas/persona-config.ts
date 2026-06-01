// ============================================================
// Persona Configuration System
// ============================================================
// This file defines all career track personas with their
// specific skills, pathways, simulations, opportunities,
// and visual themes.
// ============================================================

import type { UserProgress } from "@/context/user-context"

// ============================================================
// Types
// ============================================================

export type CareerTrack = 
  | "ai-engineer"
  | "web-developer"
  | "cloud-engineer"
  | "cybersecurity"
  | "data-science"
  | "product-manager"

export type ExperienceLevel = "beginner" | "intermediate" | "advanced"
export type TimeCommitment = "casual" | "moderate" | "intensive"

export interface Skill {
  name: string
  level: number
}

export interface PathwayStep {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
}

export interface Pathway {
  id: string
  title: string
  description: string
  steps: PathwayStep[]
  progress: number
  estimatedTime: string
}

export interface Simulation {
  id: string
  title: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  readinessImpact: number
  isAvailable: boolean
  incidentSummary: string
}

export interface Opportunity {
  id: number
  title: string
  company: string
  location: string
  salary: string
  match: number
  requiredSkills: string[]
  aiRanking: string
  posted: string
  url: string
}

export interface PersonaTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  glowColor: string
  gradient: string
  icon: string
}

export interface PersonaData {
  id: CareerTrack
  title: string
  description: string
  readinessScore: number
  employabilityScore: number
  aiConfidence: number
  skills: Skill[]
  pathways: Pathway[]
  simulations: Simulation[]
  opportunities: Opportunity[]
  aiGuidance: string
  recommendedActions: string[]
  theme: PersonaTheme
}

// ============================================================
// Skill Definitions per Career Track
// ============================================================

const AI_ENGINEER_SKILLS: Skill[] = [
  { name: "Python", level: 85 },
  { name: "TensorFlow", level: 78 },
  { name: "PyTorch", level: 75 },
  { name: "ML Systems", level: 72 },
  { name: "Deep Learning", level: 70 },
  { name: "Data Engineering", level: 68 },
  { name: "Model Deployment", level: 65 },
  { name: "Problem Solving", level: 88 },
  { name: "Communication", level: 75 },
  { name: "Research", level: 80 },
]

const WEB_DEVELOPER_SKILLS: Skill[] = [
  { name: "React", level: 88 },
  { name: "Next.js", level: 85 },
  { name: "TypeScript", level: 82 },
  { name: "Tailwind CSS", level: 80 },
  { name: "JavaScript", level: 90 },
  { name: "UI/UX Design", level: 72 },
  { name: "API Integration", level: 78 },
  { name: "Problem Solving", level: 85 },
  { name: "Communication", level: 80 },
  { name: "Frontend Architecture", level: 75 },
]

const CLOUD_ENGINEER_SKILLS: Skill[] = [
  { name: "AWS", level: 85 },
  { name: "Docker", level: 82 },
  { name: "Kubernetes", level: 78 },
  { name: "Terraform", level: 75 },
  { name: "CI/CD", level: 80 },
  { name: "Linux", level: 83 },
  { name: "Networking", level: 72 },
  { name: "Problem Solving", level: 88 },
  { name: "Communication", level: 78 },
  { name: "Infrastructure Design", level: 80 },
]

const CYBERSECURITY_SKILLS: Skill[] = [
  { name: "Penetration Testing", level: 82 },
  { name: "Network Security", level: 85 },
  { name: "Threat Analysis", level: 80 },
  { name: "Security Tools", level: 78 },
  { name: "Incident Response", level: 75 },
  { name: "Compliance", level: 70 },
  { name: "Risk Assessment", level: 77 },
  { name: "Problem Solving", level: 90 },
  { name: "Communication", level: 75 },
  { name: "Security Architecture", level: 80 },
]

const DATA_SCIENCE_SKILLS: Skill[] = [
  { name: "Python", level: 88 },
  { name: "SQL", level: 85 },
  { name: "Statistics", level: 82 },
  { name: "Machine Learning", level: 80 },
  { name: "Data Visualization", level: 78 },
  { name: "Pandas", level: 85 },
  { name: "NumPy", level: 83 },
  { name: "Problem Solving", level: 87 },
  { name: "Communication", level: 82 },
  { name: "Data Analysis", level: 85 },
]

const PRODUCT_MANAGER_SKILLS: Skill[] = [
  { name: "Product Strategy", level: 85 },
  { name: "User Research", level: 82 },
  { name: "Roadmap Planning", level: 80 },
  { name: "Data Analysis", level: 75 },
  { name: "Agile/Scrum", level: 88 },
  { name: "Stakeholder Management", level: 85 },
  { name: "Communication", level: 90 },
  { name: "Problem Solving", level: 88 },
  { name: "Prioritization", level: 82 },
  { name: "Technical Understanding", level: 72 },
]

// ============================================================
// Pathway Definitions per Career Track
// ============================================================

const AI_ENGINEER_PATHWAYS: Pathway[] = [
  {
    id: "ml-foundation",
    title: "ML Foundation Path",
    description: "Master the fundamentals of machine learning and deep learning",
    steps: [
      { id: "1", title: "Python for ML", description: "Learn Python basics for ML", duration: "2 weeks", completed: false },
      { id: "2", title: "Linear Algebra", description: "Mathematical foundations", duration: "3 weeks", completed: false },
      { id: "3", title: "Statistics", description: "Statistical concepts", duration: "2 weeks", completed: false },
      { id: "4", title: "ML Algorithms", description: "Core ML algorithms", duration: "4 weeks", completed: false },
      { id: "5", title: "Deep Learning", description: "Neural networks", duration: "6 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "17 weeks",
  },
  {
    id: "ml-ops",
    title: "MLOps Engineer Path",
    description: "Deploy and manage ML systems at scale",
    steps: [
      { id: "1", title: "Docker", description: "Containerization", duration: "2 weeks", completed: false },
      { id: "2", title: "Kubernetes", description: "Orchestration", duration: "4 weeks", completed: false },
      { id: "3", title: "CI/CD for ML", description: "ML pipelines", duration: "3 weeks", completed: false },
      { id: "4", title: "Model Monitoring", description: "Production monitoring", duration: "3 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "12 weeks",
  },
]

const WEB_DEVELOPER_PATHWAYS: Pathway[] = [
  {
    id: "frontend-master",
    title: "Frontend Mastery Path",
    description: "Become an expert in modern frontend development",
    steps: [
      { id: "1", title: "JavaScript Fundamentals", description: "Core JS concepts", duration: "3 weeks", completed: false },
      { id: "2", title: "React Basics", description: "React fundamentals", duration: "4 weeks", completed: false },
      { id: "3", title: "TypeScript", description: "Type-safe development", duration: "3 weeks", completed: false },
      { id: "4", title: "Next.js", description: "Full-stack React", duration: "4 weeks", completed: false },
      { id: "5", title: "Performance Optimization", description: "Web performance", duration: "3 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "17 weeks",
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer Path",
    description: "Master both frontend and backend development",
    steps: [
      { id: "1", title: "Node.js", description: "Backend with Node", duration: "4 weeks", completed: false },
      { id: "2", title: "Databases", description: "SQL & NoSQL", duration: "3 weeks", completed: false },
      { id: "3", title: "API Design", description: "REST & GraphQL", duration: "3 weeks", completed: false },
      { id: "4", title: "Authentication", description: "Auth systems", duration: "2 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "12 weeks",
  },
]

const CLOUD_ENGINEER_PATHWAYS: Pathway[] = [
  {
    id: "aws-certified",
    title: "AWS Solutions Architect Path",
    description: "Become an AWS certified solutions architect",
    steps: [
      { id: "1", title: "AWS Core Services", description: "EC2, S3, RDS", duration: "4 weeks", completed: false },
      { id: "2", title: "Networking", description: "VPC, Load Balancing", duration: "3 weeks", completed: false },
      { id: "3", title: "Security", description: "IAM, KMS", duration: "3 weeks", completed: false },
      { id: "4", title: "Serverless", description: "Lambda, API Gateway", duration: "3 weeks", completed: false },
      { id: "5", title: "Architecture Design", description: "Best practices", duration: "4 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "17 weeks",
  },
  {
    id: "devops",
    title: "DevOps Engineer Path",
    description: "Master CI/CD and infrastructure automation",
    steps: [
      { id: "1", title: "Git & GitHub", description: "Version control", duration: "2 weeks", completed: false },
      { id: "2", title: "Docker", description: "Containerization", duration: "3 weeks", completed: false },
      { id: "3", title: "Kubernetes", description: "Container orchestration", duration: "5 weeks", completed: false },
      { id: "4", title: "Terraform", description: "Infrastructure as Code", duration: "4 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "14 weeks",
  },
]

const CYBERSECURITY_PATHWAYS: Pathway[] = [
  {
    id: "security-analyst",
    title: "Security Analyst Path",
    description: "Become a security analyst and threat detector",
    steps: [
      { id: "1", title: "Network Fundamentals", description: "TCP/IP, OSI", duration: "3 weeks", completed: false },
      { id: "2", title: "Security Principles", description: "CIA triad", duration: "2 weeks", completed: false },
      { id: "3", title: "Threat Analysis", description: "Malware analysis", duration: "4 weeks", completed: false },
      { id: "4", title: "SIEM Tools", description: "Security monitoring", duration: "3 weeks", completed: false },
      { id: "5", title: "Incident Response", description: "Security incidents", duration: "4 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "16 weeks",
  },
  {
    id: "pen-tester",
    title: "Penetration Tester Path",
    description: "Learn ethical hacking and vulnerability assessment",
    steps: [
      { id: "1", title: "Linux Security", description: "Linux hardening", duration: "3 weeks", completed: false },
      { id: "2", title: "Web Security", description: "OWASP Top 10", duration: "4 weeks", completed: false },
      { id: "3", title: "Network Pen Testing", description: "Network attacks", duration: "5 weeks", completed: false },
      { id: "4", title: "Report Writing", description: "Security reports", duration: "2 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "14 weeks",
  },
]

const DATA_SCIENCE_PATHWAYS: Pathway[] = [
  {
    id: "data-analyst",
    title: "Data Analyst Path",
    description: "Master data analysis and visualization",
    steps: [
      { id: "1", title: "SQL Fundamentals", description: "Database queries", duration: "3 weeks", completed: false },
      { id: "2", title: "Python for Data", description: "Pandas, NumPy", duration: "4 weeks", completed: false },
      { id: "3", title: "Data Visualization", description: "Matplotlib, Seaborn", duration: "3 weeks", completed: false },
      { id: "4", title: "Statistics", description: "Statistical analysis", duration: "4 weeks", completed: false },
      { id: "5", title: "Business Intelligence", description: "Tableau, Power BI", duration: "3 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "17 weeks",
  },
  {
    id: "ml-engineer",
    title: "ML Engineer Path",
    description: "Build and deploy machine learning models",
    steps: [
      { id: "1", title: "ML Algorithms", description: "Core ML", duration: "5 weeks", completed: false },
      { id: "2", title: "Feature Engineering", description: "Data preprocessing", duration: "3 weeks", completed: false },
      { id: "3", title: "Model Evaluation", description: "Metrics & validation", duration: "3 weeks", completed: false },
      { id: "4", title: "Model Deployment", description: "Production ML", duration: "4 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "15 weeks",
  },
]

const PRODUCT_MANAGER_PATHWAYS: Pathway[] = [
  {
    id: "pm-foundation",
    title: "Product Management Foundation",
    description: "Learn the fundamentals of product management",
    steps: [
      { id: "1", title: "Product Thinking", description: "Product mindset", duration: "2 weeks", completed: false },
      { id: "2", title: "User Research", description: "Understanding users", duration: "3 weeks", completed: false },
      { id: "3", title: "Roadmap Planning", description: "Product roadmaps", duration: "3 weeks", completed: false },
      { id: "4", title: "Prioritization", description: "RICE, MoSCoW", duration: "2 weeks", completed: false },
      { id: "5", title: "Metrics & Analytics", description: "Product metrics", duration: "3 weeks", completed: false },
    ],
    progress: 20,
    estimatedTime: "13 weeks",
  },
  {
    id: "technical-pm",
    title: "Technical Product Manager",
    description: "Manage technical products and engineering teams",
    steps: [
      { id: "1", title: "Technical Fundamentals", description: "Tech basics", duration: "4 weeks", completed: false },
      { id: "2", title: "API Design", description: "API strategy", duration: "3 weeks", completed: false },
      { id: "3", title: "Engineering Collaboration", description: "Working with devs", duration: "3 weeks", completed: false },
      { id: "4", title: "Technical Roadmaps", description: "Tech planning", duration: "3 weeks", completed: false },
    ],
    progress: 0,
    estimatedTime: "13 weeks",
  },
]

// ============================================================
// Simulation Definitions per Career Track
// ============================================================

const AI_ENGINEER_SIMULATIONS: Simulation[] = [
  {
    id: "production-ai-incident",
    title: "Production AI Incident",
    category: "AI Systems",
    difficulty: "Advanced",
    duration: "15 min",
    readinessImpact: 25,
    isAvailable: true,
    incidentSummary: "Recommendation engine degrading after model rollout. Spiking latency and collapsing confidence scores.",
  },
  {
    id: "rec-engine-drift",
    title: "Recommendation Engine Drift",
    category: "AI Systems",
    difficulty: "Intermediate",
    duration: "15 min",
    readinessImpact: 20,
    isAvailable: true,
    incidentSummary: "Slow conversion drop over 72 hours tracked to embedding space drift. Investigate feature pipelines.",
  },
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
]

const WEB_DEVELOPER_SIMULATIONS: Simulation[] = [
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
  {
    id: "production-ai-incident",
    title: "Production AI Incident",
    category: "AI Systems",
    difficulty: "Advanced",
    duration: "15 min",
    readinessImpact: 25,
    isAvailable: true,
    incidentSummary: "Recommendation engine degrading after model rollout. Spiking latency and collapsing confidence scores.",
  },
  {
    id: "rec-engine-drift",
    title: "Recommendation Engine Drift",
    category: "AI Systems",
    difficulty: "Intermediate",
    duration: "15 min",
    readinessImpact: 20,
    isAvailable: true,
    incidentSummary: "Slow conversion drop over 72 hours tracked to embedding space drift. Investigate feature pipelines.",
  },
]

const CLOUD_ENGINEER_SIMULATIONS: Simulation[] = [
  {
    id: "k8s-regional-failure",
    title: "Kubernetes Regional Failure",
    category: "Cloud Infrastructure",
    difficulty: "Advanced",
    duration: "20 min",
    readinessImpact: 30,
    isAvailable: true,
    incidentSummary: "Complete loss of us-east-1 control plane during peak traffic. Cross-region failover failing.",
  },
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
  {
    id: "security-token-breach",
    title: "Security Token Breach",
    category: "Security",
    difficulty: "Advanced",
    duration: "25 min",
    readinessImpact: 35,
    isAvailable: true,
    incidentSummary: "GitHub admin token leaked in public repository. Active data exfiltration detected.",
  },
]

const CYBERSECURITY_SIMULATIONS: Simulation[] = [
  {
    id: "security-token-breach",
    title: "Security Token Breach",
    category: "Security",
    difficulty: "Advanced",
    duration: "25 min",
    readinessImpact: 35,
    isAvailable: true,
    incidentSummary: "GitHub admin token leaked in public repository. Active data exfiltration detected.",
  },
  {
    id: "k8s-regional-failure",
    title: "Kubernetes Regional Failure",
    category: "Cloud Infrastructure",
    difficulty: "Advanced",
    duration: "20 min",
    readinessImpact: 30,
    isAvailable: true,
    incidentSummary: "Complete loss of us-east-1 control plane during peak traffic. Cross-region failover failing.",
  },
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
]

const DATA_SCIENCE_SIMULATIONS: Simulation[] = [
  {
    id: "rec-engine-drift",
    title: "Recommendation Engine Drift",
    category: "AI Systems",
    difficulty: "Intermediate",
    duration: "15 min",
    readinessImpact: 20,
    isAvailable: true,
    incidentSummary: "Slow conversion drop over 72 hours tracked to embedding space drift. Investigate feature pipelines.",
  },
  {
    id: "production-ai-incident",
    title: "Production AI Incident",
    category: "AI Systems",
    difficulty: "Advanced",
    duration: "15 min",
    readinessImpact: 25,
    isAvailable: true,
    incidentSummary: "Recommendation engine degrading after model rollout. Spiking latency and collapsing confidence scores.",
  },
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
]

const PRODUCT_MANAGER_SIMULATIONS: Simulation[] = [
  {
    id: "cicd-meltdown",
    title: "CI/CD Pipeline Meltdown",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "10 min",
    readinessImpact: 15,
    isAvailable: true,
    incidentSummary: "Build times increased by 400% blocking all hotfixes. Runner pools exhausted.",
  },
  {
    id: "k8s-regional-failure",
    title: "Kubernetes Regional Failure",
    category: "Cloud Infrastructure",
    difficulty: "Advanced",
    duration: "20 min",
    readinessImpact: 30,
    isAvailable: true,
    incidentSummary: "Complete loss of us-east-1 control plane during peak traffic. Cross-region failover failing.",
  },
  {
    id: "production-ai-incident",
    title: "Production AI Incident",
    category: "AI Systems",
    difficulty: "Advanced",
    duration: "15 min",
    readinessImpact: 25,
    isAvailable: true,
    incidentSummary: "Recommendation engine degrading after model rollout. Spiking latency and collapsing confidence scores.",
  },
]

// ============================================================
// Opportunity Definitions per Career Track
// ============================================================

const AI_ENGINEER_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "ML Engineer",
    company: "Google DeepMind",
    location: "Mountain View, CA",
    salary: "$180k - $250k",
    match: 92,
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
    aiRanking: "Excellent Match",
    posted: "2 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=ML%20Engineer%20DeepMind&location=Mountain%20View",
  },
  {
    id: 2,
    title: "AI Research Scientist",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$200k - $300k",
    match: 88,
    requiredSkills: ["Research", "PyTorch", "Deep Learning", "Publications"],
    aiRanking: "Strong Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=AI%20Research%20Scientist%20OpenAI&location=San%20Francisco",
  },
  {
    id: 3,
    title: "MLOps Engineer",
    company: "Scale AI",
    location: "Remote",
    salary: "$160k - $220k",
    match: 85,
    requiredSkills: ["MLOps", "Kubernetes", "Python", "AWS"],
    aiRanking: "Good Match",
    posted: "3 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=MLOps%20Engineer&location=Remote",
  },
]

const WEB_DEVELOPER_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "$150k - $200k",
    match: 90,
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind"],
    aiRanking: "Excellent Match",
    posted: "1 day ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Frontend%20Engineer%20Vercel&location=Remote",
  },
  {
    id: 2,
    title: "Full-Stack Developer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$170k - $230k",
    match: 85,
    requiredSkills: ["React", "Node.js", "TypeScript", "API Design"],
    aiRanking: "Strong Match",
    posted: "4 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer%20Stripe&location=San%20Francisco",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Airbnb",
    location: "Remote",
    salary: "$140k - $190k",
    match: 82,
    requiredSkills: ["React", "JavaScript", "UI/UX", "Performance"],
    aiRanking: "Good Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer%20Airbnb&location=Remote",
  },
]

const CLOUD_ENGINEER_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Cloud Solutions Architect",
    company: "Amazon Web Services",
    location: "Seattle, WA",
    salary: "$180k - $260k",
    match: 92,
    requiredSkills: ["AWS", "Kubernetes", "Terraform", "Architecture"],
    aiRanking: "Excellent Match",
    posted: "2 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Cloud%20Solutions%20Architect%20AWS&location=Seattle",
  },
  {
    id: 2,
    title: "DevOps Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    salary: "$160k - $220k",
    match: 88,
    requiredSkills: ["Kubernetes", "CI/CD", "Docker", "Linux"],
    aiRanking: "Strong Match",
    posted: "5 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=DevOps%20Engineer%20Netflix&location=Los%20Gatos",
  },
  {
    id: 3,
    title: "Site Reliability Engineer",
    company: "Google Cloud",
    location: "Mountain View, CA",
    salary: "$170k - $240k",
    match: 85,
    requiredSkills: ["Kubernetes", "Monitoring", "Linux", "Networking"],
    aiRanking: "Good Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Site%20Reliability%20Engineer%20Google&location=Mountain%20View",
  },
]

const CYBERSECURITY_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Security Engineer",
    company: "CrowdStrike",
    location: "Remote",
    salary: "$160k - $220k",
    match: 90,
    requiredSkills: ["Penetration Testing", "Security Tools", "Threat Analysis"],
    aiRanking: "Excellent Match",
    posted: "3 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Security%20Engineer%20CrowdStrike&location=Remote",
  },
  {
    id: 2,
    title: "SOC Analyst",
    company: "Palo Alto Networks",
    location: "Santa Clara, CA",
    salary: "$130k - $180k",
    match: 85,
    requiredSkills: ["Incident Response", "SIEM", "Security Monitoring"],
    aiRanking: "Strong Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=SOC%20Analyst%20Palo%20Alto&location=Santa%20Clara",
  },
  {
    id: 3,
    title: "Penetration Tester",
    company: "IBM Security",
    location: "Remote",
    salary: "$140k - $190k",
    match: 82,
    requiredSkills: ["Penetration Testing", "Network Security", "Report Writing"],
    aiRanking: "Good Match",
    posted: "5 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Penetration%20Tester%20IBM&location=Remote",
  },
]

const DATA_SCIENCE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Data Scientist",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$170k - $240k",
    match: 90,
    requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL"],
    aiRanking: "Excellent Match",
    posted: "2 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist%20Meta&location=Menlo%20Park",
  },
  {
    id: 2,
    title: "ML Engineer",
    company: "Spotify",
    location: "New York, NY",
    salary: "$160k - $220k",
    match: 85,
    requiredSkills: ["Python", "TensorFlow", "MLOps", "Data Engineering"],
    aiRanking: "Strong Match",
    posted: "4 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=ML%20Engineer%20Spotify&location=New%20York",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Netflix",
    location: "Los Gatos, CA",
    salary: "$130k - $180k",
    match: 82,
    requiredSkills: ["SQL", "Python", "Data Visualization", "Statistics"],
    aiRanking: "Good Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst%20Netflix&location=Los%20Gatos",
  },
]

const PRODUCT_MANAGER_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Senior Product Manager",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$180k - $250k",
    match: 88,
    requiredSkills: ["Product Strategy", "User Research", "Roadmap Planning"],
    aiRanking: "Strong Match",
    posted: "3 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Product%20Manager%20Google&location=Mountain%20View",
  },
  {
    id: 2,
    title: "Technical Product Manager",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: "$170k - $230k",
    match: 85,
    requiredSkills: ["Technical Understanding", "Agile/Scrum", "Stakeholder Management"],
    aiRanking: "Good Match",
    posted: "1 week ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Technical%20Product%20Manager%20Microsoft&location=Redmond",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$150k - $210k",
    match: 82,
    requiredSkills: ["Product Strategy", "Data Analysis", "Communication"],
    aiRanking: "Good Match",
    posted: "5 days ago",
    url: "https://www.linkedin.com/jobs/search/?keywords=Product%20Manager%20Stripe&location=San%20Francisco",
  },
]

// ============================================================
// Theme Definitions per Career Track
// ============================================================

const AI_ENGINEER_THEME: PersonaTheme = {
  primaryColor: "cyan",
  secondaryColor: "purple",
  accentColor: "fuchsia",
  glowColor: "rgba(0, 255, 255, 0.3)",
  gradient: "from-cyan-500 to-purple-600",
  icon: "🧠",
}

const WEB_DEVELOPER_THEME: PersonaTheme = {
  primaryColor: "blue",
  secondaryColor: "indigo",
  accentColor: "sky",
  glowColor: "rgba(59, 130, 246, 0.3)",
  gradient: "from-blue-500 to-indigo-600",
  icon: "💻",
}

const CLOUD_ENGINEER_THEME: PersonaTheme = {
  primaryColor: "sky",
  secondaryColor: "blue",
  accentColor: "cyan",
  glowColor: "rgba(14, 165, 233, 0.3)",
  gradient: "from-sky-500 to-blue-600",
  icon: "☁️",
}

const CYBERSECURITY_THEME: PersonaTheme = {
  primaryColor: "red",
  secondaryColor: "orange",
  accentColor: "amber",
  glowColor: "rgba(239, 68, 68, 0.3)",
  gradient: "from-red-500 to-orange-600",
  icon: "🛡️",
}

const DATA_SCIENCE_THEME: PersonaTheme = {
  primaryColor: "emerald",
  secondaryColor: "teal",
  accentColor: "green",
  glowColor: "rgba(16, 185, 129, 0.3)",
  gradient: "from-emerald-500 to-teal-600",
  icon: "📊",
}

const PRODUCT_MANAGER_THEME: PersonaTheme = {
  primaryColor: "violet",
  secondaryColor: "purple",
  accentColor: "fuchsia",
  glowColor: "rgba(139, 92, 246, 0.3)",
  gradient: "from-violet-500 to-purple-600",
  icon: "📋",
}

// ============================================================
// Persona Data Map
// ============================================================

export const PERSONA_DATA: Record<CareerTrack, PersonaData> = {
  "ai-engineer": {
    id: "ai-engineer",
    title: "AI Engineer",
    description: "Build intelligent systems and machine learning models",
    readinessScore: 720,
    employabilityScore: 85,
    aiConfidence: 78,
    skills: AI_ENGINEER_SKILLS,
    pathways: AI_ENGINEER_PATHWAYS,
    simulations: AI_ENGINEER_SIMULATIONS,
    opportunities: AI_ENGINEER_OPPORTUNITIES,
    aiGuidance: "Focus on mastering deep learning frameworks and MLOps practices. Your strong Python foundation is excellent - build production-ready ML systems.",
    recommendedActions: [
      "Complete TensorFlow certification",
      "Build a portfolio of ML projects",
      "Learn Kubernetes for model deployment",
      "Study MLOps best practices",
      "Contribute to open-source ML projects",
    ],
    theme: AI_ENGINEER_THEME,
  },
  "web-developer": {
    id: "web-developer",
    title: "Web Developer",
    description: "Create modern web applications and user interfaces",
    readinessScore: 750,
    employabilityScore: 88,
    aiConfidence: 82,
    skills: WEB_DEVELOPER_SKILLS,
    pathways: WEB_DEVELOPER_PATHWAYS,
    simulations: WEB_DEVELOPER_SIMULATIONS,
    opportunities: WEB_DEVELOPER_OPPORTUNITIES,
    aiGuidance: "Your React and Next.js skills are strong. Focus on performance optimization and advanced UI patterns to stand out.",
    recommendedActions: [
      "Master advanced React patterns",
      "Learn performance optimization",
      "Build a portfolio of web apps",
      "Contribute to open-source React projects",
      "Study accessibility best practices",
    ],
    theme: WEB_DEVELOPER_THEME,
  },
  "cloud-engineer": {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    description: "Design and manage cloud infrastructure at scale",
    readinessScore: 730,
    employabilityScore: 86,
    aiConfidence: 80,
    skills: CLOUD_ENGINEER_SKILLS,
    pathways: CLOUD_ENGINEER_PATHWAYS,
    simulations: CLOUD_ENGINEER_SIMULATIONS,
    opportunities: CLOUD_ENGINEER_OPPORTUNITIES,
    aiGuidance: "Your AWS and Kubernetes knowledge is solid. Focus on infrastructure as code and cost optimization to advance.",
    recommendedActions: [
      "Get AWS Solutions Architect certified",
      "Master Terraform and IaC",
      "Learn cost optimization strategies",
      "Build cloud architecture portfolio",
      "Study security best practices",
    ],
    theme: CLOUD_ENGINEER_THEME,
  },
  cybersecurity: {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    description: "Protect systems and data from security threats",
    readinessScore: 700,
    employabilityScore: 84,
    aiConfidence: 76,
    skills: CYBERSECURITY_SKILLS,
    pathways: CYBERSECURITY_PATHWAYS,
    simulations: CYBERSECURITY_SIMULATIONS,
    opportunities: CYBERSECURITY_OPPORTUNITIES,
    aiGuidance: "Your threat analysis skills are strong. Focus on advanced penetration testing and incident response to specialize.",
    recommendedActions: [
      "Get security certifications (CEH, CISSP)",
      "Practice on CTF platforms",
      "Build a security lab",
      "Study cloud security",
      "Learn incident response procedures",
    ],
    theme: CYBERSECURITY_THEME,
  },
  "data-science": {
    id: "data-science",
    title: "Data Scientist",
    description: "Extract insights from data using statistical methods",
    readinessScore: 740,
    employabilityScore: 87,
    aiConfidence: 81,
    skills: DATA_SCIENCE_SKILLS,
    pathways: DATA_SCIENCE_PATHWAYS,
    simulations: DATA_SCIENCE_SIMULATIONS,
    opportunities: DATA_SCIENCE_OPPORTUNITIES,
    aiGuidance: "Your Python and SQL skills are excellent. Focus on advanced ML techniques and model deployment to advance.",
    recommendedActions: [
      "Complete Kaggle competitions",
      "Build a data portfolio",
      "Learn MLOps for deployment",
      "Study advanced ML algorithms",
      "Master data visualization tools",
    ],
    theme: DATA_SCIENCE_THEME,
  },
  "product-manager": {
    id: "product-manager",
    title: "Product Manager",
    description: "Define product strategy and lead cross-functional teams",
    readinessScore: 710,
    employabilityScore: 83,
    aiConfidence: 77,
    skills: PRODUCT_MANAGER_SKILLS,
    pathways: PRODUCT_MANAGER_PATHWAYS,
    simulations: PRODUCT_MANAGER_SIMULATIONS,
    opportunities: PRODUCT_MANAGER_OPPORTUNITIES,
    aiGuidance: "Your communication and stakeholder management skills are strong. Focus on technical understanding and data-driven decision making.",
    recommendedActions: [
      "Build a product portfolio",
      "Learn technical fundamentals",
      "Master data analysis tools",
      "Study product metrics",
      "Practice user research methods",
    ],
    theme: PRODUCT_MANAGER_THEME,
  },
}

// ============================================================
// Helper Functions
// ============================================================

export function getPersonaData(careerTrack: CareerTrack): PersonaData {
  return PERSONA_DATA[careerTrack]
}

export function getAllPersonas(): PersonaData[] {
  return Object.values(PERSONA_DATA)
}

export function getPersonaById(id: string): PersonaData | undefined {
  return PERSONA_DATA[id as CareerTrack]
}

export function adjustPersonaForExperience(
  persona: PersonaData,
  experience: ExperienceLevel
): PersonaData {
  const multiplier = experience === "beginner" ? 0.7 : experience === "intermediate" ? 0.85 : 1.0
  
  return {
    ...persona,
    readinessScore: Math.floor(persona.readinessScore * multiplier),
    employabilityScore: Math.floor(persona.employabilityScore * multiplier),
    aiConfidence: Math.floor(persona.aiConfidence * multiplier),
    skills: persona.skills.map(skill => ({
      ...skill,
      level: Math.floor(skill.level * multiplier),
    })),
  }
}

export function adjustPersonaForTimeCommitment(
  persona: PersonaData,
  commitment: TimeCommitment
): PersonaData {
  const pathwayMultiplier = commitment === "casual" ? 0.5 : commitment === "moderate" ? 0.75 : 1.0
  
  return {
    ...persona,
    pathways: persona.pathways.map(pathway => ({
      ...pathway,
      progress: Math.floor(pathway.progress * pathwayMultiplier),
    })),
  }
}
