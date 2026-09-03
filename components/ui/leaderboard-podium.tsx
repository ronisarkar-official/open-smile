"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Crown, Sparkles, Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { DEFAULT_AVATAR_URL } from "@/components/ui/avatar"

// Types (inlined)
interface LeaderboardRanking {
  userId: string
  userName: string | null
  rank: number
  value: number
  avatarUrl?: string | null
}

// Variants
const podiumVariants = cva(
  "flex w-full items-end justify-center transition-all duration-300",
  {
    variants: {
      size: {
        sm: "gap-2 sm:gap-4 md:gap-6",
        default: "gap-3 sm:gap-6 md:gap-8 lg:gap-10",
        lg: "gap-4 sm:gap-8 md:gap-12 lg:gap-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Podium styles for each position
const PODIUM_CONFIG = {
  1: {
    icon: Crown,
    color: "text-rank-1",
    bg: "bg-rank-1/25 dark:bg-rank-1/20 border-rank-1/60",
    pillBg: "bg-rank-1 text-black font-extrabold shadow-sm",
    ringColor: "ring-rank-1/60",
    gradient: "from-rank-1/30 to-rank-1/10",
    heightClasses: {
      sm: "h-24 sm:h-32 md:h-36",
      default: "h-32 sm:h-44 md:h-56 lg:h-64",
      lg: "h-40 sm:h-52 md:h-64 lg:h-72",
    },
  },
  2: {
    icon: Trophy,
    color: "text-rank-2",
    bg: "bg-rank-2/20 dark:bg-rank-2/15 border-rank-2/50",
    pillBg: "bg-rank-2 text-foreground font-bold shadow-sm",
    ringColor: "ring-rank-2/50",
    gradient: "from-rank-2/25 to-rank-2/5",
    heightClasses: {
      sm: "h-20 sm:h-24 md:h-28",
      default: "h-24 sm:h-32 md:h-40 lg:h-48",
      lg: "h-32 sm:h-40 md:h-48 lg:h-56",
    },
  },
  3: {
    icon: Trophy,
    color: "text-rank-3",
    bg: "bg-rank-3/20 dark:bg-rank-3/15 border-rank-3/50",
    pillBg: "bg-rank-3 text-foreground font-bold shadow-sm",
    ringColor: "ring-rank-3/50",
    gradient: "from-rank-3/25 to-rank-3/5",
    heightClasses: {
      sm: "h-16 sm:h-20 md:h-24",
      default: "h-20 sm:h-24 md:h-32 lg:h-36",
      lg: "h-28 sm:h-32 md:h-36 lg:h-44",
    },
  },
} as const

// Props
interface LeaderboardPodiumProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof podiumVariants> {
  rankings: LeaderboardRanking[]
  showValue?: boolean
  showAvatar?: boolean
  medalStyle?: "classic" | "modern" | "minimal"
  unit?: string
}

const LeaderboardPodium = React.forwardRef<
  HTMLDivElement,
  LeaderboardPodiumProps
>(
  (
    {
      className,
      size = "default",
      rankings,
      showValue = true,
      showAvatar = true,
      medalStyle = "classic",
      unit = "pts",
      ...props
    },
    ref
  ) => {
    const activeSize = size ?? "default"

    // Get top 3, reorder for podium display: 2nd, 1st, 3rd
    const top3 = rankings.slice(0, 3)
    const podiumOrder = [
      top3.find((r) => r.rank === 2),
      top3.find((r) => r.rank === 1),
      top3.find((r) => r.rank === 3),
    ].filter(Boolean) as LeaderboardRanking[]

    if (podiumOrder.length === 0) {
      return null
    }

    const avatarSize = {
      sm: "size-10 sm:size-12 md:size-14 text-xs sm:text-sm",
      default: "size-12 sm:size-16 md:size-20 lg:size-24 text-sm sm:text-lg lg:text-xl",
      lg: "size-16 sm:size-20 md:size-24 lg:size-28 text-lg sm:text-xl lg:text-2xl",
    }[activeSize]

    const crownBadgeSize = {
      sm: "size-5 sm:size-6 text-xs",
      default: "size-6 sm:size-8 md:size-9",
      lg: "size-8 sm:size-10 md:size-11",
    }[activeSize]

    const crownIconSize = {
      sm: "size-3 sm:size-3.5",
      default: "size-3.5 sm:size-4 md:size-5",
      lg: "size-4 sm:size-5 md:size-6",
    }[activeSize]

    const colWidth = {
      sm: "w-20 sm:w-28 md:w-36 max-w-xs",
      default: "w-24 sm:w-36 md:w-48 lg:w-56 max-w-xs",
      lg: "w-28 sm:w-44 md:w-56 lg:w-64 max-w-sm",
    }[activeSize]

    const nameMaxWidth = {
      sm: "max-w-[80px] sm:max-w-[120px] md:max-w-[150px]",
      default: "max-w-[90px] sm:max-w-[150px] md:max-w-[190px] lg:max-w-[220px]",
      lg: "max-w-[110px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px]",
    }[activeSize]

    const textSize = {
      sm: "text-xs sm:text-sm",
      default: "text-xs sm:text-sm md:text-base font-semibold",
      lg: "text-sm sm:text-base md:text-lg font-bold",
    }[activeSize]

    const valueSize = {
      sm: "text-[11px] sm:text-xs",
      default: "text-xs sm:text-sm md:text-base",
      lg: "text-sm sm:text-base md:text-lg",
    }[activeSize]

    const rankNumberSize = {
      sm: "text-sm sm:text-base",
      default: "text-base sm:text-xl md:text-2xl lg:text-3xl",
      lg: "text-lg sm:text-2xl md:text-3xl lg:text-4xl",
    }[activeSize]

    return (
      <div
        ref={ref}
        className={cn(podiumVariants({ size }), className)}
        role="list"
        aria-label="Top 3 rankings"
        {...props}
      >
        {podiumOrder.map((ranking) => {
          const config = PODIUM_CONFIG[ranking.rank as 1 | 2 | 3]
          if (!config) return null

          const displayName =
            ranking.userName || `User ${ranking.userId.slice(0, 6)}`
          const avatarSrc =
            ranking.avatarUrl || DEFAULT_AVATAR_URL
          const podiumHeight = config.heightClasses[activeSize]

          const itemLabel = `Rank ${ranking.rank}: ${displayName}${showValue ? `, ${ranking.value.toLocaleString()}` : ""}`

          const isFirstPlace = ranking.rank === 1

          return (
            <div
              key={ranking.userId}
              role="listitem"
              aria-label={itemLabel}
              className={cn(
                "group flex flex-1 flex-col items-center transition-transform duration-200 hover:-translate-y-1",
                colWidth
              )}
            >
              {/* Avatar with crown */}
              <div className="relative mb-2 sm:mb-3 flex items-center justify-center" aria-hidden="true">
                {showAvatar ? (
                  <div className="relative">
                    <img
                      src={avatarSrc}
                      alt={`${displayName} avatar`}
                      className={cn(
                        "rounded-full border-2 border-border/80 object-cover shadow-sm transition-all duration-200 group-hover:scale-105",
                        isFirstPlace && "border-rank-1 ring-2 sm:ring-4 ring-rank-1/30",
                        avatarSize
                      )}
                    />
                    {isFirstPlace && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center text-rank-1 animate-bounce">
                        <Sparkles className="size-3.5 sm:size-4.5" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full border-2 border-border",
                      avatarSize,
                      config.bg
                    )}
                  >
                    <config.icon className={cn("size-1/2", config.color)} />
                  </div>
                )}

                {/* Crown / Trophy badge */}
                {medalStyle !== "minimal" && (
                  <div
                    className={cn(
                      "bg-background absolute -right-1 -bottom-1 flex items-center justify-center rounded-full border border-border shadow-md transition-transform duration-200 group-hover:scale-110",
                      crownBadgeSize,
                      isFirstPlace && "bg-rank-1 text-black border-rank-1"
                    )}
                  >
                    <config.icon
                      className={cn(
                        isFirstPlace ? "text-black" : config.color,
                        crownIconSize
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <span
                className={cn(
                  "w-full truncate text-center tracking-tight transition-colors group-hover:text-primary",
                  nameMaxWidth,
                  textSize
                )}
                title={displayName}
              >
                {displayName}
              </span>

              {/* Value */}
              {showValue && (
                <div className="flex items-baseline gap-0.5 mt-0.5 sm:mt-1">
                  <span
                    className={cn(
                      "font-mono font-bold tracking-tight text-foreground tabular-nums",
                      valueSize
                    )}
                  >
                    {ranking.value.toLocaleString()}
                  </span>
                  {unit && (
                    <span className="text-muted-foreground font-mono text-[9px] sm:text-[11px] font-bold uppercase">
                      {unit}
                    </span>
                  )}
                </div>
              )}

              {/* Podium block */}
              <div
                aria-hidden="true"
                className={cn(
                  "relative mt-2 sm:mt-3 w-full rounded-t-xl sm:rounded-t-2xl border-t-2 border-x-2 bg-gradient-to-b shadow-sm transition-all duration-300",
                  podiumHeight,
                  config.bg,
                  config.gradient,
                  medalStyle === "modern" && "rounded-t-2xl sm:rounded-t-3xl shadow-md"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 sm:h-12 md:h-14 items-center justify-center font-mono font-black",
                    config.color,
                    rankNumberSize
                  )}
                >
                  <span className="relative">
                    #{ranking.rank}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
LeaderboardPodium.displayName = "LeaderboardPodium"

export { LeaderboardPodium, podiumVariants }
export type { LeaderboardPodiumProps, LeaderboardRanking }
