"use client"

import Image from "next/image"
import PathwayLine from "@/components/pathway/PathwayLine"
import { OriginNode } from "@/components/pathway/OriginNode"
import AmbientInsights from "@/components/pathway/AmbientInsights"

import { useEffect, useRef, useState, useCallback } from "react"

import PageTransition from "@/components/common/PageTransition"
import { pathways } from "@/lib/pathway-data"
import type { CareerPath, Milestone } from "@/lib/types"
import { goalInsights } from "@/lib/mock-data"
import { TopBar } from "@/components/pathway/top-bar"
import { BottomBar } from "@/components/pathway/bottom-bar"
import { DetailPanel } from "@/components/pathway/detail-panel"
import { MobilePathwayView } from "@/components/pathway/mobile-view"
import { useIsMobile } from "@/hooks/use-mobile"

// ─── These constants are the single source of truth ──────────────────────
// PathwayLine.tsx reads the same ORIGIN_X / ORIGIN_Y values internally.
// OriginNode must render its centre circle at exactly (180, 300).
const ORIGIN_X = 180
const ORIGIN_Y = 300
// ──────────────────────────────────────────────────────────────────────────

const GOALS = [
  "ML Engineer",
  "Product Manager",
  "DevOps Lead",
  "Research Scientist",
] as const

export default function PathwayVisualization() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<{
    path: CareerPath; milestone: Milestone
  } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<keyof typeof goalInsights>("ML Engineer")

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 120)
    return () => clearTimeout(t)
  }, [])

  const handleMilestoneClick = useCallback((path: CareerPath, milestone: Milestone) => {
    setSelectedMilestone({ path, milestone })
  }, [])

  const handleClosePanel = useCallback(() => setSelectedMilestone(null), [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) setSelectedMilestone(null)
  }, [])

  if (isMobile) {
    return (
      <MobilePathwayView
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedMilestone={selectedMilestone}
        onMilestoneClick={handleMilestoneClick}
        onClosePanel={handleClosePanel}
      />
    )
  }

  return (
    <PageTransition>
      <div className="relative h-screen w-screen overflow-hidden bg-[#030308]">

        {/* ── Goal selector ──────────────────────────────────────────── */}
        <div className="absolute left-6 top-20 z-50 flex flex-wrap gap-3">
          {GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => setSelectedGoal(goal)}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${selectedGoal === goal
                  ? "bg-cyan-500 text-black shadow-[0_0_25px_rgba(0,198,255,0.35)]"
                  : "bg-white/10 text-white hover:bg-white/20"
                }`}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* ── Ambient background ─────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[70%] w-[70%] rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(0,198,255,0.03) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 right-0 h-[70%] w-[70%] rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(123,47,255,0.035) 0%, transparent 60%)" }} />
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(0,212,160,0.015) 0%, transparent 50%)" }} />

          {/* Dot grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
            <defs>
              <pattern id="dotGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="0.6" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>

          <StarParticles />
        </div>

        {/* ── Main SVG canvas ────────────────────────────────────────── */}
        {/*
          viewBox  : 1400 × 600
          Centre Y : 300  ← matches ORIGIN_Y and the midpoint of all 4 paths
          Paths fan from Y=100 (top, offset -200) to Y=500 (bottom, offset +200)
          Role-name text lands at X=1130 — comfortably inside the 1400-wide box
        */}
        <div
          ref={canvasRef}
          className="absolute inset-0 pb-14 pt-16"
          onClick={handleCanvasClick}
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1400 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Subtle dashed vertical time-markers */}
            {[380, 580, 780, 970].map((x, i) => (
              <line
                key={i}
                x1={x} y1="40" x2={x} y2="560"
                stroke="rgba(255,255,255,0.025)"
                strokeWidth="1"
                strokeDasharray="4 10"
              />
            ))}

            {/* Pathway curves + milestone dots */}
            {pathways.map((path, idx) => (
              <PathwayLine
                key={path.id}
                path={path}
                pathIndex={idx}
                selectedGoal={selectedGoal}
                isHovered={hoveredPath === path.id}
                isOtherHovered={hoveredPath !== null && hoveredPath !== path.id}
                isSelected={selectedMilestone?.path.id === path.id}
                isLoaded={isLoaded}
                onPathHover={setHoveredPath}
                onMilestoneClick={handleMilestoneClick}
                selectedMilestoneId={selectedMilestone?.milestone.id}
              />
            ))}

            {/*
              OriginNode — MUST render its centre circle at (180, 300).
              Pass both x/y and cx/cy so the component can use whichever prop it reads.
              If your OriginNode ignores all props and uses internal constants,
              change those constants to cx=180 cy=300 inside OriginNode.tsx.
            */}
            <OriginNode cx={ORIGIN_X} cy={ORIGIN_Y} x={ORIGIN_X} y={ORIGIN_Y} />
          </svg>
        </div>

        <AmbientInsights
          isLoaded={isLoaded}
          hoveredPath={hoveredPath}
          selectedGoal={selectedGoal}
        />

        <TopBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <BottomBar />

        {selectedMilestone && (
          <DetailPanel
            path={selectedMilestone.path}
            milestone={selectedMilestone.milestone}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </PageTransition>
  )
}

function StarParticles() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5,
    size: Math.random() * 2 + 0.5,
  }))

  return (
    <div className="absolute inset-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
        />
      ))}
    </div>
  )
}