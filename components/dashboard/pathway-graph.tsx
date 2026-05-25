"use client"

import * as React from "react"

import {
  motion,
  AnimatePresence,
} from "framer-motion"

import { cn } from "@/lib/utils"

import {
  useUserProgress,
} from "@/context/user-context"

import {
  buildPathwayData,
} from "@/lib/pathways/pathway-engine"

import {
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react"

// =========================================================
// Types
// =========================================================

export interface PathwayNode {
  id: string

  title: string

  status:
    | "completed"
    | "current"
    | "locked"

  description?: string

  children?: PathwayNode[]
}

// =========================================================
// Node Icon
// =========================================================

function NodeIcon({
  status,
}: {
  status: PathwayNode["status"]
}) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      )

    case "current":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        </div>
      )

    case "locked":
      return (
        <Lock className="h-4 w-4 text-muted-foreground" />
      )

    default:
      return null
  }
}

// =========================================================
// Mobile Node
// =========================================================

function MobilePathwayNode({
  node,
  isLast,
}: {
  node: PathwayNode
  isLast: boolean
}) {
  const [expanded, setExpanded] =
    React.useState(
      node.status === "current"
    )

  return (
    <div className="relative">
      {/* Connector */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[11px] top-9 h-[calc(100%-12px)] w-[2px]",

            node.status ===
              "completed"
              ? "bg-emerald-500/30"
              : "bg-white/10"
          )}
        />
      )}

      {/* Main Node */}
      <button
        onClick={() =>
          setExpanded(
            (prev) => !prev
          )
        }
        className={cn(
          "group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300",

          node.status ===
            "current" &&
            "border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(0,198,255,0.08)]",

          node.status ===
            "completed" &&
            "border-emerald-500/10 bg-emerald-500/[0.03]",

          node.status ===
            "locked" &&
            "border-white/5 bg-white/[0.02] hover:bg-white/[0.03]"
        )}
      >
        <div className="mt-0.5 flex-shrink-0">
          <NodeIcon
            status={node.status}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-semibold tracking-tight",

                node.status ===
                  "locked"
                  ? "text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {node.title}
            </h4>

            {node.children &&
              (expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ))}
          </div>

          {node.description && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {node.description}
            </p>
          )}
        </div>
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {expanded &&
          node.children && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="ml-8 mt-2 overflow-hidden"
            >
              <div className="space-y-2 border-l border-white/5 pl-4">
                {node.children.map(
                  (child) => (
                    <div
                      key={child.id}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",

                        child.status ===
                          "current" &&
                          "bg-primary/10"
                      )}
                    >
                      <div className="flex w-4 justify-center">
                        {child.status ===
                          "completed" && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}

                        {child.status ===
                          "current" && (
                          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        )}

                        {child.status ===
                          "locked" && (
                          <Circle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>

                      <span
                        className={cn(
                          child.status ===
                            "locked"
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {child.title}
                      </span>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  )
}

// =========================================================
// Main Component
// =========================================================

export function AdaptivePathwayGraph() {
  const { progress } =
    useUserProgress()

  const pathwayData =
    React.useMemo(() => {
      return buildPathwayData({
        readinessScore:
          progress.readinessScore,
      
        simulationsCompleted:
          progress.simulationsCompleted,
      
        currentPathway:
          progress.currentPathway,
      
        unlockedPathways:
          progress.unlockedPathways,
      
        interests:
          progress.interests,
      
        completedSimulations:
          progress.completedSimulations,
      })
    }, [
      progress.readinessScore,
      progress.simulationsCompleted,
    ])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl sm:p-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,198,255,0.08),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" />

            Adaptive AI Pathway
          </div>

          <h3 className="font-[var(--font-syne)] text-xl font-bold tracking-tight text-foreground">
            Learning Pathway
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Your evolving career roadmap powered by AI insights
          </p>
        </div>

        {/* Legend */}
        <div className="hidden items-center gap-4 text-xs sm:flex">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="text-muted-foreground">
              Completed
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />

            <span className="text-muted-foreground">
              Current
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/20" />

            <span className="text-muted-foreground">
              Locked
            </span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="relative z-10 hidden overflow-x-auto pb-2 lg:block">
        <div className="flex min-w-max items-start gap-5">
          {pathwayData.map(
            (node, index) => (
              <React.Fragment
                key={node.id}
              >
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={cn(
                    "w-[260px] rounded-2xl border p-5 transition-all duration-300",

                    node.status ===
                      "completed" &&
                      "border-emerald-500/15 bg-emerald-500/[0.03]",

                    node.status ===
                      "current" &&
                      "border-primary/20 bg-primary/[0.04] shadow-[0_0_35px_rgba(0,198,255,0.08)]",

                    node.status ===
                      "locked" &&
                      "border-white/5 bg-white/[0.02]"
                  )}
                >
                  {/* Top */}
                  <div className="mb-4 flex items-start gap-3">
                    <div className="mt-0.5">
                      <NodeIcon
                        status={
                          node.status
                        }
                      />
                    </div>

                    <div>
                      <h4
                        className={cn(
                          "font-semibold tracking-tight",

                          node.status ===
                            "locked"
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {node.title}
                      </h4>

                      {node.description && (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {
                            node.description
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Children */}
                  {node.children && (
                    <div className="space-y-2">
                      {node.children.map(
                        (
                          child
                        ) => (
                          <div
                            key={
                              child.id
                            }
                            className={cn(
                              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",

                              child.status ===
                                "current" &&
                                "bg-primary/10"
                            )}
                          >
                            {child.status ===
                              "completed" && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}

                            {child.status ===
                              "current" && (
                              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            )}

                            {child.status ===
                              "locked" && (
                              <Circle className="h-3 w-3 text-muted-foreground" />
                            )}

                            <span
                              className={cn(
                                "text-sm",

                                child.status ===
                                  "locked"
                                  ? "text-muted-foreground"
                                  : "text-foreground/90"
                              )}
                            >
                              {
                                child.title
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Connector */}
                {index <
                  pathwayData.length -
                    1 && (
                  <div className="flex h-[220px] items-center">
                    <ChevronRight
                      className={cn(
                        "h-5 w-5",

                        node.status ===
                          "completed"
                          ? "text-emerald-400"
                          : "text-white/20"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 space-y-3 lg:hidden">
        {pathwayData.map(
          (node, index) => (
            <MobilePathwayNode
              key={node.id}
              node={node}
              isLast={
                index ===
                pathwayData.length -
                  1
              }
            />
          )
        )}
      </div>
    </div>
  )
}