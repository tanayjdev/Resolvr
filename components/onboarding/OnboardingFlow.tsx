"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

import {
  useUserProgress,
} from "@/context/user-context"

import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

import type {
  SkillLevel,
  WeeklyHours,
} from "@/lib/types/user-profile"

import {
  CAREER_GOAL_OPTIONS,
  INTEREST_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  ONBOARDING_STEP_COUNT,
  ONBOARDING_STEP_LABELS,
  SKILL_LEVEL_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
  getResumeStep,
  mapCareerGoalToPathway,
  mapCareerGoalToCareerTrack,
} from "@/lib/onboarding/options"

import { Button } from "@/components/ui/button"

interface OnboardingFormState {
  careerGoal: string
  interests: string[]
  skillLevel: SkillLevel
  learningStyle: string
  weeklyHours: WeeklyHours
}

const INITIAL_FORM: OnboardingFormState = {
  careerGoal: "",
  interests: [],
  skillLevel: "Beginner",
  learningStyle: "",
  weeklyHours: "2hrs",
}

const stepMotion = {
  initial: {
    opacity: 0,
    x: 24,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -24,
  },
}

function SelectionButton({
  label,
  selected,
  onClick,
  multi = false,
}: {
  label: string
  selected: boolean
  onClick: () => void
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300",
        selected
          ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_24px_rgba(0,198,255,0.12)]"
          : "border-white/10 bg-white/[0.03] text-foreground/80 hover:border-primary/20 hover:bg-white/[0.06]",
        multi && "min-h-[52px]"
      )}
    >
      {label}
    </button>
  )
}

export default function OnboardingFlow() {
  const router = useRouter()

  const {
    profile,
    hasHydrated,
    updateProfile,
    completeOnboarding,
    setPathway,
  } = useUserProgress()

  const { currentUser } = useAuth()

  const [step, setStep] =
    React.useState(1)

  const [form, setForm] =
    React.useState<OnboardingFormState>(
      INITIAL_FORM
    )

  const [validationError, setValidationError] =
    React.useState("")

  const hasRestoredRef =
    React.useRef(false)

  React.useEffect(() => {
    if (
      !hasHydrated ||
      hasRestoredRef.current
    ) {
      return
    }

    hasRestoredRef.current = true

    setForm({
      careerGoal: profile.careerGoal,
      interests: [...profile.interests],
      skillLevel: profile.skillLevel,
      learningStyle:
        profile.learningStyle,
      weeklyHours: profile.weeklyHours,
    })

    setStep(
      getResumeStep(
        profile.careerGoal,
        profile.interests.length,
        profile.learningStyle,
        profile.onboardingComplete
      )
    )
  }, [hasHydrated, profile])

  const persistCurrentStep =
    React.useCallback(() => {
      updateProfile({
        careerGoal: form.careerGoal,
        interests: form.interests,
        skillLevel: form.skillLevel,
        learningStyle:
          form.learningStyle,
        weeklyHours: form.weeklyHours,
        recommendedSkills: [
          ...form.interests,
        ],
      })

      if (form.careerGoal) {
        setPathway(
          mapCareerGoalToPathway(
            form.careerGoal
          )
        )
      }
    }, [form, updateProfile, setPathway])

  const validateStep = (
    currentStep: number
  ): boolean => {
    switch (currentStep) {
      case 1:
        return form.careerGoal.length > 0

      case 2:
        return form.interests.length > 0

      case 3:
        return SKILL_LEVEL_OPTIONS.includes(
          form.skillLevel
        )

      case 4:
        return form.learningStyle.length > 0

      case 5:
        return WEEKLY_HOURS_OPTIONS.includes(
          form.weeklyHours
        )

      default:
        return false
    }
  }

  const getValidationMessage = (
    currentStep: number
  ): string => {
    switch (currentStep) {
      case 1:
        return "Select a career goal to continue."

      case 2:
        return "Choose at least one interest."

      case 3:
        return "Select your current skill level."

      case 4:
        return "Choose a learning style."

      case 5:
        return "Select your weekly time commitment."

      default:
        return "Complete this step to continue."
    }
  }

  const handleNext = async () => {
    if (!validateStep(step)) {
      setValidationError(
        getValidationMessage(step)
      )
      return
    }

    setValidationError("")
    persistCurrentStep()

    if (step >= ONBOARDING_STEP_COUNT) {
      const careerTrack = form.careerGoal ? mapCareerGoalToCareerTrack(form.careerGoal) : null
      
      updateProfile({
        careerGoal: form.careerGoal,
        careerTrack,
        interests: form.interests,
        skillLevel: form.skillLevel,
        learningStyle:
          form.learningStyle,
        weeklyHours: form.weeklyHours,
        recommendedSkills: [
          ...form.interests,
        ],
        pathwayProgress: 12,
      })

      // Save to Supabase profiles table
      if (currentUser && careerTrack) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              career_track: careerTrack,
              skill_level: form.skillLevel,
              time_commitment: form.weeklyHours,
              interests: form.interests,
              onboarding_complete: true,
            })
            .eq('id', currentUser.id)

          if (error) {
            console.error("Failed to save profile to Supabase:", error)
          }
        } catch (error) {
          console.error("Error saving profile to Supabase:", error)
        }
      }

      if (form.careerGoal) {
        setPathway(
          mapCareerGoalToPathway(
            form.careerGoal
          )
        )
      }

      completeOnboarding()
      router.push("/dashboard")
      return
    }

    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setValidationError("")
    setStep((prev) => Math.max(1, prev - 1))
  }

  const toggleInterest = (
    interest: string
  ) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(
        interest
      )
        ? prev.interests.filter(
          (item) => item !== interest
        )
        : [
          ...prev.interests,
          interest,
        ],
    }))
    setValidationError("")
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CAREER_GOAL_OPTIONS.map(
              (goal) => (
                <SelectionButton
                  key={goal}
                  label={goal}
                  selected={
                    form.careerGoal ===
                    goal
                  }
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      careerGoal: goal,
                    }))
                    setValidationError("")
                  }}
                />
              )
            )}
          </div>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {INTEREST_OPTIONS.map(
              (interest) => (
                <SelectionButton
                  key={interest}
                  label={interest}
                  selected={form.interests.includes(
                    interest
                  )}
                  multi
                  onClick={() =>
                    toggleInterest(
                      interest
                    )
                  }
                />
              )
            )}
          </div>
        )

      case 3:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SKILL_LEVEL_OPTIONS.map(
              (level) => (
                <SelectionButton
                  key={level}
                  label={level}
                  selected={
                    form.skillLevel ===
                    level
                  }
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      skillLevel: level,
                    }))
                    setValidationError("")
                  }}
                />
              )
            )}
          </div>
        )

      case 4:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LEARNING_STYLE_OPTIONS.map(
              (style) => (
                <SelectionButton
                  key={style}
                  label={style}
                  selected={
                    form.learningStyle ===
                    style
                  }
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      learningStyle: style,
                    }))
                    setValidationError("")
                  }}
                />
              )
            )}
          </div>
        )

      case 5:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {WEEKLY_HOURS_OPTIONS.map(
              (hours) => (
                <SelectionButton
                  key={hours}
                  label={hours}
                  selected={
                    form.weeklyHours ===
                    hours
                  }
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      weeklyHours: hours,
                    }))
                    setValidationError("")
                  }}
                />
              )
            )}
          </div>
        )

      default:
        return null
    }
  }

  const stepTitle =
    ONBOARDING_STEP_LABELS[step - 1]

  const stepDescriptions = [
    "Choose the role you are working toward.",
    "Select topics that excite you most right now.",
    "Tell us where you are starting from today.",
    "Pick how you learn best.",
    "Set a realistic weekly commitment.",
  ]

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Resolvr Setup
            </span>
          </div>

          <h1 className="font-[var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
            Personalize Your AI Pathway
          </h1>

          <p className="mt-2 text-sm text-muted-foreground/80">
            A quick setup to tailor simulations, skills, and opportunities.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/80">
            <span>
              Step {step} of{" "}
              {ONBOARDING_STEP_COUNT}
            </span>
            <span>{stepTitle}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({
              length:
                ONBOARDING_STEP_COUNT,
            }).map((_, index) => {
              const stepNumber =
                index + 1
              const isActive =
                stepNumber === step
              const isComplete =
                stepNumber < step

              return (
                <div
                  key={stepNumber}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    isActive &&
                    "bg-primary shadow-[0_0_16px_rgba(0,198,255,0.35)]",
                    isComplete &&
                    "bg-primary/60",
                    !isActive &&
                    !isComplete &&
                    "bg-white/10"
                  )}
                />
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f]/90 via-[#090b16]/90 to-[#05060d]/90 p-5 backdrop-blur-xl sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: [
                  0.22, 1, 0.36, 1,
                ],
              }}
            >
              <h2 className="mb-2 text-xl font-semibold tracking-tight">
                {stepTitle}
              </h2>

              <p className="mb-6 text-sm text-muted-foreground/80">
                {
                  stepDescriptions[
                  step - 1
                  ]
                }
              </p>

              {renderStepContent()}

              {validationError && (
                <p className="mt-4 text-sm text-red-400/90">
                  {validationError}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={
                !validateStep(step)
              }
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              {step ===
                ONBOARDING_STEP_COUNT
                ? "Complete Setup"
                : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
