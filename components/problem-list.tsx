"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface Problem {
  id: string
  title: string
  difficulty: string
  description: string
}

interface ProblemListProps {
  problems: Problem[]
  selectedProblemId?: string
  onSelectProblem: (problemId: string) => void
}

export function ProblemList({ problems, selectedProblemId, onSelectProblem }: ProblemListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-2">
      {problems.map((problem) => (
        <Card
          key={problem.id}
          onClick={() => onSelectProblem(problem.id)}
          className={`p-4 cursor-pointer transition-all border-2 hover:shadow-md ${
            selectedProblemId === problem.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{problem.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{problem.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
              <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
