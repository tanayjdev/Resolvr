"use client"

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"

import PageTransition from "@/components/common/PageTransition"

import {
  pathways,
  type CareerPath,
  type Milestone,
} from "@/lib/pathway-data"

import {
  pathInsights,
  goalInsights,
} from "@/lib/mock-data"

import { TopBar } from "@/components/pathway/top-bar"
import { BottomBar } from "@/components/pathway/bottom-bar"
import { DetailPanel } from "@/components/pathway/detail-panel"
import { MobilePathwayView } from "@/components/pathway/mobile-view"

import { useIsMobile } from "@/hooks/use-mobile"

const PATH_Y_OFFSETS = [-210, -70, 70, 210]

export default function PathwayVisualization() {
  const canvasRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()

  const [activeFilter, setActiveFilter] =
    useState("all")

  const [hoveredPath, setHoveredPath] =
    useState<string | null>(null)

  const [selectedMilestone, setSelectedMilestone] =
    useState<{
      path: CareerPath
      milestone: Milestone
    } | null>(null)

  const [isLoaded, setIsLoaded] =
    useState(false)

  const [selectedGoal, setSelectedGoal] =
    useState<
      keyof typeof goalInsights
    >("ML Engineer")

  useEffect(() => {
    const timer = setTimeout(
      () => setIsLoaded(true),
      120
    )

    return () => clearTimeout(timer)
  }, [])

  const handleMilestoneClick =
    useCallback(
      (
        path: CareerPath,
        milestone: Milestone
      ) => {
        setSelectedMilestone({
          path,
          milestone,
        })
      },
      []
    )

  const handleClosePanel =
    useCallback(() => {
      setSelectedMilestone(null)
    }, [])

  const handleCanvasClick =
    useCallback(
      (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
          setSelectedMilestone(null)
        }
      },
      []
    )

  if (isMobile) {
    return (
      <MobilePathwayView
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedMilestone={
          selectedMilestone
        }
        onMilestoneClick={
          handleMilestoneClick
        }
        onClosePanel={
          handleClosePanel
        }
      />
    )
  }

  return (
    <PageTransition>
      <div className="relative h-screen w-screen overflow-hidden bg-[#030308]">
        {/* Goal Selector */}
        <div className="absolute left-6 top-20 z-50 flex flex-wrap gap-3">
          {[
            "ML Engineer",
            "Product Manager",
            "DevOps Lead",
            "Research Scientist",
          ].map((goal) => (
            <button
              key={goal}
              onClick={() =>
                setSelectedGoal(
                  goal as keyof typeof goalInsights
                )
              }
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                selectedGoal === goal
                  ? "bg-cyan-500 text-black shadow-[0_0_25px_rgba(0,198,255,0.35)]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-0 top-0 h-[70%] w-[70%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,198,255,0.03) 0%, transparent 60%)",
            }}
          />

          <div
            className="absolute bottom-0 right-0 h-[70%] w-[70%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(123,47,255,0.035) 0%, transparent 60%)",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,212,160,0.015) 0%, transparent 50%)",
            }}
          />

          {/* Grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
            <defs>
              <pattern
                id="dotGrid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="0.6"
                  fill="white"
                />
              </pattern>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="url(#dotGrid)"
            />
          </svg>

          <StarParticles />
        </div>

        {/* Main Canvas */}
        <div
          ref={canvasRef}
          className="absolute inset-0 pb-14 pt-16"
          onClick={handleCanvasClick}
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1400 700"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="growthGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgba(0,198,255,0.05)"
                />

                <stop
                  offset="100%"
                  stopColor="transparent"
                />
              </linearGradient>
            </defs>

            {/* Growth Area */}
            <path
              d="M 0 620 Q 400 580 700 500 T 1400 400 L 1400 700 L 0 700 Z"
              fill="url(#growthGradient)"
              className="opacity-50"
            />

            <path
              d="M 0 620 Q 400 580 700 500 T 1400 400"
              fill="none"
              stroke="rgba(0,198,255,0.1)"
              strokeWidth="1"
            />

            {/* Time Markers */}
            {[350, 550, 800, 1050].map(
              (x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="80"
                  x2={x}
                  y2="620"
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
              )
            )}

            {/* Pathways */}
            {pathways.map((path, pathIndex) => (
              <PathwayLine
                key={path.id}
                selectedGoal={selectedGoal}
                path={path}
                pathIndex={pathIndex}
                isHovered={hoveredPath === path.id}
                isOtherHovered={
                  hoveredPath !== null &&
                  hoveredPath !== path.id
                }
                isSelected={
                  selectedMilestone?.path.id === path.id
                }
                isLoaded={isLoaded}
                onPathHover={setHoveredPath}
                onMilestoneClick={handleMilestoneClick}
                selectedMilestoneId={
                  selectedMilestone?.milestone.id
                }
              />
            ))}

            <OriginNode
              isLoaded={isLoaded}
            />
          </svg>
        </div>

        <AmbientInsights
          isLoaded={isLoaded}
          hoveredPath={hoveredPath}
          selectedGoal={selectedGoal}
        />

        <TopBar
          activeFilter={activeFilter}
          setActiveFilter={
            setActiveFilter
          }
        />

        <BottomBar />

        {selectedMilestone && (
          <DetailPanel
            path={
              selectedMilestone.path
            }
            milestone={
              selectedMilestone.milestone
            }
            onClose={
              handleClosePanel
            }
          />
        )}
      </div>
    </PageTransition>
  )
}

function AmbientInsights({
  isLoaded,
  hoveredPath,
  selectedGoal,
}: {
  isLoaded: boolean
  hoveredPath: string | null
  selectedGoal: keyof typeof goalInsights
}) {
  const currentGoalData =
    goalInsights[selectedGoal]

  const insights = [
    {
      label: "Market Alignment",
      value:
        currentGoalData.marketAlignment,
      trend: "+5%",
    },

    {
      label: "Skill Coverage",
      value:
        currentGoalData.skillCoverage,
      trend: "+12%",
    },

    {
      label: "Active Paths",
      value:
        currentGoalData.activePaths.toString(),
      trend: null,
    },
  ]

  const currentInsight = hoveredPath
    ? pathInsights[
        hoveredPath as keyof typeof pathInsights
      ]
    : null

  return (
    <div
      className={`fixed right-4 top-20 z-40 transition-all duration-500 lg:right-6 ${
        isLoaded
          ? "translate-x-0 opacity-100"
          : "translate-x-4 opacity-0"
      }`}
      style={{
        transitionDelay: "800ms",
      }}
    >
      <div className="glass min-w-[190px] rounded-xl border border-white/[0.06] p-3">
        <div className="mb-3 flex items-center gap-2 border-b border-white/[0.06] pb-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00C6FF]" />

          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            AI Analysis
          </span>
        </div>

        <div className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight.label}
              className="flex items-center justify-between"
            >
              <span className="text-[11px] text-white/40">
                {insight.label}
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-white/80">
                  {insight.value}
                </span>

                {insight.trend && (
                  <span className="text-[9px] text-[#00D4A0]">
                    {insight.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {currentInsight && (
          <div className="animate-fade-in mt-3 border-t border-white/[0.06] pt-2">
            <div className="mb-1 text-[10px] text-white/30">
              Focus Area
            </div>

            <div className="text-[11px] font-medium text-[#00C6FF]">
              {currentInsight.focus}
            </div>

            <div className="mb-1 mt-2 text-[10px] text-white/30">
              Opportunity
            </div>

            <div className="text-[10px] leading-relaxed text-white/60">
              {currentInsight.opportunity}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StarParticles() {
  const stars = Array.from(
    { length: 40 },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity:
        Math.random() * 0.5,
      size:
        Math.random() * 2 + 0.5,
    })
  )

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}

function PathwayLine({
  path,
  pathIndex,
  selectedGoal,
  isHovered,
  isOtherHovered,
  isSelected,
  isLoaded,
  onPathHover,
  onMilestoneClick,
  selectedMilestoneId,
}: {
  path: CareerPath
  pathIndex: number
  selectedGoal: keyof typeof goalInsights
  isHovered: boolean
  isOtherHovered: boolean
  isSelected: boolean
  isLoaded: boolean
  onPathHover: (id: string | null) => void
  onMilestoneClick: (
    path: CareerPath,
    milestone: Milestone
  ) => void
  selectedMilestoneId?: string
}) {
  const yOffset = PATH_Y_OFFSETS[pathIndex] || 0

  const startX = 180
  const startY = 350

  const endX = 1200
  const endY = 350 + yOffset

  const pathColor = path.color || "#00C6FF"

  const curvePath = `
    M ${startX} ${startY}
    C 450 ${startY},
      750 ${endY},
      ${endX} ${endY}
  `

  return (
    <g
      onMouseEnter={() => onPathHover(path.id)}
      onMouseLeave={() => onPathHover(null)}
      className="cursor-pointer transition-all duration-300"
      opacity={isOtherHovered ? 0.25 : 1}
    >
      <path
        d={curvePath}
        fill="none"
        stroke={pathColor}
        strokeWidth={isHovered || isSelected ? 4 : 2}
        strokeLinecap="round"
        opacity={isLoaded ? 0.9 : 0}
        style={{
          transition: "all 0.4s ease",
          filter:
            isHovered || isSelected
              ? `drop-shadow(0 0 12px ${pathColor})`
              : "none",
        }}
      />

      {path.milestones.map((milestone, index) => {
        const x = 350 + index * 220
        const y = startY + (yOffset / 4) * (index + 1)
        const selected = selectedMilestoneId === milestone.id

        return (
          <g
            key={milestone.id}
            onClick={(e) => {
              e.stopPropagation()
              onMilestoneClick(path, milestone)
            }}
            className="cursor-pointer"
          >
            <circle
              cx={x}
              cy={y}
              r={selected ? 22 : 16}
              fill={pathColor}
              opacity={0.12}
            />

            <circle
              cx={x}
              cy={y}
              r={selected ? 11 : 8}
              fill={pathColor}
              stroke="white"
              strokeWidth="2"
              style={{ transition: "all 0.3s ease" }}
            />

            <text
              x={x}
              y={y - 22}
              textAnchor="middle"
              className="fill-white text-[11px] font-medium"
            >
              {milestone.label}
            </text>
          </g>
        )
      })}

      <text
        x={endX + 25}
        y={endY}
        className="fill-white font-[var(--font-syne)] text-[15px] font-bold"
      >
        {path.name}
      </text>

      <text
        x={endX + 25}
        y={endY + 18}
        className="fill-white/45 text-[11px]"
      >
        {goalInsights[selectedGoal].marketAlignment} Alignment
      </text>
    </g>
  )
}

function OriginNode({
  isLoaded,
}: {
  isLoaded: boolean
}) {
  return (
    <g
      className={`transition-opacity duration-500 ${
        isLoaded
          ? "opacity-100"
          : "opacity-0"
      }`}
      style={{
        transitionDelay: "300ms",
      }}
    >
      <circle
        cx="180"
        cy="350"
        r="55"
        fill="rgba(0,198,255,0.025)"
      />

      <circle
        cx="180"
        cy="350"
        r="38"
        fill="none"
        stroke="rgba(0,198,255,0.08)"
        strokeWidth="0.5"
      />

      <circle
        cx="180"
        cy="350"
        r="28"
        fill="none"
        stroke="rgba(0,198,255,0.25)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      <circle
        cx="180"
        cy="350"
        r="16"
        fill="#00C6FF"
        style={{
          filter:
            "drop-shadow(0 0 28px rgba(0,198,255,0.5))",
        }}
      />

      <circle
        cx="180"
        cy="350"
        r="5"
        fill="white"
        opacity="0.85"
      />

      <text
        x="180"
        y="402"
        textAnchor="middle"
        className="fill-white font-[var(--font-syne)] text-[14px] font-bold"
      >
        You
      </text>

      <text
        x="180"
        y="418"
        textAnchor="middle"
        className="fill-white/35 text-[11px]"
      >
        Current Position
      </text>
    </g>
  )
}