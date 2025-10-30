import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function executeCode(code: string, language: string, input: string) {
  const languageMap: Record<string, number> = {
    javascript: 63,
    python: 71,
    cpp: 54,
    java: 62,
  }

  const languageId = languageMap[language] || 63

  try {
    // Submit code to Judge0
    const submitResponse = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: input,
      }),
    })

    const submitData = await submitResponse.json()
    const token = submitData.token

    // Poll for result
    let result = null
    let attempts = 0
    while (attempts < 30) {
      const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      })

      result = await resultResponse.json()

      if (result.status.id > 2) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      attempts++
    }

    return {
      status: result.status.description || "Accepted",
      output: result.stdout || result.stderr || "",
      runtime: result.time ? `${(result.time * 1000).toFixed(2)}ms` : "N/A",
      memory: result.memory ? `${result.memory}KB` : "N/A",
    }
  } catch (error) {
    console.error("[v0] Judge0 error:", error)
    return {
      status: "Error",
      output: "Failed to execute code",
      runtime: "N/A",
      memory: "N/A",
    }
  }
}

async function validateCodeAgainstTestCases(code: string, language: string, problemId: string, supabase: any) {
  // Fetch all test cases for the problem
  const { data: testCases, error: testCasesError } = await supabase
    .from("test_cases")
    .select("*")
    .eq("problem_id", problemId)

  if (testCasesError) {
    console.error("[v0] Error fetching test cases:", testCasesError)
    return { passed: 0, total: 0, results: [] }
  }

  let passedCount = 0
  const results = []

  for (const testCase of testCases) {
    try {
      const executionResult = await executeCode(code, language, testCase.input)
      const passed = executionResult.output.trim() === testCase.expected_output.trim()

      if (passed) {
        passedCount++
      }

      results.push({
        testCaseId: testCase.id,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: executionResult.output,
        passed,
        isSample: testCase.is_sample,
      })
    } catch (error) {
      console.error("[v0] Test case execution error:", error)
      results.push({
        testCaseId: testCase.id,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: "Error",
        passed: false,
        isSample: testCase.is_sample,
      })
    }
  }

  return { passed: passedCount, total: testCases.length, results }
}

// POST - Submit code for execution and validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, username, code, language } = body

    if (!problemId || !username || !code || !language) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const submissionId = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        id: submissionId,
        problem_id: problemId,
        username,
        code,
        language,
        status: "Processing",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) throw insertError

    validateCodeAgainstTestCases(code, language, problemId, supabase)
      .then(async (validationResult) => {
        const score = Math.round((validationResult.passed / validationResult.total) * 100)
        const status = validationResult.passed === validationResult.total ? "Accepted" : "Partial"

        const { error: updateError } = await supabase
          .from("submissions")
          .update({
            status,
            test_cases_passed: validationResult.passed,
            total_test_cases: validationResult.total,
            score,
            output: JSON.stringify(validationResult.results),
          })
          .eq("id", submissionId)

        if (updateError) {
          console.error("[v0] Update error:", updateError)
        }

        if (status === "Accepted") {
          const { data: existingSubmission } = await supabase
            .from("submissions")
            .select("*")
            .eq("problem_id", problemId)
            .eq("username", username)
            .eq("status", "Accepted")
            .limit(1)

          if (!existingSubmission || existingSubmission.length === 0) {
            // First time solving this problem
            await supabase
              .from("users")
              .update({
                score: supabase.rpc("increment_score", { username, points: 100 }),
                problems_solved: supabase.rpc("increment_problems_solved", { username }),
              })
              .eq("username", username)
          }
        }
      })
      .catch((error) => {
        console.error("[v0] Validation error:", error)
      })

    return NextResponse.json({
      success: true,
      data: {
        submissionId: submission.id,
        status: "Processing",
        message: "Code submitted successfully. Validating...",
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// GET - Fetch submission status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const submissionId = searchParams.get("id")

    if (!submissionId) {
      return NextResponse.json({ success: false, error: "Submission ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: submission, error } = await supabase.from("submissions").select("*").eq("id", submissionId).single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: submission,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
