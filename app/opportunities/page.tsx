"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Briefcase,
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Star,
  Filter,
  ArrowRight,
} from "lucide-react"

import { useUserProgress } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import PageTransition from "@/components/common/PageTransition"
import { Sidebar, TopBar, BottomNav } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal"
import { OpportunityFilters } from "@/components/opportunities/OpportunityFilters"

export default function OpportunitiesPage() {
  const router = useRouter()
  const { progress, profile, hasHydrated } = useUserProgress()
  const { isAuthenticated, isLoading } = useAuth()
  type Opportunity = {
  id: number
  title: string
  company: string
  
}
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<any | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({
    matchPercentage: null as number | null,
    workType: null as string | null,
    location: "",
    topMatchesOnly: false,
    searchQuery: "",
  })

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  React.useEffect(() => {
    if (!hasHydrated || isLoading) return
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }
    if (!profile.onboardingComplete) {
      router.replace("/onboarding")
    }
  }, [hasHydrated, isLoading, isAuthenticated, profile.onboardingComplete, router])

  if (!hasHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  

  const mockOpportunities = [
    {
      id: 1,
      title: "Senior ML Engineer",
      company: "TechCorp AI",
      location: "San Francisco, CA",
      salary: "$180k - $250k",
      match: 92,
      requiredSkills: ["Python", "Machine Learning", "TensorFlow", "MLOps"],
      aiRanking: "Top Match",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "AI Product Manager",
      company: "DataFlow Inc",
      location: "Remote",
      salary: "$160k - $220k",
      match: 88,
      requiredSkills: ["Product Management", "AI/ML", "Strategy", "Analytics"],
      aiRanking: "High Match",
      posted: "3 days ago",
    },
    {
      id: 3,
      title: "Platform Engineer",
      company: "CloudScale",
      location: "New York, NY",
      salary: "$150k - $200k",
      match: 85,
      requiredSkills: ["Kubernetes", "Cloud Infrastructure", "DevOps", "Go"],
      aiRanking: "Strong Match",
      posted: "1 week ago",
    },
    {
      id: 4,
      title: "Research Scientist",
      company: "DeepMind Labs",
      location: "London, UK",
      salary: "$140k - $190k",
      match: 82,
      requiredSkills: ["Research", "PyTorch", "Deep Learning", "Publications"],
      aiRanking: "Good Match",
      posted: "5 days ago",
    },
    {
      id: 5,
      title: "ML Infrastructure Lead",
      company: "Scale AI",
      location: "Remote",
      salary: "$200k - $280k",
      match: 78,
      requiredSkills: ["MLOps", "Infrastructure", "Python", "AWS"],
      aiRanking: "Good Match",
      posted: "1 week ago",
    },
    {
      id: 6,
      title: "Data Science Manager",
      company: "Analytics Pro",
      location: "Chicago, IL",
      salary: "$170k - $230k",
      match: 75,
      requiredSkills: ["Leadership", "Data Science", "SQL", "Team Management"],
      aiRanking: "Moderate Match",
      posted: "2 weeks ago",
    },
  ]

  const opportunities = progress.opportunities || []
  const employabilityScore = progress.employabilityScore

  const filteredOpportunities = React.useMemo(() => {
    
    let filtered = [...mockOpportunities]

    if (filters.matchPercentage !== null) {
      filtered = filtered.filter((o) => o.match >= filters.matchPercentage!)
    }

    if (filters.topMatchesOnly) {
      filtered = filtered.filter((o) => o.match >= 85)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.company.toLowerCase().includes(query) ||
          o.requiredSkills.some((skill) => skill.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [filters, mockOpportunities])

  if (!hasHydrated || !profile.onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen overflow-hidden bg-background text-foreground">
          <Sidebar />

          <div className="relative lg:pl-64">
            <TopBar />

            <main className="relative space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="font-[var(--font-syne)] text-2xl font-bold tracking-tight sm:text-3xl">
                  Opportunity Intelligence
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI-ranked career opportunities matched to your profile
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsFiltersOpen(true)}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Total Matches</span>
                </div>
                <div className="text-2xl font-bold">{filteredOpportunities.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Top Matches</span>
                </div>
                <div className="text-2xl font-bold">
                  {filteredOpportunities.filter((o) => o.match >= 85).length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Avg Match</span>
                </div>
                <div className="text-2xl font-bold">
                  {filteredOpportunities.length > 0
                    ? `${Math.round(filteredOpportunities.reduce((a, b) => a + b.match, 0) / filteredOpportunities.length)}%`
                    : "0%"}
                </div>
              </div>
            </motion.div>

            {/* Opportunities List */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-4"
            >
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.3 + index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                          <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
                          <Star className="h-3 w-3 text-primary" />
                          <span className="text-sm font-semibold text-primary">{opportunity.match}%</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{opportunity.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{opportunity.posted}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {opportunity.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>{opportunity.aiRanking}</span>
                      </div>
                      <Button size="sm" className="gap-2" onClick={() => setSelectedOpportunity(opportunity)}>
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">AI Opportunity Insights</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <TrendingUp className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">High employability score</p>
                    <p className="text-xs text-muted-foreground">
                      Your {employabilityScore}% employability score makes you competitive for senior roles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Strong pathway alignment</p>
                    <p className="text-xs text-muted-foreground">
                      Opportunities match your {profile.careerGoal || "career pathway"} specialization
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Skill requirements met</p>
                    <p className="text-xs text-muted-foreground">
                      Your tracked skills align with {filteredOpportunities.filter((o) => o.match >= 80).length} top opportunities
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>

        <BottomNav />
      </div>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />

      <OpportunityFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </PageTransition>
    </ProtectedRoute>
  )
}
