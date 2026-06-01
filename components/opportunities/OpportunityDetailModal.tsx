"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Star,
  BookOpen,
  Target,
  ArrowRight,
  X,
} from "lucide-react"

import { Modal, useModal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Opportunity {
  id: number
  title: string
  company: string
  location: string
  salary: string
  match: number
  requiredSkills: string[]
  aiRanking: string
  posted: string
  url: string
}

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null
  onClose: () => void
}

export function OpportunityDetailModal({ opportunity, onClose }: OpportunityDetailModalProps) {
  const { isOpen } = useModal()

  if (!opportunity) return null

  const readinessAnalysis = {
    score: opportunity.match,
    strengths: [
      "Strong technical alignment",
      "Relevant experience level",
      "Skill match high",
    ],
    gaps: opportunity.match < 90 ? [
      "Consider additional certifications",
      "Build portfolio projects",
    ] : [],
  }

  const recommendedSimulations = [
    "Production AI Incident",
    "Kubernetes Regional Failure",
  ]

  const recommendedResources = [
    { title: "Advanced System Design", type: "course" as const, provider: "Coursera" },
    { title: "ML Engineering Best Practices", type: "article" as const, provider: "Medium" },
  ]

  return (
    <Modal isOpen={!!opportunity} onClose={onClose} size="lg" title="Opportunity Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-[var(--font-syne)] text-2xl font-bold">{opportunity.title}</h2>
            <p className="text-lg text-muted-foreground">{opportunity.company}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">{opportunity.match}%</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{opportunity.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{opportunity.posted}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">{opportunity.aiRanking}</span>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Readiness Analysis */}
        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Readiness Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Match Score</span>
              <span className="font-bold">{opportunity.match}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${opportunity.match}%` }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Strengths:</p>
              <ul className="space-y-1">
                {readinessAnalysis.strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            {readinessAnalysis.gaps.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Areas for Improvement:</p>
                <ul className="space-y-1">
                  {readinessAnalysis.gaps.map((gap, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-3 w-3 text-amber-400" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Simulations */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Recommended Simulations
          </h3>
          <div className="space-y-2">
            {recommendedSimulations.map((sim) => (
              <div
                key={sim}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-primary/20 transition-colors"
              >
                <span className="text-sm">{sim}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="gap-1"
                  onClick={() => {
                    // Navigate to simulations page
                    window.location.href = '/simulations'
                  }}
                >
                  Start
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Resources */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommended Resources
          </h3>
          <div className="space-y-2">
            {recommendedResources.map((resource, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-primary/20 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.provider} • {resource.type}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="gap-1"
                  onClick={() => {
                    // Open resource in new tab (placeholder URL)
                    window.open('https://www.google.com/search?q=' + encodeURIComponent(resource.title), '_blank')
                  }}
                >
                  View
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button 
            className="flex-1 gap-2"
            onClick={() => window.open(opportunity.url, '_blank')}
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              // Save functionality - could be expanded to save to user's saved opportunities
              alert('Opportunity saved to your favorites!')
            }}
          >
            Save
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
