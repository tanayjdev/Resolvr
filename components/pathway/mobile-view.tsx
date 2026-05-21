'use client'

import { useState } from 'react'
import { ChevronRight, X, TrendingUp, Target, Zap } from 'lucide-react'
import { pathways, filterOptions, timelineMarkers, type CareerPath, type Milestone } from '@/lib/pathway-data'

interface MobilePathwayViewProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  selectedMilestone: { path: CareerPath; milestone: Milestone } | null
  onMilestoneClick: (path: CareerPath, milestone: Milestone) => void
  onClosePanel: () => void
}

export function MobilePathwayView({
  activeFilter,
  setActiveFilter,
  selectedMilestone,
  onMilestoneClick,
  onClosePanel
}: MobilePathwayViewProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(pathways[0].id)

  return (
    <div className="min-h-screen bg-[#030308] pb-24">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
        <div className="px-4 py-3">
          <h1 className="text-white text-lg font-[var(--font-syne)] font-bold">
            Your Future Map
          </h1>
          <p className="text-[11px] text-white/40">
            AI-generated pathway intelligence
          </p>
        </div>
        
        {/* Filter Pills - Horizontal Scroll */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-[12px] font-medium
                    transition-all duration-200 whitespace-nowrap
                    border
                    ${isActive 
                      ? 'bg-[rgba(0,198,255,0.12)] border-[#00C6FF]/40 text-[#00C6FF]' 
                      : 'bg-white/[0.05] border-white/10 text-white/60'
                    }
                  `}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Origin Section */}
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="relative">
          {/* Orbit ring */}
          <div 
            className="absolute inset-0 w-16 h-16 rounded-full border border-dashed border-[#00C6FF]/30 animate-orbit"
            style={{ margin: '-8px' }}
          />
          {/* Main node */}
          <div 
            className="w-12 h-12 rounded-full bg-[#00C6FF] flex items-center justify-center animate-pulse-glow"
            style={{ boxShadow: '0 0 30px rgba(0,198,255,0.5)' }}
          >
            <div className="w-3 h-3 rounded-full bg-white/80" />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-white font-[var(--font-syne)] font-bold">You</p>
          <p className="text-white/40 text-[12px]">Semester 3 · CSE</p>
        </div>
      </div>

      {/* Pathway Cards - Vertically Stacked */}
      <div className="px-4 space-y-3">
        {pathways.map((path) => (
          <PathwayCard
            key={path.id}
            path={path}
            isExpanded={expandedPath === path.id}
            onToggle={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
            onMilestoneClick={onMilestoneClick}
          />
        ))}
      </div>

      {/* Timeline Bar - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/[0.06]">
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[300px]">
            {/* Current position dot */}
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#00C6FF] animate-pulse" />
              <div className="absolute w-4 h-4 rounded-full bg-[#00C6FF]/20 animate-ping" />
            </div>
            
            {/* Timeline line */}
            <div className="flex-1 mx-3 h-[1px] bg-white/10 relative">
              {timelineMarkers.slice(1).map((marker, i) => (
                <div 
                  key={marker.label}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${(i + 1) * 25}%` }}
                >
                  <div className="w-1 h-1 rounded-full bg-white/30 mb-3" />
                  <span className="text-[9px] font-mono text-white/40 whitespace-nowrap">
                    {marker.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Detail Panel */}
      {selectedMilestone && (
        <MobileDetailSheet
          path={selectedMilestone.path}
          milestone={selectedMilestone.milestone}
          onClose={onClosePanel}
        />
      )}
    </div>
  )
}

interface PathwayCardProps {
  path: CareerPath
  isExpanded: boolean
  onToggle: () => void
  onMilestoneClick: (path: CareerPath, milestone: Milestone) => void
}

function PathwayCard({ path, isExpanded, onToggle, onMilestoneClick }: PathwayCardProps) {
  const completedCount = path.milestones.filter(m => m.status === 'completed').length
  const activeCount = path.milestones.filter(m => m.status === 'active').length
  
  return (
    <div 
      className="rounded-xl overflow-hidden border transition-all duration-300"
      style={{ 
        backgroundColor: 'rgba(10,12,20,0.6)',
        borderColor: isExpanded ? `${path.color}40` : 'rgba(255,255,255,0.06)'
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: path.color }}
          />
          <div className="text-left">
            <p className="text-white font-medium text-[14px]">{path.name}</p>
            <p className="text-white/40 text-[11px]">
              {completedCount} completed · {activeCount} active
            </p>
          </div>
        </div>
        <ChevronRight 
          className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>
      
      {/* Expanded Milestones */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fade-in-up">
          {path.milestones.map((milestone, i) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              color={path.color}
              isLast={i === path.milestones.length - 1}
              onClick={() => onMilestoneClick(path, milestone)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MilestoneRowProps {
  milestone: Milestone
  color: string
  isLast: boolean
  onClick: () => void
}

function MilestoneRow({ milestone, color, isLast, onClick }: MilestoneRowProps) {
  const getNodeStyle = () => {
    switch (milestone.status) {
      case 'completed':
        return { bg: color, border: 'none', innerDot: true }
      case 'active':
        return { bg: color, border: 'none', innerDot: false, glow: true }
      case 'upcoming':
        return { bg: 'transparent', border: `1.5px solid ${color}80` }
      case 'locked':
        return { bg: 'transparent', border: `1.5px dashed ${color}40` }
    }
  }
  
  const style = getNodeStyle()
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 py-2 group"
    >
      {/* Node and line */}
      <div className="flex flex-col items-center pt-1">
        <div 
          className={`
            w-3.5 h-3.5 rounded-full flex items-center justify-center
            ${style.glow ? 'animate-pulse' : ''}
          `}
          style={{ 
            backgroundColor: style.bg,
            border: style.border,
            boxShadow: style.glow ? `0 0 12px ${color}80` : 'none'
          }}
        >
          {style.innerDot && (
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </div>
        {!isLast && (
          <div 
            className="w-[1px] h-8 mt-1"
            style={{ backgroundColor: `${color}30` }}
          />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <p 
          className={`
            text-[13px] font-medium
            ${milestone.status === 'locked' ? 'text-white/30 line-through' : 'text-white/80'}
          `}
        >
          {milestone.label}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-white/40">
            {milestone.readiness}% ready
          </span>
          {milestone.status === 'active' && (
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              In Progress
            </span>
          )}
        </div>
        
        {/* Skill chips */}
        <div className="flex flex-wrap gap-1 mt-2">
          {milestone.skills.slice(0, 2).map((skill) => (
            <span 
              key={skill}
              className="text-[10px] px-2 py-0.5 rounded-full font-mono
                         bg-white/[0.04] border border-white/[0.08] text-white/50"
            >
              {skill}
            </span>
          ))}
          {milestone.skills.length > 2 && (
            <span className="text-[10px] text-white/30">
              +{milestone.skills.length - 2}
            </span>
          )}
        </div>
      </div>
      
      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors mt-1" />
    </button>
  )
}

interface MobileDetailSheetProps {
  path: CareerPath
  milestone: Milestone
  onClose: () => void
}

function MobileDetailSheet({ path, milestone, onClose }: MobileDetailSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] glass-panel rounded-t-2xl 
                   overflow-y-auto animate-slide-in-bottom"
        style={{ borderTop: `2px solid ${path.color}` }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/40 
                     hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="px-5 pb-8 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-xl font-[var(--font-syne)] font-bold text-white pr-10">
              {milestone.label}
            </h2>
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
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Readiness */}
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Readiness</p>
              <p className="text-2xl font-[var(--font-syne)] font-bold text-white">
                {milestone.readiness}%
              </p>
            </div>
            
            {/* Probability */}
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Probability</p>
              <p className="text-2xl font-[var(--font-syne)] font-bold text-[#FFB547]">
                {milestone.probability}%
              </p>
            </div>
          </div>
          
          {/* Expected Outcome */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
              Expected Outcome
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-[13px] font-mono">
                  {milestone.salaryRange}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00D4A0]" />
                <span className="text-white/80 text-[13px]">
                  {milestone.growthOutlook}
                </span>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${path.color}20` }}
                >
                  <Zap className="w-5 h-5" style={{ color: path.color }} />
                </div>
                <p className="text-white text-[14px] font-medium flex-1">
                  {milestone.nextAction.title}
                </p>
              </div>
              <button
                className="w-full py-3 rounded-lg text-[14px] font-semibold
                           transition-all duration-200"
                style={{ 
                  backgroundColor: path.color,
                  color: '#030308'
                }}
              >
                {milestone.nextAction.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
