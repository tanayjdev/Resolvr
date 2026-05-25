"use client"
import PathwayLine from "@/components/pathway/PathwayLine"
import { OriginNode } from "@/components/pathway/OriginNode"
import AmbientInsights from "@/components/pathway/AmbientInsights"

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"

import PageTransition from "@/components/common/PageTransition"

import { pathways } from "@/lib/pathway-data"
import type { CareerPath, Milestone } from "@/lib/types"

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

            <OriginNode/>
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



