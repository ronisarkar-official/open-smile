"use client"

import * as React from "react"
import { LeaderboardCard } from "@/components/ui/leaderboard-card"
import type { LeaderboardRanking as LeaderboardPodiumRanking } from "@/components/ui/leaderboard-podium"
import type { LeaderboardRankingItem } from "@/components/ui/leaderboard-rankings"

interface PeriodData {
  title: string
  fromDate: string
  toDate: string
  podium: LeaderboardPodiumRanking[]
  rankings: LeaderboardRankingItem[]
}

const leaderboardData: Record<string, PeriodData> = {
  weekly: {
    title: "Weekly Smile Challenge",
    fromDate: "2026-08-24",
    toDate: "2026-08-30",
    podium: [
      {
        userId: "u-1",
        userName: "Marcus Webb",
        rank: 1,
        value: 289400,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-2",
        userName: "Aria Chen",
        rank: 2,
        value: 251800,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-3",
        userName: "Priya Sharma",
        rank: 3,
        value: 238300,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    rankings: [
      {
        userId: "u-1",
        rank: 1,
        userName: "Marcus Webb",
        byline: "Level 42 – Diamond",
        value: 289400,
        change: 2,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-2",
        rank: 2,
        userName: "Aria Chen",
        byline: "Level 39 – Platinum",
        value: 251800,
        change: 1,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-3",
        rank: 3,
        userName: "Priya Sharma",
        byline: "Level 35 – Gold",
        value: 238300,
        change: -1,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-4",
        rank: 4,
        userName: "Kai Nakamura",
        byline: "Level 31 – Silver",
        value: 198700,
        change: 3,
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-5",
        rank: 5,
        userName: "Elena Rodriguez",
        byline: "Level 30 – Silver",
        value: 184200,
        change: 0,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-6",
        rank: 6,
        userName: "Jasper Liu",
        byline: "Level 29 – Silver",
        value: 172100,
        change: -2,
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-7",
        rank: 7,
        userName: "Zara Okonkwo",
        byline: "Level 28 – Bronze",
        value: 161400,
        change: 1,
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        displayed: true,
      },
      {
        userId: "u-current",
        rank: 8,
        userName: "You",
        byline: "Level 27 – Bronze",
        value: 156200,
        change: 4,
        isCurrentUser: true,
        displayed: true,
      },
      {
        userId: "u-9",
        rank: 9,
        userName: "Leo Petrov",
        byline: "Level 25 – Bronze",
        value: 142800,
        change: -1,
        displayed: true,
      },
      {
        userId: "u-10",
        rank: 10,
        userName: "Mia Tanaka",
        byline: "Level 22 – Bronze",
        value: 128900,
        change: 0,
        displayed: true,
      },
    ],
  },
  daily: {
    title: "Daily Smile Sprint",
    fromDate: "2026-08-29",
    toDate: "2026-08-29",
    podium: [
      {
        userId: "u-2",
        userName: "Aria Chen",
        rank: 1,
        value: 42300,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-1",
        userName: "Marcus Webb",
        rank: 2,
        value: 39100,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-4",
        userName: "Kai Nakamura",
        rank: 3,
        value: 34500,
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
    ],
    rankings: [
      {
        userId: "u-2",
        rank: 1,
        userName: "Aria Chen",
        byline: "Daily Leader",
        value: 42300,
        change: 1,
        displayed: true,
      },
      {
        userId: "u-1",
        rank: 2,
        userName: "Marcus Webb",
        byline: "Daily Runner Up",
        value: 39100,
        change: -1,
        displayed: true,
      },
      {
        userId: "u-4",
        rank: 3,
        userName: "Kai Nakamura",
        byline: "Top Contender",
        value: 34500,
        change: 2,
        displayed: true,
      },
      {
        userId: "u-current",
        rank: 4,
        userName: "You",
        byline: "Active Smiler",
        value: 28400,
        change: 3,
        isCurrentUser: true,
        displayed: true,
      },
    ],
  },
  monthly: {
    title: "Monthly Hall of Fame",
    fromDate: "2026-08-01",
    toDate: "2026-08-31",
    podium: [
      {
        userId: "u-1",
        userName: "Marcus Webb",
        rank: 1,
        value: 1240000,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-2",
        userName: "Aria Chen",
        rank: 2,
        value: 1180000,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        userId: "u-3",
        userName: "Priya Sharma",
        rank: 3,
        value: 994000,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    rankings: [
      {
        userId: "u-1",
        rank: 1,
        userName: "Marcus Webb",
        byline: "Monthly Champion",
        value: 1240000,
        change: 0,
        displayed: true,
      },
      {
        userId: "u-2",
        rank: 2,
        userName: "Aria Chen",
        byline: "Monthly Finalist",
        value: 1180000,
        change: 0,
        displayed: true,
      },
      {
        userId: "u-3",
        rank: 3,
        userName: "Priya Sharma",
        byline: "Monthly Contender",
        value: 994000,
        change: 1,
        displayed: true,
      },
      {
        userId: "u-current",
        rank: 6,
        userName: "You",
        byline: "Steady Riser",
        value: 720000,
        change: 2,
        isCurrentUser: true,
        displayed: true,
      },
    ],
  },
}

const runOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
]

export function LeaderboardView() {
  const [selectedRunId, setSelectedRunId] = React.useState("weekly")
  const currentData = leaderboardData[selectedRunId] ?? leaderboardData.weekly

  return (
    <LeaderboardCard
      title={currentData.title}
      fromDate={currentData.fromDate}
      toDate={currentData.toDate}
      currentUserId="u-current"
      podiumRankings={currentData.podium}
      rankings={currentData.rankings}
      runOptions={runOptions}
      selectedRunId={selectedRunId}
      onRunChange={setSelectedRunId}
    />
  )
}
