export interface Milestone {
    id: string
    label: string
    status: "completed" | "active" | "upcoming" | "locked"
    skills: string[]
    readiness: number
    salaryRange: string
    growthOutlook: string
    growthPercent: string
    probability: number
  
    nextAction: {
      title: string
      cta: string
    }
  }
  
  export interface CareerPath {
    id: string
    name: string
    color: string
    colorRgba: string
    milestones: Milestone[]
  }