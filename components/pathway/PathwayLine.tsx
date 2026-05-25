import type { CareerPath, Milestone } from "@/lib/types"

// ─── Cubic Bezier helper ───────────────────────────────────────────────────
function bezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ]
}

// ─── Given a target X, binary-search for the t that produces it ───────────
function tAtX(
  targetX: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  iterations = 20
): number {
  let lo = 0, hi = 1
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2
    const x   = bezierPoint(mid, p0, p1, p2, p3)[0]
    if (x < targetX) lo = mid
    else              hi = mid
  }
  return (lo + hi) / 2
}

// ─── Config ────────────────────────────────────────────────────────────────
//
//  viewBox is 1400 × 600.  Centre Y = 300.
//
//  All 4 paths originate from the same point (the "You" node).
//  They fan out by having different END Y positions.
//
//  Milestones are placed at FIXED X columns so they never bunch up.
//  We calculate the Y for each column by finding the point on the Bezier
//  at that X, so every dot sits perfectly on its own curve.
//
const ORIGIN_X = 150
const ORIGIN_Y = 300

const END_X = 1110
// Y offsets from centre for each of the 4 paths
const PATH_Y_OFFSETS = [-220, -95, 70, 220]

// Fixed X columns for milestones (adjust count to match your data)
// These are spaced 190px apart starting at x=370, giving plenty of breathing room.
const MILESTONE_X_POSITIONS = [370, 560, 750, 940]

// ───────────────────────────────────────────────────────────────────────────

export default function PathwayLine({
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
  selectedGoal: string
  isHovered: boolean
  isOtherHovered: boolean
  isSelected: boolean
  isLoaded: boolean
  onPathHover: (id: string | null) => void
  onMilestoneClick: (path: CareerPath, milestone: Milestone) => void
  selectedMilestoneId?: string
}) {
  const yOffset = PATH_Y_OFFSETS[pathIndex] ?? 0
  const endY    = ORIGIN_Y + yOffset

  // Bezier control points
  // p1 pushes far right to keep the curve flat near the origin
  // p2 brings it flat again near the end
  const p0: [number, number] = [ORIGIN_X, ORIGIN_Y]
  const p1: [number, number] = [ORIGIN_X + 340, ORIGIN_Y]
  const p2: [number, number] = [END_X    - 300, endY]
  const p3: [number, number] = [END_X,          endY]

  const curvePath = `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`
  const color     = path.color || "#00C6FF"

  // Compute dot positions: use only as many X columns as there are milestones
  const milestoneCount = path.milestones.length
  // Distribute milestones across available columns evenly
  const xPositions: number[] = path.milestones.map((_, i) => {
    if (milestoneCount <= MILESTONE_X_POSITIONS.length) {
      // Fewer or equal milestones than columns — spread them out
      const step = (END_X - ORIGIN_X - 200) / (milestoneCount + 1)
      return ORIGIN_X + 100 + step * (i + 1)
    }
    // More milestones than columns — pack into columns
    return MILESTONE_X_POSITIONS[Math.min(i, MILESTONE_X_POSITIONS.length - 1)]
  })

  // For each milestone, find Y on the curve at its X
  const dotPositions: [number, number][] = path.milestones.map((_, i) => {
    const isLast = i === milestoneCount - 1
    if (isLast) return [END_X, endY] // last dot always exactly at curve end
    const t = tAtX(xPositions[i], p0, p1, p2, p3)
    return bezierPoint(t, p0, p1, p2, p3)
  })

  return (
    <g
      onMouseEnter={() => onPathHover(path.id)}
      onMouseLeave={() => onPathHover(null)}
      className="cursor-pointer"
      opacity={isOtherHovered ? 0.12 : 1}
      style={{ transition: "opacity 0.3s ease" }}
    >
      {/* ── Curve ─────────────────────────────────────────────────── */}
      <path
        d={curvePath}
        fill="none"
        stroke={color}
        strokeWidth={isHovered || isSelected ? 3.5 : 2}
        strokeLinecap="round"
        opacity={isLoaded ? 0.9 : 0}
        style={{
          transition: "all 0.4s ease",
          filter: isHovered || isSelected ? `drop-shadow(0 0 8px ${color})` : "none",
        }}
      />

      {/* ── Milestone dots + labels ────────────────────────────────── */}
      {path.milestones.map((milestone, i) => {
        const [cx, cy] = dotPositions[i]
        const isLast   = i === milestoneCount - 1
        const selected = selectedMilestoneId === milestone.id

        // Alternate label above / below so adjacent labels don't clash
        const above = i % 2 === 0

        return (
          <g
            key={milestone.id}
            onClick={(e) => {
              e.stopPropagation()
              onMilestoneClick(path, milestone)
            }}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
          >
            {/* Glow halo */}
            <circle
              cx={cx} cy={cy}
              r={selected ? 18 : isLast ? 15 : 11}
              fill={color}
              opacity={selected ? 0.25 : 0.12}
            />

            {/* Dot */}
            <circle
              cx={cx} cy={cy}
              r={selected ? 8 : isLast ? 7 : 5}
              fill={color}
              stroke="#ffffff"
              strokeWidth={isLast ? 2.5 : 1.8}
              style={{ transition: "all 0.3s ease" }}
            />

            {/* Label — only for non-last milestones */}
            {!isLast && (
              <text
                x={cx}
                y={above ? cy - 16: cy + 21}
                textAnchor="middle"
                fontSize="11"
                fill="white"
                opacity={isHovered || selected ? 1 : 0.7}
                style={{ transition: "opacity 0.3s ease", pointerEvents: "none" }}
              >
                {milestone.label}
              </text>
            )}
          </g>
        )
      })}

      {/* ── Role name — sits right of the last dot ─────────────────── */}
      <text
        x={END_X + 20}
        y={endY + 5}
        textAnchor="start"
        fontSize="14"
        fontWeight="700"
        fill="white"
        opacity={isLoaded ? 1 : 0}
        style={{ transition: "opacity 0.5s ease" }}
      >
        {path.name}
      </text>
    </g>
  )
}