import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth, requireRole } from "@/lib/auth";

const supabase = createAdminClient();

// Get all events (admin/treasurer only)
export async function GET(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await requireRole(["admin", "treasurer"]);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = supabase
    .from("events")
    .select(
      `
      *,
      created_by:profiles(name, email)
    `
    )
    .order("start_time", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}

// Create a new event (admin/treasurer only)
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await requireRole(["admin", "treasurer"]);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    title,
    description,
    start_time,
    end_time,
    location,
    password,
    capacity,
    category,
  } = body;

  if (!title || !start_time) {
    return NextResponse.json(
      { error: "Missing required fields: title, start_time" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title,
        description,
        start_time,
        end_time,
        location,
        password,
        capacity,
        category,
        created_by: user.id,
        status: "active",
      },
    ])
    .select(
      `
      *,
      created_by:profiles(name, email)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
