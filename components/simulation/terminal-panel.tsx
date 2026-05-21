"use client"

// ============================================================
// components/simulation/terminal-panel.tsx
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react"
import { Terminal as TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { executeCommand } from "@/lib/simulation/command-parser"
import { SEED_TERMINAL_HISTORY } from "@/lib/simulation/mock-data"
import type { TerminalHistoryLine, CommandResult } from "@/lib/simulation/types"

const PROMPT = "operator@pathweaver:~$"

interface TerminalPanelProps {
  className?: string
  /** Called after each command so the parent can update score / feedback */
  onCommandResult?: (raw: string, result: CommandResult) => void
}

function lineVariantClass(
  variant: TerminalHistoryLine["variant"]
): string {
  switch (variant) {
    case "primary":
      return "text-primary"
    case "success":
      return "text-success"
    case "error":
      return "text-destructive"
    case "muted":
      return "text-muted-foreground"
    default:
      return "text-foreground/90"
  }
}

export function TerminalPanel({ className, onCommandResult }: TerminalPanelProps) {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<TerminalHistoryLine[]>(SEED_TERMINAL_HISTORY)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const appendLines = useCallback(
    (lines: TerminalHistoryLine[], withPrompt = true) => {
      setHistory((prev) => {
        // Remove trailing prompt line
        const withoutPrompt = prev[prev.length - 1]?.isPrompt
          ? prev.slice(0, -1)
          : prev

        const newLines = [
          ...withoutPrompt,
          ...lines,
          ...(withPrompt
            ? [{ text: `${PROMPT} `, variant: "primary" as const, isPrompt: true }]
            : []),
        ]
        return newLines
      })
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const raw = command.trim()
      if (!raw) return

      setCommand("")
      setHistoryIndex(-1)
      setCmdHistory((prev) => [raw, ...prev.slice(0, 49)])

      // Echo the command
      const echoLine: TerminalHistoryLine = {
        text: `${PROMPT} ${raw}`,
        variant: "primary",
      }

      if (raw === "clear") {
        setHistory([
          { text: `${PROMPT} `, variant: "primary", isPrompt: true },
        ])
        return
      }

      const result = executeCommand(raw)

      // Notify parent
      onCommandResult?.(raw, result)

      appendLines([echoLine, ...result.lines])
    },
    [command, appendLines, onCommandResult]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setHistoryIndex((prev) => {
          const next = Math.min(prev + 1, cmdHistory.length - 1)
          setCommand(cmdHistory[next] ?? "")
          return next
        })
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setHistoryIndex((prev) => {
          const next = Math.max(prev - 1, -1)
          setCommand(next === -1 ? "" : (cmdHistory[next] ?? ""))
          return next
        })
      }
    },
    [cmdHistory]
  )

  return (
    <div
      className={cn(
        "glass-panel rounded-xl border border-border flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Terminal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning" />
          <div className="h-2.5 w-2.5 rounded-full bg-success" />
        </div>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-3 font-mono text-xs bg-[#0a0e14] min-h-0"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div
            key={i}
            className={lineVariantClass(line.variant)}
          >
            {line.isPrompt ? (
              <>
                {line.text}
                <span className="cursor-blink">▋</span>
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-[#0a0e14]"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary shrink-0">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground"
            placeholder="Enter command..."
            aria-label="Terminal command input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  )
}
