"use client"

// ============================================================
// components/simulation/incident-panel.tsx
// ============================================================

import { AlertTriangle, Target, Activity } from "lucide-react"

export function IncidentPanel() {
  return (
    <div className="glass-panel rounded-xl p-4 lg:p-5 border border-border">
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-2 rounded-lg bg-warning/10 border border-warning/30">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-semibold text-sm lg:text-base">
              Incident Briefing
            </h2>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-destructive/20 text-destructive rounded">
              CRITICAL
            </span>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed mb-3">
            3 nodes in{" "}
            <code className="px-1 py-0.5 rounded bg-secondary text-primary font-mono text-xs">
              us-east-1
            </code>{" "}
            are unreachable. Latency spiked to 800ms. Multiple services
            reporting timeouts.
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span>
                <strong className="text-foreground">Objective:</strong> Identify
                root cause and restore service
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-warning" />
              <span>
                <strong className="text-foreground">Impact:</strong> 47% of
                requests failing, 12 services affected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
