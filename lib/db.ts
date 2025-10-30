import { createClient } from "@/lib/supabase/server"

export async function getContest(contestId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("contests").select("*").eq("id", contestId).single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getProblems(contestId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("problems")
      .select("*")
      .eq("contest_id", contestId)
      .order("id", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getProblem(problemId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("problems").select("*").eq("id", problemId).single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function createSubmission(data: {
  problemId: string
  username: string
  code: string
  language: string
}) {
  try {
    const supabase = await createClient()
    const submissionId = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data: submission, error } = await supabase
      .from("submissions")
      .insert({
        id: submissionId,
        problem_id: data.problemId,
        username: data.username,
        code: data.code,
        language: data.language,
        status: "Processing",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return submission
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getSubmission(submissionId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("submissions").select("*").eq("id", submissionId).single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function updateSubmission(
  submissionId: string,
  data: {
    status: string
    output?: string
    runtime?: string
    memory?: string
  },
) {
  try {
    const supabase = await createClient()
    const { data: submission, error } = await supabase
      .from("submissions")
      .update({
        status: data.status,
        output: data.output || null,
        runtime: data.runtime || null,
        memory: data.memory || null,
      })
      .eq("id", submissionId)
      .select()
      .single()

    if (error) throw error
    return submission
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getLeaderboard(contestId: string) {
  try {
    const supabase = await createClient()

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        username,
        status,
        problem_id,
        created_at,
        problems(contest_id)
      `,
      )
      .eq("problems.contest_id", contestId)

    if (error) throw error

    const leaderboardMap = new Map<
      string,
      {
        username: string
        problems_solved: number
        score: number
        first_submission_time: string
      }
    >()

    submissions?.forEach((submission: any) => {
      if (submission.problems?.contest_id === contestId) {
        const existing = leaderboardMap.get(submission.username) || {
          username: submission.username,
          problems_solved: 0,
          score: 0,
          first_submission_time: submission.created_at,
        }

        if (submission.status === "Accepted") {
          existing.problems_solved += 1
          existing.score = existing.problems_solved * 100
        }

        if (new Date(submission.created_at) < new Date(existing.first_submission_time)) {
          existing.first_submission_time = submission.created_at
        }

        leaderboardMap.set(submission.username, existing)
      }
    })

    const leaderboard = Array.from(leaderboardMap.values()).sort((a, b) => {
      if (b.problems_solved !== a.problems_solved) {
        return b.problems_solved - a.problems_solved
      }
      return new Date(a.first_submission_time).getTime() - new Date(b.first_submission_time).getTime()
    })

    return leaderboard
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getUserSubmissions(username: string, contestId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        *,
        problems(contest_id)
      `,
      )
      .eq("username", username)
      .eq("problems.contest_id", contestId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}
