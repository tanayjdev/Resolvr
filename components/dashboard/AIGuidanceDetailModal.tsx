"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
  BookOpen,
  BrainCircuit,
  ArrowRight,
  X,
  Send,
  MessageCircle,
} from "lucide-react"

import { Modal, useModal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  type: 'pathway' | 'skill' | 'opportunity' | 'action'
  title: string
  description: string
  action: string
  priority: 'high' | 'medium' | 'low'
}

interface AIGuidanceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  insight: AIInsight | null
}

export function AIGuidanceDetailModal({
  isOpen,
  onClose,
  insight,
}: AIGuidanceDetailModalProps) {
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hello! I'm your AI career guidance assistant. How can I help you today?" }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return
    setMessages([...messages, { role: "user", content: message }])
    setMessage("")
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "Based on your profile and progress, I recommend focusing on completing the Kubernetes Regional Failure simulation to improve your infrastructure skills. This will help close your skill gap in cloud computing." }])
    }, 1000)
  }

  if (!insight) return null

  const typeIcons = {
    pathway: Target,
    skill: TrendingUp,
    opportunity: Lightbulb,
    action: BookOpen,
  }

  const Icon = typeIcons[insight.type]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="AI Guidance Detail">
      <div className="space-y-6">
        {/* Insight Detail */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{insight.title}</h3>
                {insight.priority === 'high' && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Priority
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask AI for More Insights
          </h3>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 max-w-[80%]",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-foreground"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question about your career path..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
              <Button size="sm" onClick={handleSendMessage} className="gap-2">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommended Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-primary/20 transition-colors">
              <span className="text-sm">{insight.action}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-primary/20 transition-colors">
              <span className="text-sm">View Related Simulations</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1 gap-2">
            {insight.action}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
