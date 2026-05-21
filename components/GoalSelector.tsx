"use client"

interface GoalSelectorProps {
  selectedGoal: string
  onSelect: (goal: string) => void
}

const goals = [
  "ML Engineer",
  "Product Manager",
  "Cloud Architect",
  "Research Scientist",
]

export default function GoalSelector({
  selectedGoal,
  onSelect,
}: GoalSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {goals.map((goal) => (
        <button
          key={goal}
          onClick={() => onSelect(goal)}
          className={`px-5 py-2 rounded-full border transition-all duration-300
          ${
            selectedGoal === goal
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          {goal}
        </button>
      ))}
    </div>
  )
}