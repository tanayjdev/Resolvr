"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import PageTransition from "@/components/common/PageTransition"

import {
  Sidebar,
  TopBar,
  BottomNav,
} from "@/components/dashboard/navigation"

import { KPIStats } from "@/components/dashboard/kpi-stats"

import {
  AdaptivePathwayGraph,
} from "@/components/dashboard/pathway-graph"

import {
  EmployabilityReadiness,
} from "@/components/dashboard/employability-readiness"

import {
  SkillGapAnalysis,
} from "@/components/dashboard/skill-gap-analysis"

import {
  AIGuidancePanel,
} from "@/components/dashboard/ai-guidance"

import {
  FeaturedSimulation,
} from "@/components/dashboard/featured-simulation"

import {
  OpportunityRecommendations,
} from "@/components/dashboard/opportunities"

import {
  FutureProgressionTimeline,
} from "@/components/dashboard/timeline"

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="relative lg:pl-64">
          {/* Top Navigation */}
          <TopBar />

          {/* Dashboard */}
          <main className="relative space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-10">
            {/* KPI Section */}
            <KPIStats />

            {/* Main Dashboard Grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
            >
              {/* Pathway Graph */}
              <section className="lg:col-span-8">
                <AdaptivePathwayGraph />
              </section>

              {/* Employability */}
              <section className="lg:col-span-4">
                <EmployabilityReadiness />
              </section>

              {/* Skill Gap */}
              <section className="lg:col-span-6">
                <SkillGapAnalysis />
              </section>

              {/* AI Guidance */}
              <section className="lg:col-span-6">
                <AIGuidancePanel />
              </section>

              {/* Featured Simulation */}
              <section className="lg:col-span-4">
                <Link
                  href="/recommendations"
                  className="block"
                >
                  <div className="cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]">
                    <FeaturedSimulation />
                  </div>
                </Link>
              </section>

              {/* Timeline */}
              <section className="lg:col-span-8">
                <FutureProgressionTimeline />
              </section>

              {/* Opportunities */}
              <section className="lg:col-span-12">
                <OpportunityRecommendations />
              </section>
            </motion.div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>
    </PageTransition>
  )
}