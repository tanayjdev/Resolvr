"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Target,
  Award,
  BookOpen,
} from "lucide-react"

import { useUserProgress } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"
import { usePersona } from "@/context/persona-context"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import PageTransition from "@/components/common/PageTransition"
import { Sidebar, TopBar, BottomNav } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"

export default function SkillsPage() {
  const router = useRouter()
  const { progress, profile, hasHydrated } = useUserProgress()
  const { isAuthenticated, isLoading } = useAuth()
  const { persona, dashboardData } = usePersona()

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

  // Use persona-specific skills if available, otherwise fall back to progress skills
  const skills = persona?.skills || progress.skills
  const masteredSkills = skills.filter((s) => s.level >= 80)
  const developingSkills = skills.filter((s) => s.level >= 50 && s.level < 80)
  const emergingSkills = skills.filter((s) => s.level < 50)

  // Use persona-specific pathways if available
  const pathways = persona?.pathways || []
  const skillCategories = {
    "Technical Skills": skills.slice(0, 3),
    "Soft Skills": skills.slice(3, 6),
    "Domain Skills": skills.slice(6),
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
                    Skills Intelligence
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                  Track your skill development and AI-powered recommendations
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {skills.length} Skills Tracked
                </span>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Mastered</span>
                </div>
                <div className="text-2xl font-bold">{masteredSkills.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Developing</span>
                </div>
                <div className="text-2xl font-bold">{developingSkills.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Emerging</span>
                </div>
                <div className="text-2xl font-bold">{emergingSkills.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span>Avg Level</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(skills.reduce((a, b) => a + b.level, 0) / skills.length)}%
                </div>
              </div>
            </motion.div>

            {/* Skills by Category */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-6"
            >
              {Object.entries(skillCategories).map(([category, categorySkills], index) => (
                <div key={category} className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                  <h3 className="mb-4 font-semibold text-lg">{category}</h3>
                  
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{Math.round(skill.level)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn(
                              "h-full rounded-full",
                              skill.level >= 80 ? "bg-emerald-400" : 
                              skill.level >= 50 ? "bg-primary" : "bg-amber-400"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">AI Recommendations</h3>
              </div>

              <div className="space-y-3">
                {emergingSkills.length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Focus on emerging skills</p>
                      <p className="text-xs text-muted-foreground">
                        Prioritize {emergingSkills.map((s) => s.name).join(", ")} to accelerate your growth
                      </p>
                    </div>
                  </div>
                )}

                {developingSkills.length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Continue developing core skills</p>
                      <p className="text-xs text-muted-foreground">
                        {developingSkills.slice(0, 3).map((s) => s.name).join(", ")} are close to mastery
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <BookOpen className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Practice with simulations</p>
                    <p className="text-xs text-muted-foreground">
                      Complete simulations to strengthen your practical skills
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
