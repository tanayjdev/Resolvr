"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Target,
  BookOpen,
  Zap,
  Award,
  ArrowRight,
  X,
} from "lucide-react"

import { Modal, useModal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmployabilityDetailModalProps {
  isOpen: boolean
  onClose: () => void
  employabilityScore: number
  skills: any[]
  simulationMemory: any
}

export function EmployabilityDetailModal({
  isOpen,
  onClose,
  employabilityScore,
  skills,
  simulationMemory,
}: EmployabilityDetailModalProps) {
  const readinessLevel =
    employabilityScore >= 85 ? "Excellent" : employabilityScore >= 70 ? "Strong" : employabilityScore >= 50 ? "Developing" : "Beginner"

  const readinessColor =
    employabilityScore >= 85 ? "text-emerald-400" : employabilityScore >= 70 ? "text-primary" : employabilityScore >= 50 ? "text-amber-400" : "text-orange-400"

  const skillAnalysis = skills.map((skill) => ({
    name: skill.name,
    level: skill.level,
    status: skill.level >= 80 ? "Strong" : skill.level >= 60 ? "Developing" : "Needs Improvement",
    trend: Math.random() > 0.5 ? "up" : "down",
  }))

  const recommendations = [
    { icon: BookOpen, title: "Complete 2 more simulations", description: "Focus on Kubernetes and Security scenarios" },
    { icon: Target, title: "Improve MLOps skills", description: "Current level at 65%, target 80%" },
    { icon: Zap, title: "Practice incident response", description: "Try the Production AI Incident simulation" },
  ]

  const milestones = [
    { title: "First Simulation", completed: true, date: "2 weeks ago" },
    { title: "Skill Level 60%", completed: true, date: "1 week ago" },
    { title: "Skill Level 75%", completed: employabilityScore >= 75, date: employabilityScore >= 75 ? "Today" : "In progress" },
    { title: "Skill Level 85%", completed: employabilityScore >= 85, date: employabilityScore >= 85 ? "Today" : "Future" },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Employability Readiness Analysis">
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Readiness</p>
              <p className="text-4xl font-bold mt-1">{employabilityScore}%</p>
              <p className={cn("text-sm font-medium mt-1", readinessColor)}>{readinessLevel}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">+12%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs last month</p>
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Skill Analysis
          </h3>
          <div className="space-y-3">
            {skillAnalysis.map((skill, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        skill.level >= 80 ? "bg-emerald-500" : skill.level >= 60 ? "bg-primary" : "bg-amber-500"
                      )}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-1">
                  {skill.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Performance */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Simulation Performance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-1">Average Score</p>
              <p className="text-2xl font-bold">{simulationMemory.averageScore || 0}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold">{simulationMemory.completedCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => {
              const Icon = rec.icon
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Milestones
          </h3>
          <div className="space-y-2">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                {milestone.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", milestone.completed ? "text-foreground" : "text-muted-foreground")}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button className="flex-1 gap-2">
            Start Recommended Simulation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
