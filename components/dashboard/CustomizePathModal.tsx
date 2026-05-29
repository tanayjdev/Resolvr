"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Target,
  BookOpen,
  Briefcase,
  Sparkles,
  CheckCircle2,
  X,
  Save,
  ArrowRight,
} from "lucide-react"

import { Modal, useModal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomizePathModalProps {
  isOpen: boolean
  onClose: () => void
  currentPathway: string
  onSave: (pathway: string, interests: string[]) => void
}

export function CustomizePathModal({ isOpen, onClose, currentPathway, onSave }: CustomizePathModalProps) {
  const [selectedPathway, setSelectedPathway] = React.useState(currentPathway)
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([])

  // Reset selected pathway when modal opens with a different currentPathway
  React.useEffect(() => {
    setSelectedPathway(currentPathway)
  }, [currentPathway, isOpen])

  const pathways = [
    { id: "ml-engineer", title: "ML Engineer", icon: Briefcase, description: "Build and deploy ML systems at scale" },
    { id: "data-scientist", title: "Data Scientist", icon: Sparkles, description: "Extract insights from data and build models" },
    { id: "mlops", title: "MLOps Engineer", icon: Settings, description: "Infrastructure and automation for ML" },
    { id: "ai-research", title: "AI Researcher", icon: BookOpen, description: "Push the boundaries of AI research" },
  ]

  const interests = [
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "Reinforcement Learning",
    "Cloud Infrastructure",
    "System Design",
    "Data Engineering",
    "Product Management",
  ]

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleSave = () => {
    onSave(selectedPathway, selectedInterests)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Customize Your Path">
      <div className="space-y-6">
        {/* Pathway Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Select Your Career Pathway
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathways.map((pathway) => {
              const Icon = pathway.icon
              return (
                <button
                  key={pathway.id}
                  onClick={() => setSelectedPathway(pathway.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    selectedPathway === pathway.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mt-0.5", selectedPathway === pathway.id ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex-1">
                    <p className="font-medium">{pathway.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pathway.description}</p>
                  </div>
                  {selectedPathway === pathway.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Interests Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Select Your Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all",
                  selectedInterests.includes(interest)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                {selectedInterests.includes(interest) && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">AI Recommendation</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your profile and goals, we recommend focusing on {selectedPathway.replace("-", " ")} with emphasis on your selected interests.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
