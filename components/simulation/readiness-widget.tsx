"use client"

// ============================================================
// components/simulation/readiness-widget.tsx
// ============================================================

import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReadinessWidgetProps {
  /** Points that will be added on simulation completion */
  pointsToAdd?: number
  /** Progress bar fill (1–5) */
  progressFill?: number
  className?: string
}

export function ReadinessWidget({
  pointsToAdd = 18,
  progressFill = 3,
  className,
}: ReadinessWidgetProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl border border-primary/30 p-3 sm:p-4 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
      <div className="relative flex items-center gap-2 sm:gap-3">
        <div className="shrink-0 p-1.5 sm:p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Completing this simulation adds
          </p>
          <p className="font-semibold text-xs sm:text-sm text-primary">
            +{pointsToAdd} pts to DevOps Readiness
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Progress</div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2.5 sm:h-3 w-1 sm:w-1.5 rounded-full transition-colors",
                  i <= progressFill ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
