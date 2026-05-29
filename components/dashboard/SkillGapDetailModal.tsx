"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  X,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react"

import { Modal, useModal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SkillGap {
  name: string
  current: number
  target: number
  priority: 'high' | 'medium' | 'low'
  recommendation: string
}

interface SkillGapDetailModalProps {
  isOpen: boolean
  onClose: () => void
  skillGaps: SkillGap[]
  selectedSkill?: SkillGap | null
}

export function SkillGapDetailModal({
  isOpen,
  onClose,
  skillGaps,
  selectedSkill,
}: SkillGapDetailModalProps) {
  const totalGap = skillGaps.length > 0 ? skillGaps.reduce((sum, gap) => sum + (gap.target - gap.current), 0) : 0
  const highPriorityGaps = skillGaps.filter((gap) => gap.priority === 'high').length

  const learningResources = [
    { title: "Advanced ML Engineering", type: "course", provider: "Coursera", duration: "8 weeks" },
    { title: "System Design Fundamentals", type: "workshop", provider: "Udemy", duration: "4 weeks" },
    { title: "Cloud Architecture Patterns", type: "certification", provider: "AWS", duration: "12 weeks" },
  ]

  const milestones = [
    { title: "Reach 75% in ML", target: "2 weeks", progress: 65 },
    { title: "Complete System Design", target: "4 weeks", progress: 40 },
    { title: "Cloud Certification", target: "12 weeks", progress: 25 },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Skill Gap Analysis Report">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span>Total Gap</span>
            </div>
            <div className="text-2xl font-bold">{totalGap}%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span>High Priority</span>
            </div>
            <div className="text-2xl font-bold">{highPriorityGaps}</div>
          </div>
        </div>

        {/* Detailed Skill Breakdown */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Skill Breakdown
          </h3>
          <div className="space-y-3">
            {skillGaps.map((skill, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{skill.name}</h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border",
                          skill.priority === 'high' && 'bg-destructive/10 text-destructive border-destructive/20',
                          skill.priority === 'medium' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                          skill.priority === 'low' && 'bg-accent/10 text-accent border-accent/20'
                        )}
                      >
                        {skill.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Target: {skill.target}% proficiency</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{skill.current}%</div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      skill.priority === 'high' && 'bg-gradient-to-r from-red-500 via-orange-400 to-amber-300',
                      skill.priority === 'medium' && 'bg-gradient-to-r from-amber-400 via-yellow-300 to-accent',
                      skill.priority === 'low' && 'bg-gradient-to-r from-accent to-primary'
                    )}
                    style={{ width: `${skill.current}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-white/30 z-10"
                    style={{ left: `${skill.target}%` }}
                  />
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-black/20 px-3 py-2">
                  {skill.priority === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  )}
                  <p className="text-sm text-foreground/85">{skill.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Recommended Learning Resources
          </h3>
          <div className="space-y-2">
            {learningResources.map((resource, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-primary/20 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.provider} • {resource.type} • {resource.duration}</p>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  Start
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Learning Milestones
          </h3>
          <div className="space-y-3">
            {milestones.map((milestone, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{milestone.title}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {milestone.target}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${milestone.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button className="flex-1 gap-2">
            Start Learning Plan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
