"use client"

// ============================================================
// components/simulation/response-panel.tsx
// ============================================================

import {
  useMemo,
  useState,
} from "react"

import {
  MessageSquare,
  Bold,
  Italic,
  List,
  Code,
  Link2,
  Send,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ============================================================
// Types
// ============================================================

interface ResponsePanelProps {
  className?: string

  onSubmit?: (
    text: string
  ) => void | Promise<void>

  loading?: boolean
}

// ============================================================
// Component
// ============================================================

export function ResponsePanel({
  className,
  onSubmit,
  loading = false,
}: ResponsePanelProps) {
  const [response, setResponse] =
    useState("")

  // ==========================================================
  // Derived State
  // ==========================================================

  const trimmedResponse =
    response.trim()

  const wordCount =
    useMemo(() => {
      return trimmedResponse
        .split(/\s+/)
        .filter(Boolean).length
    }, [trimmedResponse])

  const charCount =
    response.length

  const canSubmit =
    trimmedResponse.length >= 10 &&
    !loading

  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit =
    async () => {
      if (!canSubmit) return

      try {
        await onSubmit?.(
          trimmedResponse
        )
      } finally {
        // Optional reset
        // setResponse("")
      }
    }

  // ==========================================================
  // Keyboard Shortcut
  // ==========================================================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      (e.ctrlKey ||
        e.metaKey) &&
      e.key === "Enter"
    ) {
      e.preventDefault()

      handleSubmit()
    }
  }

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

      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Diagnosis & Resolution
            </h3>

            <p className="text-[11px] text-muted-foreground">
              Document your incident analysis
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {[
            {
              icon: Bold,
              label: "Bold",
            },

            {
              icon: Italic,
              label: "Italic",
            },

            {
              icon: List,
              label: "List",
            },

            {
              icon: Code,
              label: "Code",
            },

            {
              icon: Link2,
              label: "Link",
            },
          ].map(
            ({
              icon: Icon,
              label,
            }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="rounded-lg p-1.5 transition-colors hover:bg-secondary"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )
          )}
        </div>
      </div>

      {/* ======================================================
          Textarea
      ====================================================== */}

      <div className="flex-1 p-4">
        <textarea
          value={response}
          onChange={(e) =>
            setResponse(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          spellCheck={false}
          placeholder={`Document your diagnosis and resolution steps here...

Example:

1. Root Cause Identification
   - Observed node failures in us-east-1
   - Network plugin initialization failure
   - kubelet reported CNI issues

2. Investigation
   - kubectl describe node
   - Verify kube-proxy health
   - Check cloud networking

3. Resolution
   - Restart networking services
   - Restore CNI configuration
   - Stabilize failover traffic
`}
          aria-label="Diagnosis and resolution input"
          className="
            h-full
            min-h-[320px]
            w-full
            resize-none
            bg-transparent
            text-sm
            leading-relaxed
            text-foreground
            outline-none
            placeholder:text-muted-foreground/50
          "
        />
      </div>

      {/* ======================================================
          Footer
      ====================================================== */}

      <div className="flex flex-col gap-3 border-t border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            {wordCount} words
          </span>

          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

          <span>
            {charCount} characters
          </span>

          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

          <span>
            Ctrl + Enter to submit
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={
            handleSubmit
          }
          disabled={!canSubmit}
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",

            canSubmit
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-secondary text-muted-foreground opacity-60"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />

              Submit Step
            </>
          )}
        </button>
      </div>
    </div>
  )
}