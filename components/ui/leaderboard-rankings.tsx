"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
}

export interface LeaderboardRankingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRankingItem[]
  currentUserId?: string
  showPagination?: boolean
  defaultPageSize?: number
}

const fallbackAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
]

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export const LeaderboardRankings = React.forwardRef<HTMLDivElement, LeaderboardRankingsProps>(
  (
    {
      className,
      rankings = [],
      currentUserId,
      showPagination = false,
      defaultPageSize = 10,
      ...props
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = React.useState(1)

    const visibleRankings = React.useMemo(() => {
      return rankings.filter((item) => item.displayed !== false)
    }, [rankings])

    const totalPages = Math.max(1, Math.ceil(visibleRankings.length / defaultPageSize))

    const pagedItems = React.useMemo(() => {
      if (!showPagination) return visibleRankings
      const start = (currentPage - 1) * defaultPageSize
      return visibleRankings.slice(start, start + defaultPageSize)
    }, [visibleRankings, showPagination, currentPage, defaultPageSize])

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-5">
            <span className="w-7 text-center font-mono">#</span>
            <span>Participant</span>
            <span className="hidden font-mono sm:block">Trend</span>
            <span className="text-right font-mono">Score</span>
          </div>

          <div className="divide-y divide-border/60">
            {pagedItems.map((item, index) => {
              const isCurrent =
                item.isCurrentUser ||
                (currentUserId && item.userId === currentUserId) ||
                item.userName.toLowerCase() === "you"

              const avatar =
                item.avatarUrl ||
                fallbackAvatars[(item.rank - 1) % fallbackAvatars.length]

              const formattedValue =
                typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value

              const change = item.change ?? 0

              return (
                <div
                  key={item.userId || index}
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

                  <div className="text-right font-mono font-bold tracking-tight">
                    <span>{formattedValue}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <div>
              Page {currentPage} of {totalPages} ({visibleRankings.length} total)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous Page</span>
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next Page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

LeaderboardRankings.displayName = "LeaderboardRankings"
