'use client'
import Link from "next/link"
import { X, TrendingUp, Target, Zap } from 'lucide-react'
import type { CareerPath, Milestone } from '@/lib/pathway-data'

interface DetailPanelProps {
  path: CareerPath
  milestone: Milestone
  onClose: () => void
}

export function DetailPanel({ path, milestone, onClose }: DetailPanelProps) {
  return (
    <aside 
      className="fixed top-14 bottom-12 right-0 w-80 glass-panel z-40 
                 animate-slide-in-right overflow-y-auto
                 border-l"
      style={{ borderColor: path.color }}
    >
      {/* Accent bar */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: path.color }}
      />
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full text-white/40 
                   hover:text-red-400 hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
            <Link href="/pathway">
              <h2 className="text-xl font-[var(--font-syne)] font-bold text-white pr-8 cursor-pointer hover:text-cyan-400 transition-colors">
                {milestone.label}
              </h2>
          </Link>
        <div 
            className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-[11px] font-medium"
            style={{ 
              backgroundColor: `${path.color}20`,
              color: path.color 
            }}
          >
            {path.name} Path
          </div>
        </div>
        
        <hr className="border-white/10" />
        
        {/* Required Skills */}
        <section>
          <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {milestone.skills.map((skill) => (
              <span 
                key={skill}
                className="px-2 py-1 rounded-full text-[11px] font-mono
                           bg-white/[0.06] border border-white/10 text-white/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
        
        {/* Your Readiness */}
        <section>
          <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
            Your Readiness
          </h3>
          <div className="flex items-center gap-3">
            <ReadinessGauge value={milestone.readiness} color={path.color} />
            <div>
              <p className="text-white text-sm font-medium">{milestone.readiness}% ready</p>
              <p className="text-white/40 text-[11px]">
                {milestone.readiness < 100 
                  ? `${Math.ceil((100 - milestone.readiness) / 20)} skills to close gap`
                  : 'Milestone completed'}
              </p>
            </div>
          </div>
        </section>
        
        {/* Expected Outcome */}
        <section>
          <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
            Expected Outcome
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white/80 text-[13px] font-mono">
                {milestone.salaryRange}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#00D4A0]" />
              <span className="text-white/80 text-[13px]">
                {milestone.growthOutlook}
              </span>
            </div>
          </div>
        </section>
        
        {/* Probability Score */}
        <section>
          <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
            Probability Score
          </h3>
          <p className="text-white/70 text-[13px] mb-2">
            {milestone.probability}% likely based on your current trajectory
          </p>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${milestone.probability}%`,
                backgroundColor: '#FFB547'
              }}
            />
          </div>
        </section>
        
        {/* Recommended Next Action */}
        <section className="pt-2">
          <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-3 font-medium">
            Recommended Next Action
          </h3>
          <div className="p-4 rounded-lg bg-white/[0.04] border border-white/10">
            <div className="flex items-start gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${path.color}20` }}
              >
                <Zap className="w-4 h-4" style={{ color: path.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-medium leading-tight">
                  {milestone.nextAction.title}
                </p>
              </div>
            </div>
            <Link href="/pathway">
                <button
                    className="w-full mt-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
                    style={{
                          backgroundColor: path.color,
                          color: '#030308'
                       }}
                >
                  {milestone.nextAction.cta}
                </button>
            </Link>
          </div>
        </section>
      </div>
    </aside>
  )
}

function ReadinessGauge({ value, color }: { value: number; color: string }) {
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (value / 100) * circumference
  
  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-mono text-white/80">{value}%</span>
      </div>
    </div>
  )
}
