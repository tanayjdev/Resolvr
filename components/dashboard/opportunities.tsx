"use client"


import * as React from "react"

import { motion } from "framer-motion"

import useEmblaCarousel from "embla-carousel-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import {
  useUserProgress,
} from "@/context/user-context"

import {
  getAdaptiveOpportunities,
  getComputedReadinessScore,
  ONBOARDING_PROMPT_TEXT,
  type DashboardOpportunity,
} from "@/lib/pathwayData"

type ExtendedOpportunity = DashboardOpportunity

import {
  MapPin,
  Building2,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal"

// =========================================================
// Type Badge
// =========================================================

function TypeBadge({
  type,
}: {
  type:
  | "internship"
  | "fulltime"
  | "parttime"
}) {
  const styles = {
    internship:
      "border-primary/20 bg-primary/10 text-primary",

    fulltime:
      "border-accent/20 bg-accent/10 text-accent",

    parttime:
      "border-secondary/20 bg-secondary/10 text-secondary-foreground",
  }

  const labels = {
    internship: "Internship",

    fulltime: "Full-time",

    parttime: "Part-time",
  }

  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",

        styles[type]
      )}
    >
      {labels[type]}
    </span>
  )
}

// =========================================================
// Match Score
// =========================================================

function MatchScoreBadge({
  score,
}: {
  score: number
}) {
  const colorClass =
    score >= 90
      ? "text-accent"
      : score >= 80
        ? "text-primary"
        : "text-amber-400"

  return (
    <div className="flex flex-col">
      <span
        className={cn(
          "text-2xl font-bold tracking-tight",

          colorClass
        )}
      >
        {score}%
      </span>

      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Match Score
      </span>
    </div>
  )
}

// =========================================================
// Card
// =========================================================

function OpportunityCard({
  opportunity,
  onView,
}: {
  opportunity: ExtendedOpportunity
  onView: (opportunity: ExtendedOpportunity) => void
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group relative flex h-full min-h-[340px] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0f1d] via-[#090b16] to-[#06070d] p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -top-20 right-[-10%] h-52 w-52 rounded-full bg-primary/10 blur-[90px]" />

        <div className="absolute bottom-[-20%] left-[-10%] h-56 w-56 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.03]" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-primary/20 to-secondary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 space-y-1">
              <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                {opportunity.title}
              </h4>

              <p className="text-xs text-muted-foreground">
                {opportunity.company}
              </p>
            </div>
          </div>

          <button
            onClick={() => onView(opportunity)}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-2 opacity-0 transition-all duration-300 hover:bg-white/[0.06] group-hover:opacity-100"
          >
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Meta */}
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />

            <span className="truncate">
              {opportunity.location}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />

            <span>
              {opportunity.postedAt}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          <TypeBadge
            type={opportunity.type}
          />

          {opportunity.tags.map(
            (tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            )
          )}
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
    Why matched
  </p>

  <p className="text-xs leading-relaxed text-foreground/80">
    {opportunity.reason}
  </p>
</div>


        {/* Divider */}
        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-1">
          <MatchScoreBadge
            score={
              opportunity.matchScore
            }
          />

          <button
            onClick={() => onView(opportunity)}
            className="group/button inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <span>View</span>

            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// =========================================================
// Main Component
// =========================================================

export function OpportunityRecommendations() {
  const { progress, profile } =
    useUserProgress()

  const [selectedOpportunity, setSelectedOpportunity] = React.useState<ExtendedOpportunity | null>(null)

  const readinessScore =
    React.useMemo(
      () =>
        getComputedReadinessScore(
          profile
        ),
      [profile]
    )

  const opportunities =
    React.useMemo(
      () =>
        getAdaptiveOpportunities({
          careerGoal:
            profile.careerGoal,
          interests:
            profile.interests,
          skillLevel:
            profile.skillLevel,
          readinessScore,
          pathwayProgress:
            profile.pathwayProgress,
          completedSimulations:
            profile.completedSimulations,
          recommendedSkills:
            profile.recommendedSkills,
          onboardingComplete:
            profile.onboardingComplete,
          simulationsCompleted:
            progress.simulationsCompleted,
        }),
      [
        profile,
        progress.simulationsCompleted,
        readinessScore,
      ]
    )


  const [
    emblaRef,
    emblaApi,
  ] = useEmblaCarousel({
    align: "start",

    containScroll:
      "trimSnaps",

    dragFree: true,
  })

  const [
    selectedIndex,
    setSelectedIndex,
  ] = React.useState(0)

  const [
    canScrollPrev,
    setCanScrollPrev,
  ] = React.useState(false)

  const [
    canScrollNext,
    setCanScrollNext,
  ] = React.useState(true)

  const scrollPrev =
    React.useCallback(() => {
      emblaApi?.scrollPrev()
    }, [emblaApi])

  const scrollNext =
    React.useCallback(() => {
      emblaApi?.scrollNext()
    }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(
        emblaApi.selectedScrollSnap()
      )

      setCanScrollPrev(
        emblaApi.canScrollPrev()
      )

      setCanScrollNext(
        emblaApi.canScrollNext()
      )
    }

    emblaApi.on(
      "select",
      onSelect
    )

    onSelect()

    return () => {
      emblaApi.off(
        "select",
        onSelect
      )
    }
  }, [emblaApi])

  return (
    <section className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] via-[#090b16] to-[#05060d] p-4 sm:p-6">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

        <div className="absolute bottom-[-30%] right-[-10%] h-80 w-80 rounded-full bg-secondary/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {!profile.onboardingComplete && (
          <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {ONBOARDING_PROMPT_TEXT}
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground/80">
  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

  Recommendations updated from your
  latest simulations and pathway progress
</div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                AI Curated
              </span>
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Opportunities For You
            </h3>

            <p className="mt-1 text-sm text-muted-foreground/80">
              Personalized recommendations based on your pathway, readiness, and progress.
            </p>
          </div>

          {/* Controls */}
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

           

        {/* Highlight */}
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
          <TrendingUp className="h-4 w-4 flex-shrink-0 text-accent" />

          <p className="text-sm text-accent">
          Recommendations adapted from your
simulation performance, readiness,
and pathway progression.
          </p>
        </div>

        {/* Desktop / Tablet */}
        <div className="hidden w-full max-w-full grid-cols-1 gap-4 md:grid md:grid-cols-2 md:gap-5 xl:grid-cols-2">
          {opportunities.map(
            (
              opp,
              index
            ) => (
              <motion.div
                key={opp.id}
                className="h-full w-full min-w-0"
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay:
                    index * 0.08,
                }}
              >
                <OpportunityCard
                  opportunity={
                    opp
                  }
                  onView={setSelectedOpportunity}
                />
              </motion.div>
            )
          )}
        </div>

        {/* Mobile */}
        <div
          className="overflow-hidden md:hidden"
          ref={emblaRef}
        >
          <div className="flex gap-4">
            {opportunities.map(
              (
                opp,
                index
              ) => (
                <div
                  key={opp.id}
                  className="min-w-0 w-full flex-[0_0_100%]"
                >
                  <motion.div
                    className="h-full w-full"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        index *
                        0.08,
                    }}
                  >
                    <OpportunityCard
                      opportunity={
                        opp
                      }
                      onView={setSelectedOpportunity}
                    />
                  </motion.div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-5 flex justify-center gap-2 md:hidden">
          {opportunities.map(
            (_, idx) => (
              <button
                key={idx}
                onClick={() =>
                  emblaApi?.scrollTo(
                    idx
                  )
                }
                className={cn(
                  "h-2 rounded-full transition-all duration-300",

                  idx ===
                    selectedIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-white/15 hover:bg-white/30"
                )}
              />
            )
          )}
        </div>
      </div>

      <OpportunityDetailModal
        onClose={() => setSelectedOpportunity(null)}
        opportunity={selectedOpportunity ? {
          id: parseInt(selectedOpportunity.id),
          title: selectedOpportunity.title,
          company: selectedOpportunity.company,
          location: selectedOpportunity.location,
          salary: "Competitive",
          match: selectedOpportunity.matchScore,
          requiredSkills: selectedOpportunity.tags,
          aiRanking: selectedOpportunity.matchScore >= 90 ? "Top Match" : selectedOpportunity.matchScore >= 75 ? "High Match" : "Strong Match",
          posted: selectedOpportunity.postedAt,
        } : null}
      />
    </section>
  )
}