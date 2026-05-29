'use client'

import { filterOptions } from '@/lib/pathway-data'

interface TopBarProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export function TopBar({ activeFilter, setActiveFilter }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-white/[0.06]">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left - Title */}
        <div className="flex flex-col justify-center">
          <h1 className="text-white text-lg font-[var(--font-syne)] font-bold leading-tight">
            Your Future Map
          </h1>
          <p className="text-[11px] text-white/40 leading-tight">
            AI-generated pathway intelligence
          </p>
        </div>

        {/* Center - Filter Pills */}
        <div className="hidden md:flex items-center gap-2">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-3 py-1.5 rounded-full text-[12px] font-medium
                  transition-all duration-200 ease-out
                  border
                  ${isActive 
                    ? 'bg-[rgba(0,198,255,0.12)] border-[#00C6FF]/40 text-[#00C6FF]' 
                    : 'bg-white/[0.05] border-white/10 text-white/60 hover:border-white/20 hover:bg-white/[0.08]'
                  }
                `}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        {/* Right - Back link */}
        <a 
          href="/dashboard" 
          className="text-[12px] text-white/40 hover:text-white/70 transition-colors hidden sm:block"
        >
          ← Back to Dashboard
        </a>
      </div>
    </header>
  )
}
