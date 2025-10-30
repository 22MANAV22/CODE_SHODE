import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET contest details with problems
export async function GET(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
  try {
    const { contestId } = await params
    const supabase = await createClient()

    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("*")
      .eq("id", contestId)
      .single()

    if (contestError || !contest) {
      return NextResponse.json({ success: false, error: "Contest not found" }, { status: 404 })
    }

    const { data: problems, error: problemsError } = await supabase
      .from("problems")
      .select("*")
      .eq("contest_id", contestId)
      .order("id", { ascending: true })

    if (problemsError) throw problemsError

    return NextResponse.json({
      success: true,
      data: {
        ...contest,
        problems: problems || [],
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
