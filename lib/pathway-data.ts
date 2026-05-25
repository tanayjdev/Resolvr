import type { CareerPath, Milestone } from "./types"



export const pathways: CareerPath[] = [
  {
    id: 'ml-engineer',
    name: 'ML Engineer',
    color: '#00C6FF',
    colorRgba: 'rgba(0, 198, 255, 0.6)',
    milestones: [
      {
        id: 'dsa',
        label: 'DSA Fundamentals',
        status: 'completed',
        skills: ['Python', 'Algorithms', 'Data Structures'],
        readiness: 100,
        salaryRange: '₹4L – ₹8L (Year 1)',
        growthOutlook: 'Foundation skill · Essential',
        growthPercent: '+12%',
        probability: 95,
        nextAction: { title: 'Review Advanced DSA', cta: 'Start Review →' }
      },
      {
        id: 'ml-foundations',
        label: 'ML Foundations',
        status: 'completed',
        skills: ['Python', 'NumPy', 'Scikit-learn', 'Statistics'],
        readiness: 100,
        salaryRange: '₹6L – ₹12L (Year 1)',
        growthOutlook: 'High demand · +28% YoY',
        growthPercent: '+28%',
        probability: 92,
        nextAction: { title: 'Deep Learning Specialization', cta: 'Explore →' }
      },
      {
        id: 'gsoc',
        label: 'Open Source (GSoC)',
        status: 'active',
        skills: ['Git/GitHub', 'Open Source', 'ML Basics', 'Communication'],
        readiness: 61,
        salaryRange: '₹8L – ₹18L (Year 3)',
        growthOutlook: 'High demand · +34% YoY',
        growthPercent: '+34%',
        probability: 72,
        nextAction: { title: 'Complete the Open Source Simulation', cta: 'Start Now →' }
      },
      {
        id: 'ai-internship',
        label: 'AI Internship',
        status: 'upcoming',
        skills: ['Deep Learning', 'MLOps', 'System Design', 'Teamwork'],
        readiness: 35,
        salaryRange: '₹12L – ₹24L (Year 2)',
        growthOutlook: 'Very high demand · +42% YoY',
        growthPercent: '+42%',
        probability: 58,
        nextAction: { title: 'Build AI Portfolio Project', cta: 'Get Started →' }
      },
      {
        id: 'ml-engineer',
        label: 'ML Engineer',
        status: 'locked',
        skills: ['Production ML', 'Cloud Infra', 'Leadership', 'Research'],
        readiness: 15,
        salaryRange: '₹18L – ₹45L (Year 3)',
        growthOutlook: 'Elite demand · +48% YoY',
        growthPercent: '+48%',
        probability: 42,
        nextAction: { title: 'Complete Prerequisites', cta: 'View Path →' }
      }
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    color: '#7B2FFF',
    colorRgba: 'rgba(123, 47, 255, 0.6)',
    milestones: [
      {
        id: 'comm-skills',
        label: 'Communication Skills',
        status: 'completed',
        skills: ['Writing', 'Presentation', 'Stakeholder Mgmt'],
        readiness: 100,
        salaryRange: '₹4L – ₹8L (Year 1)',
        growthOutlook: 'Foundation · Essential',
        growthPercent: '+15%',
        probability: 95,
        nextAction: { title: 'Advanced Communication', cta: 'Continue →' }
      },
      {
        id: 'product-thinking',
        label: 'Product Thinking',
        status: 'active',
        skills: ['User Research', 'Analytics', 'Strategy', 'Roadmapping'],
        readiness: 55,
        salaryRange: '₹6L – ₹14L (Year 1)',
        growthOutlook: 'High demand · +25% YoY',
        growthPercent: '+25%',
        probability: 78,
        nextAction: { title: 'Product Case Study', cta: 'Start Now →' }
      },
      {
        id: 'pm-internship',
        label: 'PM Internship',
        status: 'upcoming',
        skills: ['Agile', 'Metrics', 'Cross-functional', 'Leadership'],
        readiness: 30,
        salaryRange: '₹10L – ₹20L (Year 2)',
        growthOutlook: 'Very high demand · +32% YoY',
        growthPercent: '+32%',
        probability: 62,
        nextAction: { title: 'Mock PM Interview', cta: 'Practice →' }
      },
      {
        id: 'zero-one',
        label: '0→1 Product',
        status: 'upcoming',
        skills: ['MVP Building', 'User Feedback', 'Iteration', 'Vision'],
        readiness: 18,
        salaryRange: '₹14L – ₹28L (Year 2)',
        growthOutlook: 'High demand · +30% YoY',
        growthPercent: '+30%',
        probability: 48,
        nextAction: { title: 'Build Your First Product', cta: 'Start →' }
      },
      {
        id: 'pm-role',
        label: 'PM Role',
        status: 'locked',
        skills: ['Strategy', 'Leadership', 'P&L', 'Team Building'],
        readiness: 10,
        salaryRange: '₹20L – ₹50L (Year 3)',
        growthOutlook: 'Elite demand · +35% YoY',
        growthPercent: '+35%',
        probability: 35,
        nextAction: { title: 'Complete Prerequisites', cta: 'View Path →' }
      }
    ]
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Achitect',
    color: '#00D4A0',
    colorRgba: 'rgba(212, 0, 166, 0.6)',
    milestones: [
      {
        id: 'linux',
        label: 'Linux & Networking',
        status: 'completed',
        skills: ['Linux', 'Networking', 'Shell Scripting', 'Security'],
        readiness: 100,
        salaryRange: '₹4L – ₹10L (Year 1)',
        growthOutlook: 'Foundation · Essential',
        growthPercent: '+18%',
        probability: 90,
        nextAction: { title: 'Advanced Linux Admin', cta: 'Continue →' }
      },
      {
        id: 'cloud-certs',
        label: 'Cloud Certs',
        status: 'active',
        skills: ['AWS', 'GCP', 'Azure', 'Terraform'],
        readiness: 68,
        salaryRange: '₹8L – ₹16L (Year 1)',
        growthOutlook: 'Very high demand · +38% YoY',
        growthPercent: '+38%',
        probability: 82,
        nextAction: { title: 'AWS Solutions Architect', cta: 'Start Prep →' }
      },
      {
        id: 'cicd',
        label: 'CI/CD Project',
        status: 'upcoming',
        skills: ['Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes'],
        readiness: 42,
        salaryRange: '₹10L – ₹22L (Year 2)',
        growthOutlook: 'High demand · +35% YoY',
        growthPercent: '+35%',
        probability: 70,
        nextAction: { title: 'Build CI/CD Pipeline', cta: 'Start Project →' }
      },
      {
        id: 'devops-intern',
        label: 'DevOps Internship',
        status: 'upcoming',
        skills: ['Infrastructure', 'Monitoring', 'SRE', 'Automation'],
        readiness: 25,
        salaryRange: '₹14L – ₹28L (Year 2)',
        growthOutlook: 'Very high demand · +40% YoY',
        growthPercent: '+40%',
        probability: 55,
        nextAction: { title: 'SRE Fundamentals Course', cta: 'Enroll →' }
      },
      {
        id: 'cloud-architect',
        label: 'Cloud Architect',
        status: 'locked',
        skills: ['Architecture', 'Team Lead', 'Cost Optimization', 'Strategy'],
        readiness: 12,
        salaryRange: '₹22L – ₹55L (Year 3)',
        growthOutlook: 'Elite demand · +45% YoY',
        growthPercent: '+45%',
        probability: 38,
        nextAction: { title: 'Complete Prerequisites', cta: 'View Path →' }
      }
    ]
  },
  {
    id: 'research-scientist',
    name: 'Research Scientist',
    color: '#FFB547',
    colorRgba: 'rgba(255, 181, 71, 0.6)',
    milestones: [
      {
        id: 'advanced-math',
        label: 'Advanced Math',
        status: 'completed',
        skills: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics'],
        readiness: 100,
        salaryRange: '₹3L – ₹6L (Year 1)',
        growthOutlook: 'Foundation · Essential',
        growthPercent: '+10%',
        probability: 88,
        nextAction: { title: 'Optimization Theory', cta: 'Continue →' }
      },
      {
        id: 'research-paper',
        label: 'Research Paper',
        status: 'active',
        skills: ['Literature Review', 'Methodology', 'Writing', 'Peer Review'],
        readiness: 45,
        salaryRange: '₹5L – ₹12L (Year 1)',
        growthOutlook: 'Growing demand · +22% YoY',
        growthPercent: '+22%',
        probability: 65,
        nextAction: { title: 'Submit to ArXiv', cta: 'Prepare Draft →' }
      },
      {
        id: 'lab-internship',
        label: 'Lab Internship',
        status: 'upcoming',
        skills: ['Experimentation', 'Lab Skills', 'Collaboration', 'Data Analysis'],
        readiness: 28,
        salaryRange: '₹8L – ₹18L (Year 2)',
        growthOutlook: 'Moderate demand · +20% YoY',
        growthPercent: '+20%',
        probability: 52,
        nextAction: { title: 'Apply to Research Labs', cta: 'Browse Labs →' }
      },
      {
        id: 'conference',
        label: 'Conference Talk',
        status: 'upcoming',
        skills: ['Public Speaking', 'Networking', 'Domain Expertise', 'Presentation'],
        readiness: 15,
        salaryRange: '₹12L – ₹25L (Year 2)',
        growthOutlook: 'Niche demand · +18% YoY',
        growthPercent: '+18%',
        probability: 40,
        nextAction: { title: 'Submit Paper to Conference', cta: 'View CFPs →' }
      },
      {
        id: 'research-role',
        label: 'Research Role',
        status: 'locked',
        skills: ['PhD Track', 'Publications', 'Grant Writing', 'Mentorship'],
        readiness: 8,
        salaryRange: '₹15L – ₹40L (Year 3)',
        growthOutlook: 'Elite · Specialized demand',
        growthPercent: '+25%',
        probability: 28,
        nextAction: { title: 'Complete Prerequisites', cta: 'View Path →' }
      }
    ]
  }
]

export const timelineMarkers = [
  { label: 'Now', position: 0 },
  { label: 'Year 1', position: 25 },
  { label: 'Year 2', position: 50 },
  { label: 'Year 3', position: 75 },
  { label: 'Placement', position: 100 }
]

export const filterOptions = [
  { id: 'all', label: 'All Paths' },
  { id: 'roi', label: 'High ROI' },
  { id: 'passion', label: 'Passion Aligned' },
  { id: 'fastest', label: 'Fastest Growth' }
]

export const legendItems = [
  { status: 'completed', label: 'Completed', fill: true, dashed: false },
  { status: 'active', label: 'Active', fill: true, dashed: false },
  { status: 'upcoming', label: 'Upcoming', fill: false, dashed: false },
  { status: 'locked', label: 'Locked', fill: false, dashed: true }
]
