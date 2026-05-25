"use client"
import { goalInsights, pathInsights } from "@/lib/mock-data"

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

  export default AmbientInsights