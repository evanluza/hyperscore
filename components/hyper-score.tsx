"use client";

interface HyperScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function HyperScore({ score, size = "md", showLabel = true }: HyperScoreProps) {
  const dims = { sm: 48, md: 72, lg: 96 };
  const textSize = { sm: "text-sm", md: "text-xl", lg: "text-3xl" };
  const labelSize = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };
  const d = dims[size];
  const radius = (d - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 80 ? "#97fce4" : score >= 60 ? "#f5b041" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: d, height: d }}>
        <svg width={d} height={d} className="-rotate-90">
          <circle
            cx={d / 2}
            cy={d / 2}
            r={radius}
            fill="none"
            stroke="rgba(26, 31, 44, 0.6)"
            strokeWidth={3}
          />
          <circle
            cx={d / 2}
            cy={d / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-bold ${textSize[size]}`} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`${labelSize[size]} text-muted uppercase tracking-widest`}>
          HyperScore
        </span>
      )}
    </div>
  );
}
