import type { CareerPath, Milestone } from "@/lib/types"

const PATH_Y_OFFSETS = [-180, -90, 0, 90, 180]

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
  selectedGoal: string
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
        className="fill-white font-bold text-[15px]"
      >
        {path.name}
      </text>
    </g>
  )
}

export default PathwayLine