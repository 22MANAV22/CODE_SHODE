"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  problems_solved: number
  score: number
}

interface LeaderboardProps {
  contestId: string
}

export function Leaderboard({ contestId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState({ total_participants: 0, average_score: 0, top_score: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/contests/${contestId}/leaderboard`)
        const data = await response.json()
        if (data.success) {
          setLeaderboard(data.data.leaderboard)
          setStats(data.data.stats)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 15000) // Refresh every 15 seconds
    return () => clearInterval(interval)
  }, [contestId])

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading leaderboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground">Total Participants</p>
          <p className="text-2xl font-bold text-foreground">{stats.total_participants}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground">Average Score</p>
          <p className="text-2xl font-bold text-foreground">{stats.average_score}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground">Top Score</p>
          <p className="text-2xl font-bold text-primary">{stats.top_score}</p>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Problems Solved</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {entry.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                      {entry.rank === 3 && <Medal className="w-5 h-5 text-orange-600" />}
                      <span className="font-semibold text-foreground">#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{entry.username}</td>
                  <td className="px-6 py-4 text-foreground">{entry.problems_solved}</td>
                  <td className="px-6 py-4 text-primary font-bold">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
