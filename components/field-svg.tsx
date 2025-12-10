export function FieldSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 50"
    >
      <defs>
        <pattern id="field-lines" x="0" y="0" width="100%" height="100%" patternUnits="objectBoundingBox">
          {Array.from({ length: 33 }).map((_, i) => {
            const x = (i / 33) * 100
            const width = (1 / 33) * 100
            const isEven = i % 2 === 0
            return (
              <rect
                key={`stripe-${i}`}
                x={`${x}%`}
                y="0"
                width={`${width}%`}
                height="100%"
                fill={isEven ? "rgba(0,100,0,0.15)" : "rgba(0,150,0,0.15)"}
              />
            )
          })}

          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3%" />
          <circle cx="50%" cy="50%" r="13.5%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />
          <circle cx="50%" cy="50%" r="0.8%" fill="rgba(255,255,255,0.6)" />

          <rect x="-1" y="15%" width="20%" height="70%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />
          <rect x="-1%" y="30%" width="8%" height="40%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />

          <svg width="100%" height="100%">
            <clipPath id="cut">
              <rect x="19%" y="0" width="50%" height="100%" />
            </clipPath>
            <circle cx="15.7%" cy="50%" r="8%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" clipPath="url(#cut)" />
          </svg>

          <circle cx="12.2" cy="25" r="0.5%" fill="rgba(255,255,255,0.6)" />

          <rect x="81%" y="15%" width="20%" height="70%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />
          <rect x="93%" y="30%" width="8%" height="40%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />

          <svg width="100%" height="100%">
            <clipPath id="rightArc">
              <rect x="61%" y="0" width="20%" height="100%" />
            </clipPath>
            <circle cx="84.3%" cy="50%" r="8%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" clipPath="url(#rightArc)" />
          </svg>

          <circle cx="87.8" cy="25" r="0.5%" fill="rgba(255,255,255,0.6)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#field-lines)" />
    </svg>
  )
}
