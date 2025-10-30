"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Play, Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react"

interface CodeEditorProps {
  problemId: string
  username: string
  sampleInput: string
  sampleOutput: string
  onSubmit: (code: string, language: string) => Promise<void>
}

const getCodeTemplate = (language: string, sampleInput: string): string => {
  const templates: Record<string, string> = {
    javascript: `// JavaScript Template
function solve(input) {
  // Parse input
  const lines = input.trim().split('\\n');
  
  // Write your solution here
  
  return result;
}

// Main execution
const input = \`${sampleInput}\`;
console.log(solve(input));`,

    python: `# Python Template
def solve(input_str):
    # Parse input
    lines = input_str.strip().split('\\n')
    
    # Write your solution here
    
    return result

# Main execution
if __name__ == "__main__":
    input_str = """${sampleInput}"""
    print(solve(input_str))`,

    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}`,

    java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Write your solution here
        
        System.out.println(solve());
    }
    
    public static String solve() {
        // Parse input
        
        // Write your solution here
        
        return "result";
    }
}`,
  }

  return templates[language] || "// Write your code here\n"
}

export function CodeEditor({ problemId, username, sampleInput, sampleOutput, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(() => getCodeTemplate("javascript", sampleInput))
  const [language, setLanguage] = useState("javascript")
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<any>(null)
  const [score, setScore] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(getCodeTemplate(newLanguage, sampleInput))
  }

  const handleResetCode = () => {
    setCode(getCodeTemplate(language, sampleInput))
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    alert("Code copied to clipboard!")
  }

  useEffect(() => {
    if (!submissionId) return

    const pollResults = async () => {
      try {
        const response = await fetch(`/api/submissions?id=${submissionId}`)
        const data = await response.json()

        if (data.success) {
          const submission = data.data
          setStatus(submission.status)
          setScore(submission.score)

          if (submission.output) {
            try {
              setValidationResults(JSON.parse(submission.output))
            } catch {
              setValidationResults(null)
            }
          }

          if (submission.status !== "Processing") {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("[v0] Error polling results:", error)
      }
    }

    const interval = setInterval(pollResults, 1000)
    return () => clearInterval(interval)
  }, [submissionId])

  const handleSubmit = async () => {
    setLoading(true)
    setShowOutput(true)
    setValidationResults(null)
    setScore(null)
    setStatus("Processing")

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          username,
          code,
          language,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSubmissionId(data.data.submissionId)
      } else {
        setStatus("Error")
        setLoading(false)
      }
    } catch (error) {
      console.error("[v0] Submission error:", error)
      setStatus("Error")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-md text-foreground font-medium"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <Button onClick={handleResetCode} variant="outline" className="gap-2 bg-transparent" title="Reset to template">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <Button
          onClick={handleCopyCode}
          variant="outline"
          className="gap-2 bg-transparent"
          title="Copy code to clipboard"
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 ml-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Submit Code
            </>
          )}
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="font-mono text-sm bg-input border-border min-h-96 resize-none"
        />
      </Card>

      {showOutput && (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Validation Results</h3>
            <div className="flex items-center gap-2">
              {status === "Accepted" && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">All Tests Passed!</span>
                </>
              )}
              {status === "Partial" && (
                <>
                  <XCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">Some Tests Failed</span>
                </>
              )}
              {status === "Processing" && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-blue-500 font-semibold">Processing...</span>
                </>
              )}
              {status === "Error" && (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-semibold">Error</span>
                </>
              )}
            </div>
          </div>

          {score !== null && (
            <div className="mb-4 p-3 bg-input rounded-lg">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-primary">{score}%</p>
            </div>
          )}

          {validationResults && (
            <div className="space-y-3">
              {validationResults.map((result: any, idx: number) => (
                <div key={idx} className="p-3 bg-input rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-semibold text-foreground">
                      Test Case {idx + 1} {result.isSample ? "(Sample)" : ""}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Input:</p>
                      <p className="text-foreground font-mono">{result.input}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected:</p>
                      <p className="text-foreground font-mono">{result.expected}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Got:</p>
                      <p className={`font-mono ${result.passed ? "text-green-500" : "text-red-500"}`}>
                        {result.actual}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-2">Sample Input</h3>
          <pre className="bg-input p-3 rounded text-sm text-foreground overflow-auto max-h-32">{sampleInput}</pre>
        </Card>
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-2">Expected Output</h3>
          <pre className="bg-input p-3 rounded text-sm text-foreground overflow-auto max-h-32">{sampleOutput}</pre>
        </Card>
      </div>
    </div>
  )
}
