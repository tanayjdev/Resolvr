"use client"

// ============================================================
// components/simulation/logs-panel.tsx
// ============================================================

import { useEffect, useRef } from "react"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LogEntry, LogLevel } from "@/lib/simulation/types"

interface LogsPanelProps {
  logs: LogEntry[]
  className?: string
}

function getLogIcon(level: LogLevel) {
  switch (level) {
    case "critical":
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />
    case "warning":
      return <AlertTriangle className="h-3.5 w-3.5 text-warning" />
    case "success":
      return <CheckCircle2 className="h-3.5 w-3.5 text-success" />
    default:
      return <Info className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

function getLogColor(level: LogLevel): string {
  switch (level) {
    case "critical":
      return "text-destructive"
    case "warning":
      return "text-warning"
    case "success":
      return "text-success"
    default:
      return "text-muted-foreground"
  }
}

export function LogsPanel({ logs, className }: LogsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div
      className={cn(
        "glass-panel rounded-xl border border-border flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="font-medium text-xs sm:text-sm">System Logs</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {logs.length} entries
          </span>
          <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-success animate-subtle-pulse" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-2 sm:p-3 font-mono text-[11px] sm:text-xs space-y-1 sm:space-y-1.5 min-h-0"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn(
              "flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-secondary/50 transition-colors",
              log.isNew && "log-entry-new"
            )}
          >
            <span className="text-muted-foreground shrink-0 w-14 sm:w-16 text-[10px] sm:text-[11px]">
              {log.timestamp}
            </span>
            {getLogIcon(log.level)}
            <span className={cn("flex-1 text-[11px] sm:text-xs", getLogColor(log.level))}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
