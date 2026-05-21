"use client"

// ============================================================
// components/simulation/progress-tracker.tsx
// ============================================================

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PROGRESS_STEPS } from "@/lib/simulation/mock-data"
import type { SimulationStep } from "@/lib/simulation/types"

interface ProgressTrackerProps {
  currentStep: SimulationStep
  className?: string
}

export function ProgressTracker({ currentStep, className }: ProgressTrackerProps) {
  const currentIndex = PROGRESS_STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div
      className={cn(
        "glass-panel rounded-xl border border-border p-3 lg:p-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {PROGRESS_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 lg:h-10 lg:w-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold transition-all border-2",
                  index < currentIndex &&
                    "bg-success/20 border-success text-success",
                  index === currentIndex &&
                    "bg-primary/20 border-primary text-primary animate-glow",
                  index > currentIndex &&
                    "bg-secondary border-border text-muted-foreground"
                )}
              >
                {index < currentIndex ? (
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] lg:text-xs font-medium",
                  index <= currentIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < PROGRESS_STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 lg:w-16 xl:w-24 h-0.5 mx-1 lg:mx-2 rounded-full transition-colors",
                  index < currentIndex ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
