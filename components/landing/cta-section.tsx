"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CTASection() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-70" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] opacity-70" />

      <Container className="relative max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Career Pathway Intelligence</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1] font-bold font-[var(--font-syne)] mb-6 text-balance">
            Ready to take control of your{" "}
            <span className="text-gradient">future?</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Start mapping your personalized career pathway today. 
            No credit card required. Free for students.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:opacity-95 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl shadow-[0_10px_40px_rgba(0,198,255,0.25)] group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl"
              onClick={() => setContactOpen(true)}
            >
              Talk to Our Team
            </Button>
          </div>
        </motion.div>
      </Container>

      {/* Contact Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-[var(--font-syne)]">
              Contact Our Team
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Have questions? We'd love to hear from you. Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea
                  placeholder="How can we help?"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                />
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                Send Message
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}