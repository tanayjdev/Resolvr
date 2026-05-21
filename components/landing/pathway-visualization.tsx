"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  motion,
  useInView,
} from "framer-motion"

import { Container } from "@/components/ui/container"

// =========================================================
// Types
// =========================================================

interface PathNode {
  id: string
  label: string
  x: number
  y: number
  type:
    | "start"
    | "milestone"
    | "destination"
}

interface PathEdge {
  from: string
  to: string
}

// =========================================================
// Data
// =========================================================

const nodes: PathNode[] = [
  {
    id: "student",
    label: "Student",
    x: 50,
    y: 50,
    type: "start",
  },

  {
    id: "skills",
    label: "Skills Assessment",
    x: 25,
    y: 35,
    type: "milestone",
  },

  {
    id: "learning",
    label: "Learning Path",
    x: 75,
    y: 35,
    type: "milestone",
  },

  {
    id: "internship",
    label: "Internships",
    x: 35,
    y: 20,
    type: "milestone",
  },

  {
    id: "projects",
    label: "Projects",
    x: 65,
    y: 20,
    type: "milestone",
  },

  {
    id: "engineer",
    label: "Software Engineer",
    x: 15,
    y: 5,
    type: "destination",
  },

  {
    id: "designer",
    label: "UX Designer",
    x: 40,
    y: 5,
    type: "destination",
  },

  {
    id: "analyst",
    label: "Data Analyst",
    x: 60,
    y: 5,
    type: "destination",
  },

  {
    id: "manager",
    label: "Product Manager",
    x: 85,
    y: 5,
    type: "destination",
  },
]

const edges: PathEdge[] = [
  {
    from: "student",
    to: "skills",
  },

  {
    from: "student",
    to: "learning",
  },

  {
    from: "skills",
    to: "internship",
  },

  {
    from: "skills",
    to: "projects",
  },

  {
    from: "learning",
    to: "internship",
  },

  {
    from: "learning",
    to: "projects",
  },

  {
    from: "internship",
    to: "engineer",
  },

  {
    from: "internship",
    to: "designer",
  },

  {
    from: "projects",
    to: "analyst",
  },

  {
    from: "projects",
    to: "manager",
  },
]

// =========================================================
// Component
// =========================================================

export function PathwayVisualization() {
  const graphRef =
    useRef<HTMLDivElement>(null)

  const isInView = useInView(
    graphRef,
    {
      once: true,
      margin: "-120px",
    }
  )

  const [activeEdges, setActiveEdges] =
    useState<Set<string>>(
      new Set()
    )

  const [activeNodes, setActiveNodes] =
    useState<Set<string>>(
      new Set(["student"])
    )

  // =======================================================
  // Node Map
  // =======================================================

  const nodeMap = useMemo(() => {
    return new Map(
      nodes.map((node) => [
        node.id,
        node,
      ])
    )
  }, [])

  // =======================================================
  // Graph Animation
  // =======================================================

  useEffect(() => {
    if (!isInView) return

    let cancelled = false

    const steps = [
      {
        nodes: [
          "skills",
          "learning",
        ],

        edges: [
          "student-skills",
          "student-learning",
        ],

        delay: 400,
      },

      {
        nodes: [
          "internship",
          "projects",
        ],

        edges: [
          "skills-internship",
          "skills-projects",
          "learning-internship",
          "learning-projects",
        ],

        delay: 850,
      },

      {
        nodes: [
          "engineer",
          "designer",
          "analyst",
          "manager",
        ],

        edges: [
          "internship-engineer",
          "internship-designer",
          "projects-analyst",
          "projects-manager",
        ],

        delay: 1300,
      },
    ]

    const runAnimation =
      async () => {
        for (const step of steps) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                step.delay
              )
          )

          if (cancelled) return

          setActiveNodes(
            (prev) =>
              new Set([
                ...prev,
                ...step.nodes,
              ])
          )

          setActiveEdges(
            (prev) =>
              new Set([
                ...prev,
                ...step.edges,
              ])
          )
        }
      }

    runAnimation()

    return () => {
      cancelled = true
    }
  }, [isInView])

  // =======================================================
  // Helpers
  // =======================================================

  const getEdgePath = (
    from: PathNode,
    to: PathNode
  ) => {
    const controlX =
      (from.x + to.x) / 2

    const controlY =
      (from.y + to.y) / 2 - 6

    return `
      M ${from.x} ${from.y}
      Q ${controlX} ${controlY}
      ${to.x} ${to.y}
    `
  }

  // =======================================================
  // Render
  // =======================================================

  return (
    <section
      id="pathway"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Background */}
      <div className="dot-pattern absolute inset-0 opacity-30" />

      <Container>
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-balance font-[var(--font-syne)] text-3xl font-bold leading-[1] tracking-tight sm:text-4xl lg:text-5xl">
            Visualize Your{" "}
            <span className="text-gradient">
              Career Journey
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Our AI maps every
            possible path from
            where you are to where
            you want to be —
            revealing milestones,
            opportunities, and
            future-ready skills.
          </p>
        </motion.div>

        {/* Graph */}
        <div
          ref={graphRef}
          className="glass-panel relative h-[520px] overflow-hidden rounded-3xl border border-white/10 p-4 md:h-[640px] md:p-8"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,198,255,0.08),transparent_55%)]" />

          {/* SVG */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 55"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="edgeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="#00C6FF"
                />

                <stop
                  offset="100%"
                  stopColor="#7B2FFF"
                />
              </linearGradient>

              <filter id="edgeGlow">
                <feGaussianBlur
                  stdDeviation="0.4"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />

                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {edges.map((edge) => {
              const from =
                nodeMap.get(
                  edge.from
                )

              const to =
                nodeMap.get(edge.to)

              if (!from || !to)
                return null

              const edgeId = `${edge.from}-${edge.to}`

              const isActive =
                activeEdges.has(
                  edgeId
                )

              return (
                <path
                  key={edgeId}
                  d={getEdgePath(
                    from,
                    to
                  )}
                  fill="none"
                  stroke={
                    isActive
                      ? "url(#edgeGradient)"
                      : "rgba(255,255,255,0.08)"
                  }
                  strokeWidth={
                    isActive
                      ? 0.35
                      : 0.2
                  }
                  filter={
                    isActive
                      ? "url(#edgeGlow)"
                      : undefined
                  }
                  className="transition-all duration-700"
                  style={{
                    opacity:
                      isActive
                        ? 1
                        : 0.25,

                    strokeDasharray:
                      isActive
                        ? "none"
                        : "1 1",
                  }}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive =
              activeNodes.has(
                node.id
              )

            return (
              <motion.div
                key={node.id}
                initial={{
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  scale: isActive
                    ? 1
                    : 0.7,

                  opacity: isActive
                    ? 1
                    : 0.3,
                }}
                transition={{
                  duration: 0.55,
                  type: "spring",
                  stiffness: 130,
                  damping: 15,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                <div
                  className={`
                    relative
                    cursor-pointer
                    rounded-2xl
                    px-4
                    py-2.5
                    text-center
                    transition-all
                    duration-300
                    hover:scale-[1.03]

                    ${
                      node.type ===
                      "start"
                        ? "bg-gradient-primary text-primary-foreground glow-primary"
                        : ""
                    }

                    ${
                      node.type ===
                      "milestone"
                        ? "glass border border-white/10 hover:border-primary/30"
                        : ""
                    }

                    ${
                      node.type ===
                      "destination"
                        ? "glass-panel border border-primary/20 hover:border-primary/40"
                        : ""
                    }
                  `}
                >
                  {node.type ===
                    "destination" &&
                    isActive && (
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-20 blur-lg" />
                    )}

                  <span
                    className={`
                      relative
                      z-10
                      whitespace-nowrap
                      text-xs
                      font-medium
                      md:text-sm

                      ${
                        node.type ===
                        "start"
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }
                    `}
                  >
                    {node.label}
                  </span>
                </div>
              </motion.div>
            )
          })}

          {/* Legend */}
          <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground md:bottom-6 md:left-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-primary" />

              <span>
                Starting Point
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-border" />

              <span>
                Milestones
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-primary/50" />

              <span>
                Destinations
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}