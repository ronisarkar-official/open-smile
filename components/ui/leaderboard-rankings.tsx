"use client"

import * as React from "react"
import Link from "next/link"
import { Camera, Flame, TrendingUp, TrendingDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from "@/components/ui/avatar"

export interface LeaderboardRankingItem {
  userId: string
  rank: number
  userName: string
  byline?: string
  value: number | string
  displayed?: boolean
  avatarUrl?: string
  change?: number
  isCurrentUser?: boolean
  pointsToOvertake?: number
  targetUserName?: string
  targetRank?: number
}

export interface LeaderboardRankingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRankingItem[]
  currentUserId?: string
  currentUserRanking?: LeaderboardRankingItem | null
  unit?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function RankingRow({
  item,
  isCurrent,
  unit,
}: {
  item: LeaderboardRankingItem
  isCurrent: boolean
  unit: string
}) {
  const avatar = item.avatarUrl || DEFAULT_AVATAR_URL
  const formattedValue =
    typeof item.value === "number"
      ? `${item.value.toLocaleString()} ${unit}`
      : item.value
  const change = item.change ?? 0

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-sm transition-colors sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-5",
        isCurrent
          ? "bg-primary/10 font-medium"
          : "hover:bg-muted/40"
      )}
    >
      <div className="flex w-7 items-center justify-center">
        <span
          className={cn(
            "font-mono text-xs font-bold",
            item.rank <= 3
              ? "rounded-full bg-primary/20 px-1.5 py-0.5 text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.rank}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-8 shrink-0 border border-border">
          <AvatarImage src={avatar} alt={item.userName} className="object-cover" />
          <AvatarFallback className="text-xs font-semibold">
            {getInitials(item.userName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold">{item.userName}</span>
            {isCurrent && (
              <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                You
              </span>
            )}
          </div>
          {item.byline && (
            <p className="text-muted-foreground truncate text-xs">
              {item.byline}
            </p>
          )}
          {isCurrent && item.pointsToOvertake ? (
            <div className="mt-1 inline-flex items-center gap-1 bg-primary/20 border border-black/15 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
              <Flame className="size-2.5 text-primary shrink-0" />
              <span>
                Only <strong>{item.pointsToOvertake} pts</strong> behind #{item.targetRank} ({item.targetUserName})
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden items-center gap-1 font-mono text-xs sm:flex">
        {change > 0 ? (
          <span className="flex items-center text-success font-semibold">
            <TrendingUp className="mr-0.5 size-3.5" />
            +{change}
          </span>
        ) : change < 0 ? (
          <span className="flex items-center text-destructive font-semibold">
            <TrendingDown className="mr-0.5 size-3.5" />
            {change}
          </span>
        ) : (
          <span className="flex items-center text-muted-foreground">
            <Minus className="mr-0.5 size-3.5" />
            0
          </span>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="text-right font-mono font-bold tracking-tight">
          <span>{formattedValue}</span>
        </div>
        {isCurrent ? (
          <Link
            href="/capture"
            className="inline-flex items-center gap-1 border border-black rounded bg-primary px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs hover:bg-primary/90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <Camera className="size-2.5" />
            Smile & Overtake
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export const LeaderboardRankings = React.forwardRef<HTMLDivElement, LeaderboardRankingsProps>(
  (
    {
      className,
      rankings = [],
      currentUserId,
      currentUserRanking,
      unit = "pts",
      ...props
    },
    ref
  ) => {
    const visibleRankings = React.useMemo(() => {
      return rankings.filter((item) => item.displayed !== false)
    }, [rankings])

    const top10 = React.useMemo(() => {
      return visibleRankings.slice(0, 10)
    }, [visibleRankings])

    const isUserInTop10 = React.useMemo(() => {
      return top10.some(
        (item) =>
          item.isCurrentUser ||
          (currentUserId && item.userId === currentUserId) ||
          item.userName.toLowerCase() === "you"
      )
    }, [top10, currentUserId])

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-5">
            <span className="w-7 text-center font-mono">#</span>
            <span>Participant</span>
            <span className="hidden font-mono sm:block">Trend</span>
            <span className="text-right font-mono">Points</span>
          </div>

          <div className="divide-y divide-border/60">
            {top10.map((item, index) => {
              const isCurrent =
                item.isCurrentUser ||
                (currentUserId && item.userId === currentUserId) ||
                item.userName.toLowerCase() === "you"

              return (
                <RankingRow
                  key={item.userId || index}
                  item={item}
                  isCurrent={Boolean(isCurrent)}
                  unit={unit}
                />
              )
            })}

            {!isUserInTop10 && currentUserRanking && (
              <>
                <div className="flex items-center justify-center gap-1.5 py-2.5 bg-muted/30 border-t border-dashed border-border/80 text-muted-foreground font-mono text-xs">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
                <RankingRow
                  key={currentUserRanking.userId}
                  item={currentUserRanking}
                  isCurrent={true}
                  unit={unit}
                />
              </>
            )}

            {!isUserInTop10 && !currentUserRanking && currentUserId && (
              <>
                <div className="flex items-center justify-center gap-1.5 py-2.5 bg-muted/30 border-t border-dashed border-border/80 text-muted-foreground font-mono text-xs">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-sm bg-muted/20 border-t border-border/60 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-5">
                  <div className="flex w-7 items-center justify-center">
                    <span className="font-mono text-xs font-bold text-muted-foreground">—</span>
                  </div>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-8 shrink-0 border border-border">
                      <AvatarImage src={DEFAULT_AVATAR_URL} alt="You" className="object-cover" />
                      <AvatarFallback className="text-xs font-semibold">ME</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">You</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground">
                          Unranked
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        Capture a smile to join today&apos;s rankings!
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-1 font-mono text-xs sm:flex text-muted-foreground">
                    <Minus className="mr-0.5 size-3.5" /> 0
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono font-bold tracking-tight text-muted-foreground">0 {unit}</span>
                    <Link
                      href="/capture"
                      className="inline-flex items-center gap-1 border border-black rounded bg-primary px-2.5 py-1 font-mono text-xs font-black uppercase text-black shadow-brutal-xs hover:bg-primary/90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Camera className="size-3" />
                      Smile Now
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
)

LeaderboardRankings.displayName = "LeaderboardRankings"
