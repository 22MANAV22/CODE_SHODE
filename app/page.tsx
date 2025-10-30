"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Code2, Trophy, Zap, Users } from "lucide-react"

export default function Home() {
  const [contestId, setContestId] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoinContest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contestId.trim() || !username.trim()) return

    setLoading(true)
    try {
      // Verify contest exists
      const response = await fetch(`/api/contests/${contestId}`)
      if (response.ok) {
        // Store username in sessionStorage for the contest
        sessionStorage.setItem("username", username)
        router.push(`/contest/${contestId}`)
      } else {
        alert("Contest not found")
      }
    } catch (error) {
      console.error("Error joining contest:", error)
      alert("Failed to join contest")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Shodh-a-Code</span>
          </div>
          <div className="text-sm text-muted-foreground">Online Coding Contest Platform</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Compete in Real-Time Coding Contests
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join live coding competitions, solve challenging problems, and climb the leaderboard. Execute code
                instantly with our integrated Judge0 system.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Instant Execution</h3>
                  <p className="text-sm text-muted-foreground">Real-time code compilation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Live Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Track rankings in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Compete Together</h3>
                  <p className="text-sm text-muted-foreground">Challenge other coders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Multiple Languages</h3>
                  <p className="text-sm text-muted-foreground">JavaScript, Python & more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Join Form */}
          <div>
            <Card className="p-8 border-2 border-primary/20 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Join a Contest</h2>
              <form onSubmit={handleJoinContest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contest ID</label>
                  <Input
                    placeholder="e.g., CONTEST001"
                    value={contestId}
                    onChange={(e) => setContestId(e.target.value.toUpperCase())}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Try: CONTEST001</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Username</label>
                  <Input
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !contestId.trim() || !username.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
                >
                  {loading ? "Joining..." : "Join Contest"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Demo Contest:</strong> Use ID{" "}
                  <code className="bg-card px-2 py-1 rounded text-primary font-mono">CONTEST001</code> with any username
                  to get started.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>Shodh-a-Code © 2025 | Powered by Next.js, PostgreSQL & Judge0</p>
        </div>
      </div>
    </div>
  )
}
