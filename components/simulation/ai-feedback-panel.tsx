"use client"

// ============================================================
// components/simulation/ai-feedback-panel.tsx
// ============================================================

import { motion } from "framer-motion"

import {
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BrainCircuit,
} from "lucide-react"

import { cn } from "@/lib/utils"

import {
  SUGGESTED_ACTIONS,
} from "@/lib/simulation/mock-data"

import type {
  AIFeedback,
} from "@/lib/simulation/types"

// ============================================================
// Props
// ============================================================

interface AIFeedbackPanelProps {
  feedback: AIFeedback[]

  showHints: boolean

  onToggleHints: () => void

  confidence?: number

  className?: string

  onSuggestedAction?: (
    action: string
  ) => void
}

// ============================================================
// Helpers
// ============================================================

function FeedbackIcon({
  type,
}: {
  type: AIFeedback["type"]
}) {
  switch (type) {
    case "correct":
      return (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      )

    case "warning":
      return (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      )

    case "hint":
      return (
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      )

    default:
      return null
  }
}

// ============================================================
// Component
// ============================================================

export function AIFeedbackPanel({
  feedback,

  showHints,

  onToggleHints,

  confidence = 78,

  className,

  onSuggestedAction,
}: AIFeedbackPanelProps) {
  // ==========================================================
  // Filtered Feedback
  // ==========================================================

  const visibleFeedback =
    showHints
      ? feedback
      : feedback.filter(
        (item) =>
          item.type !== "hint"
      )

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div
      className={cn(
        "glass-panel flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border",

        className
      )}
    >
      {/* ======================================================
          Header
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-accent/20">
            <BrainCircuit className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-primary" />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground">
              Resolvr AI
            </h3>

            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              Real-time simulation analysis
            </p>
          </div>
        </div>

        {/* Hint Toggle */}
        <button
          onClick={
            onToggleHints
          }
          type="button"
          className={cn(
            "inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium transition-all duration-300",

            showHints
              ? "border border-primary/20 bg-primary/10 text-primary"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {showHints ? (
            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          ) : (
            <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}

          {showHints
            ? "Hints On"
            : "Hints Off"}
        </button>
      </div>

      {/* ======================================================
          Confidence
      ====================================================== */}

      <div className="border-b border-border px-3 sm:px-4 py-3 sm:py-4">
        <div className="mb-1.5 sm:mb-2 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            AI Analysis Confidence
          </span>

          <span className="text-[10px] sm:text-xs font-semibold text-primary">
            {confidence}%
          </span>
        </div>

        <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${confidence}%`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      {/* ======================================================
          Feedback
      ====================================================== */}

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {visibleFeedback.length >
            0 ? (
            visibleFeedback.map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay:
                      index * 0.04,
                  }}
                  className={cn(
                    "rounded-xl border p-2.5 sm:p-3 transition-all duration-300",

                    item.type ===
                    "correct" &&
                    "border-emerald-500/20 bg-emerald-500/[0.04]",

                    item.type ===
                    "warning" &&
                    "border-amber-500/20 bg-amber-500/[0.04]",

                    item.type ===
                    "hint" &&
                    "border-primary/20 bg-primary/[0.04]"
                  )}
                >
                  <div className="flex items-start gap-2 sm:gap-2.5">
                    <FeedbackIcon
                      type={
                        item.type
                      }
                    />

                    <div className="flex-1">
                      <p className="text-[11px] sm:text-xs leading-relaxed text-foreground/90">
                        {
                          item.message
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            )
          ) : (
            <div className="flex h-full min-h-[150px] sm:min-h-[180px] flex-col items-center justify-center text-center">
              <Sparkles className="mb-2 sm:mb-3 h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/40" />

              <h4 className="text-xs sm:text-sm font-medium text-foreground">
                Awaiting Analysis
              </h4>

              <p className="mt-0.5 sm:mt-1 max-w-[200px] sm:max-w-[240px] text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                Submit your response to receive AI-generated diagnostic feedback and recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          Suggested Actions
      ====================================================== */}

      <div className="border-t border-border p-3 sm:p-4">
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Suggested Next Actions
          </span>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          {SUGGESTED_ACTIONS.slice(
            0,
            3
          ).map((action) => (
            <button
              key={action}
              type="button"
              onClick={() =>
                onSuggestedAction?.(
                  action
                )
              }
              className="
                group
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                border-white/5
                bg-secondary/40
                p-2.5 sm:p-3
                text-left
                transition-all
                duration-300
                hover:border-primary/20
                hover:bg-primary/5
              "
            >
              <span className="pr-2 sm:pr-3 text-[11px] sm:text-xs leading-relaxed text-foreground/90">
                {action}
              </span>

              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}