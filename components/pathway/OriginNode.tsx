export function OriginNode() {
    return (
      <>
        <circle
          cx="180"
          cy="300"
          r="55"
          fill="rgba(0,198,255,0.025)"
        />
  
        <circle
          cx="180"
          cy="300"
          r="38"
          fill="none"
          stroke="rgba(0,198,255,0.08)"
          strokeWidth="0.5"
        />
  
        <circle
          cx="180"
          cy="300"
          r="28"
          fill="none"
          stroke="rgba(0,198,255,0.25)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
  
        <circle
          cx="180"
          cy="300"
          r="16"
          fill="#00C6FF"
          style={{
            filter:
              "drop-shadow(0 0 28px rgba(0,198,255,0.5))",
          }}
        />
  
        <circle
          cx="180"
          cy="300"
          r="5"
          fill="white"
          opacity="0.85"
        />
  
        <text
          x="180"
          y="350"
          textAnchor="middle"
          className="fill-white font-[var(--font-syne)] text-[14px] font-bold"
        >
          You
        </text>
  
        <text
          x="180"
          y="370"
          textAnchor="middle"
          className="fill-white/35 text-[11px]"
        >
          Current Position
        </text>
      </>
    )
  }