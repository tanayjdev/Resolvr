"use client"

// ============================================================
// components/simulation/mobile-tab-nav.tsx
// ============================================================

import { FileText, Terminal as TerminalIcon, MessageSquare, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MobileTab } from "@/lib/simulation/types"

interface MobileTabNavProps {
  activeTab: MobileTab
  onTabChange: (tab: MobileTab) => void
}

const TABS: { id: MobileTab; label: string; icon: React.ElementType }[] = [
  { id: "logs", label: "Logs", icon: FileText },
  { id: "terminal", label: "Terminal", icon: TerminalIcon },
  { id: "response", label: "Response", icon: MessageSquare },
  { id: "ai", label: "AI", icon: Sparkles },
]

export function MobileTabNav({ activeTab, onTabChange }: MobileTabNavProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
      {TABS.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
