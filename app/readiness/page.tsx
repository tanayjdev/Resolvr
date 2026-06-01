"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Target,
  TrendingUp,
  Shield,
  Zap,
  Award,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
} from "lucide-react"

import { useUserProgress } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"
import { usePersona } from "@/context/persona-context"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import PageTransition from "@/components/common/PageTransition"
import { Sidebar, TopBar, BottomNav } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"

export default function ReadinessPage() {
  const router = useRouter()
  const { progress, profile, hasHydrated } = useUserProgress()
  const { isAuthenticated, isLoading } = useAuth()
  const { persona } = usePersona()

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

  // Use persona-specific readiness scores if available
  const readinessScore = persona?.readinessScore || progress.readinessScore
  const employabilityScore = persona?.employabilityScore || progress.employabilityScore
  const aiConfidence = progress.aiConfidence
  const simulationMemory = progress.simulationMemory

  const readinessLevel = readinessScore >= 800 ? "Expert" : readinessScore >= 600 ? "Advanced" : readinessScore >= 400 ? "Intermediate" : "Beginner"
  const readinessColor = readinessScore >= 800 ? "text-emerald-400" : readinessScore >= 600 ? "text-primary" : readinessScore >= 400 ? "text-amber-400" : "text-orange-400"

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
                    Employability Readiness
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your AI-powered career readiness analysis
                  </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {readinessLevel} Level
                </span>
              </div>
            </motion.div>

            {/* Main Readiness Score */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-semibold text-lg">Overall Readiness Score</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-5xl font-bold">{readinessScore}</div>
                    <div className="mb-2 text-sm text-muted-foreground">/ 1000</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className={cn("h-4 w-4", readinessColor)} />
                    <span className={cn("text-sm font-medium", readinessColor)}>
                      {readinessLevel} readiness level
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-lg">Employability Score</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-5xl font-bold">{employabilityScore}</div>
                    <div className="mb-2 text-sm text-muted-foreground">%</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Competitive for {profile.careerGoal || "your pathway"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <span>AI Confidence</span>
                </div>
                <div className="text-2xl font-bold">{aiConfidence}%</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {aiConfidence >= 80 ? "High confidence" : aiConfidence >= 50 ? "Moderate confidence" : "Building confidence"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Simulations</span>
                </div>
                <div className="text-2xl font-bold">{progress.simulationsCompleted}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {simulationMemory.totalSimulations} total runs
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span>Avg Score</span>
                </div>
                <div className="text-2xl font-bold">{Math.round(simulationMemory.averageScore)}%</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {simulationMemory.averageScore >= 70 ? "Strong performance" : "Improving"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <span>Risk Profile</span>
                </div>
                <div className="text-2xl font-bold capitalize">{simulationMemory.riskProfile}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Decision pattern analysis
                </div>
              </div>
            </motion.div>

            {/* Strengths and Weaknesses */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-lg">Strengths</h3>
                </div>
                <div className="space-y-2">
                  {simulationMemory.strengths.slice(0, 4).map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-lg">Areas for Improvement</h3>
                </div>
                <div className="space-y-2">
                  {simulationMemory.weaknesses.slice(0, 4).map((weakness, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <Target className="h-4 w-4 text-amber-400" />
                      <span className="text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Evaluation Summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">AI Evaluation Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Strong simulation performance</p>
                    <p className="text-xs text-muted-foreground">
                      Your average score of {Math.round(simulationMemory.averageScore)}% indicates solid decision-making skills
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Balanced risk profile</p>
                    <p className="text-xs text-muted-foreground">
                      Your {simulationMemory.riskProfile} approach shows good judgment in critical situations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <TrendingUp className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ready for advancement</p>
                    <p className="text-xs text-muted-foreground">
                      Continue simulations to reach {readinessScore + 100} readiness score
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
    </ProtectedRoute>
  )
}
