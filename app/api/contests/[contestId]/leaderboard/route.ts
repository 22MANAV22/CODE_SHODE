import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
  try {
    const { contestId } = await params
    const supabase = await createClient()

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        username,
        status,
        problem_id,
        score,
        test_cases_passed,
        total_test_cases,
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
        total_score: number
        first_submission_time: string
        submissions_count: number
      }
    >()

    submissions?.forEach((submission: any) => {
      if (submission.problems?.contest_id === contestId) {
        const existing = leaderboardMap.get(submission.username) || {
          username: submission.username,
          problems_solved: 0,
          total_score: 0,
          first_submission_time: submission.created_at,
          submissions_count: 0,
        }

        if (submission.status === "Accepted") {
          existing.problems_solved += 1
          existing.total_score += submission.score || 100
        } else if (submission.status === "Partial") {
          existing.total_score += submission.score || 0
        }

        existing.submissions_count += 1

        if (new Date(submission.created_at) < new Date(existing.first_submission_time)) {
          existing.first_submission_time = submission.created_at
        }

        leaderboardMap.set(submission.username, existing)
      }
    })

    const leaderboard = Array.from(leaderboardMap.values())
      .sort((a, b) => {
        if (b.total_score !== a.total_score) {
          return b.total_score - a.total_score
        }
        if (b.problems_solved !== a.problems_solved) {
          return b.problems_solved - a.problems_solved
        }
        return new Date(a.first_submission_time).getTime() - new Date(b.first_submission_time).getTime()
      })
      .map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        problems_solved: entry.problems_solved,
        score: entry.total_score,
        submissions: entry.submissions_count,
        time: entry.first_submission_time,
      }))

    const stats = {
      total_participants: leaderboard.length,
      average_score:
        leaderboard.length > 0
          ? Math.round(leaderboard.reduce((sum, row) => sum + row.score, 0) / leaderboard.length)
          : 0,
      top_score: leaderboard.length > 0 ? leaderboard[0].score : 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
        stats,
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
