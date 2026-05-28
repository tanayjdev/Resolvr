"use client"

// ============================================================
// components/simulation/simulation-header.tsx
// ============================================================

import Image from "next/image"
import { Clock, X, Server, Target, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationHeaderProps {
  timeRemaining: number
  readinessScore: number
  onExit: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function SimulationHeader({
  timeRemaining,
  readinessScore,
  onExit,
}: SimulationHeaderProps) {
  return (
    <header className="glass-panel border-b border-border px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 lg:gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Compass className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">Resolvr</span>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <Server className="h-4 w-4 text-destructive shrink-0" />
            <span className="font-medium text-xs lg:text-sm truncate">
              <span className="hidden md:inline">Incident #4712 — </span>Cluster
              Down
            </span>
            <span className="shrink-0 px-1.5 lg:px-2 py-0.5 text-[10px] lg:text-xs font-medium bg-destructive/20 text-destructive rounded">
              Hard
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-warning/10 border border-warning/30">
            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-warning" />
            <span
              className={cn(
                "font-mono text-xs lg:text-sm font-semibold",
                timeRemaining < 300
                  ? "text-destructive animate-subtle-pulse"
                  : "text-warning"
              )}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Readiness Score */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-primary/10 border border-primary/30">
            <Target className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
            <span className="font-mono text-xs lg:text-sm font-semibold text-primary">
              {readinessScore}{" "}
              <span className="text-muted-foreground hidden lg:inline">
                / 1000
              </span>
            </span>
          </div>

          {/* Live Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/30">
            <div className="h-2 w-2 rounded-full bg-success animate-subtle-pulse" />
            <span className="text-xs font-medium text-success">Live</span>
          </div>

          {/* Exit Button */}
          <button
            onClick={onExit}
            className="p-1.5 lg:p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Exit simulation"
          >
            <X className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
