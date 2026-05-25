"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

import { useUserProgress } from "@/context/user-context"

import OnboardingFlow from "@/components/onboarding/OnboardingFlow"

import DashboardShell from "@/components/onboarding/DashboardShell"

export default function OnboardingShell() {
  const router = useRouter()

  const {
    profile,
    hasHydrated,
  } = useUserProgress()

  React.useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (profile.onboardingComplete) {
      router.replace("/dashboard")
    }
  }, [
    hasHydrated,
    profile.onboardingComplete,
    router,
  ])

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  if (profile.onboardingComplete) {
    return null
  }

  return <OnboardingFlow />
}
