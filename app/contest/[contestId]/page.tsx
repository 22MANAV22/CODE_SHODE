"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CodeEditor } from "@/components/code-editor"
import { Leaderboard } from "@/components/leaderboard"
import { ProblemList } from "@/components/problem-list"
import { Code2, Trophy, BookOpen } from "lucide-react"

interface Contest {
  id: string
  title: string
  description: string
  problems: Problem[]
}

interface Problem {
  id: string
  title: string
  difficulty: string
  description: string
  sample_input: string
  sample_output: string
}

export default function ContestPage() {
  const params = useParams()
  const contestId = params.contestId as string
  const [contest, setContest] = useState<Contest | null>(null)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState("problems")

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    const fetchContest = async () => {
      try {
        const response = await fetch(`/api/contests/${contestId}`)
        const data = await response.json()
        if (data.success) {
          setContest(data.data)
          if (data.data.problems.length > 0) {
            setSelectedProblem(data.data.problems[0])
          }
        }
      } catch (error) {
        console.error("Error fetching contest:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContest()
  }, [contestId])

  const handleSubmitCode = async (code: string, language: string) => {
    if (!selectedProblem) return

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          username,
          code,
          language,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Code submitted successfully!")
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to submit code")
    }
  }

  const handleSelectProblem = (id: string) => {
    const problem = contest?.problems.find((p) => p.id === id)
    if (problem) {
      setSelectedProblem(problem)
      setActiveTab("editor") // Automatically switch to editor tab
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-foreground">Loading contest...</p>
        </div>
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 border-border">
          <p className="text-foreground">Contest not found</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{contest.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Logged in as: <span className="font-semibold text-foreground">{username}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Contest ID</p>
              <p className="text-lg font-mono font-bold text-primary">{contestId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="problems" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Problems
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2">
              <Code2 className="w-4 h-4" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-foreground mb-4">Problems</h2>
                <ProblemList
                  problems={contest.problems}
                  selectedProblemId={selectedProblem?.id}
                  onSelectProblem={handleSelectProblem}
                />
              </div>

              <div className="md:col-span-2">
                {selectedProblem && (
                  <Card className="p-6 border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedProblem.title}</h2>
                    <p className="text-muted-foreground mb-6">{selectedProblem.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Sample Input</h3>
                        <pre className="bg-input p-3 rounded text-sm text-foreground overflow-auto">
                          {selectedProblem.sample_input}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Sample Output</h3>
                        <pre className="bg-input p-3 rounded text-sm text-foreground overflow-auto">
                          {selectedProblem.sample_output}
                        </pre>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            {selectedProblem ? (
              <CodeEditor
                problemId={selectedProblem.id}
                username={username}
                sampleInput={selectedProblem.sample_input}
                sampleOutput={selectedProblem.sample_output}
                onSubmit={handleSubmitCode}
              />
            ) : (
              <Card className="p-8 text-center border-border">
                <p className="text-foreground">Select a problem to start coding</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard contestId={contestId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
