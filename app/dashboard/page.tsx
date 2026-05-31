"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

import { useUserProgress } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

import DashboardShell from "@/components/onboarding/DashboardShell"

export default function DashboardPage() {
  const router = useRouter()

  const {
    profile,
    hasHydrated,
  } = useUserProgress()

  const { isAuthenticated, isLoading } = useAuth()

  React.useEffect(() => {
    if (!hasHydrated || isLoading) {
      return
    }

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (!profile.onboardingComplete) {
      router.replace("/onboarding")
    }
  }, [
    hasHydrated,
    isLoading,
    isAuthenticated,
    profile.onboardingComplete,
    router,
  ])

  if (
    !hasHydrated ||
    isLoading ||
    !isAuthenticated ||
    !profile.onboardingComplete
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardShell />
    </ProtectedRoute>
  )
}
