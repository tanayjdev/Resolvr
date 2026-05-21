'use client'

import { timelineMarkers, legendItems } from '@/lib/pathway-data'

export function BottomBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-12 glass border-t border-white/[0.06]">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Timeline */}
        <div className="flex items-center gap-1 flex-1">
          {/* Current position dot */}
          <div className="relative flex items-center justify-center mr-2">
            <div className="w-2 h-2 rounded-full bg-[#00C6FF] animate-pulse" />
            <div className="absolute w-4 h-4 rounded-full bg-[#00C6FF]/20 animate-ping" />
          </div>
          
          {/* Timeline markers */}
          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative flex-1 flex items-center">
              {/* Line */}
              <div className="absolute inset-x-0 h-[1px] bg-white/10" />
              
              {/* Markers */}
              {timelineMarkers.map((marker, i) => (
                <div 
                  key={marker.label}
                  className="relative flex flex-col items-center"
                  style={{ 
                    marginLeft: i === 0 ? 0 : 'auto',
                    flex: i === timelineMarkers.length - 1 ? 'none' : 1
                  }}
                >
                  <div 
                    className={`
                      w-1.5 h-1.5 rounded-full mb-1
                      ${i === 0 ? 'bg-[#00C6FF]' : 'bg-white/30'}
                    `}
                  />
                  <span className="text-[10px] font-mono text-white/50 whitespace-nowrap">
                    {marker.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-4">
          {legendItems.map((item) => (
            <div key={item.status} className="flex items-center gap-1.5">
              <LegendSwatch {...item} />
              <span className="text-[11px] text-white/50">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

function LegendSwatch({ 
  fill, 
  dashed 
}: { 
  status: string
  fill: boolean
  dashed: boolean 
}) {
  if (fill && !dashed) {
    // Completed or Active - filled circle
    return (
      <div className="w-2 h-2 rounded-full bg-[#00C6FF]" />
    )
  }
  
  if (!fill && dashed) {
    // Locked - dashed outline
    return (
      <svg width="8" height="8" viewBox="0 0 8 8">
        <circle 
          cx="4" 
          cy="4" 
          r="3" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="1"
          strokeDasharray="2 1"
        />
      </svg>
    )
  }
  
  // Upcoming - outlined
  return (
    <div className="w-2 h-2 rounded-full border border-white/40" />
  )
}
