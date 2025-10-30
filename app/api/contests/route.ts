import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET all contests
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("contests").select("*").order("start_time", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch contests" }, { status: 500 })
  }
}
