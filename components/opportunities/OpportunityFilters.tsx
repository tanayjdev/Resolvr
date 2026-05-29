"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Filter,
  X,
  ChevronDown,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Star,
} from "lucide-react"

import { Drawer, useDrawer } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OpportunityFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  currentFilters: any
}

export function OpportunityFilters({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: OpportunityFiltersProps) {
  const [matchPercentage, setMatchPercentage] = React.useState<number | null>(currentFilters.matchPercentage)
  const [workType, setWorkType] = React.useState<string | null>(currentFilters.workType)
  const [location, setLocation] = React.useState<string>(currentFilters.location || "")
  const [topMatchesOnly, setTopMatchesOnly] = React.useState<boolean>(currentFilters.topMatchesOnly)
  const [searchQuery, setSearchQuery] = React.useState<string>(currentFilters.searchQuery || "")

  const handleApply = () => {
    onApplyFilters({
      matchPercentage,
      workType,
      location,
      topMatchesOnly,
      searchQuery,
    })
    onClose()
  }

  const handleReset = () => {
    setMatchPercentage(null)
    setWorkType(null)
    setLocation("")
    setTopMatchesOnly(false)
    setSearchQuery("")
  }

  const hasActiveFilters =
    matchPercentage !== null ||
    workType !== null ||
    location !== "" ||
    topMatchesOnly ||
    searchQuery !== ""

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-syne)] text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Match Percentage */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Star className="h-4 w-4" />
            Minimum Match Percentage
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={matchPercentage || 0}
            onChange={(e) => setMatchPercentage(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span className="font-semibold text-primary">{matchPercentage || 0}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Work Type */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Work Type
          </label>
          <div className="space-y-2">
            {["Remote", "Hybrid", "Onsite"].map((type) => (
              <button
                key={type}
                onClick={() => setWorkType(workType === type ? null : type)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-colors",
                  workType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Top Matches Only */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Top Matches Only (85%+)
          </label>
          <button
            onClick={() => setTopMatchesOnly(!topMatchesOnly)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              topMatchesOnly ? "bg-primary" : "bg-white/10"
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                topMatchesOnly ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
