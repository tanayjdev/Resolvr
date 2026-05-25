"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

import { useUserProgress } from "@/context/user-context"

import DashboardShell from "@/components/onboarding/DashboardShell"

export default function DashboardPage() {
  const router = useRouter()

  const {
    profile,
    hasHydrated,
  } = useUserProgress()

  React.useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (!profile.onboardingComplete) {
      router.replace("/onboarding")
    }
  }, [
    hasHydrated,
    profile.onboardingComplete,
    router,
  ])

  if (
    !hasHydrated ||
    !profile.onboardingComplete
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  return <DashboardShell />
}
