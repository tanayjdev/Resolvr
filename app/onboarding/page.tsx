"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserProgress } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import OnboardingShell from "@/components/onboarding/OnboardingShell"

export default function Page() {
  const router = useRouter()
  const { profile, hasHydrated } = useUserProgress()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!hasHydrated || isLoading) {
      return
    }

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    // If onboarding is already complete, redirect to dashboard
    if (profile.onboardingComplete) {
      router.replace("/dashboard")
    }
  }, [hasHydrated, isLoading, isAuthenticated, profile.onboardingComplete, router])

  if (!hasHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  // If onboarding is complete, don't render the shell (redirect will happen)
  if (profile.onboardingComplete) {
    return null
  }

  return (
    <ProtectedRoute>
      <OnboardingShell />
    </ProtectedRoute>
  )
}
