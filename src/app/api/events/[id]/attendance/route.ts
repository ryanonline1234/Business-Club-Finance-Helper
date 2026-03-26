import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth, requireRole } from "@/lib/auth";

const supabase = createAdminClient();

// Get attendance for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await requireRole(["admin", "treasurer"]);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("attendance")
    .select(
      `
      *,
      member:profiles(name, email, id)
    `
    )
    .eq("event_id", id)
    .order("checked_in_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ attendance: data });
}

// Mark attendance for an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { member_id, password, qr_data } = body;
  const { id } = await params;

  // Verify password if provided
  if (password) {
    const { data: event } = await supabase
      .from("events")
      .select("password")
      .eq("id", id)
      .single();

    if (!event || event.password !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
  }

  // If QR data provided, verify it contains valid event ID
  if (qr_data) {
    try {
      const parsed = JSON.parse(qr_data);
      if (parsed.eventId !== id) {
        return NextResponse.json(
          { error: "QR code does not match this event" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid QR code data" },
        { status: 400 }
      );
    }
  }

  // Check if already checked in
  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("event_id", id)
    .eq("member_id", member_id || user.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Already checked in", attendance: existing },
      { status: 200 }
    );
  }

  // Check event capacity
  const { data: event } = await supabase
    .from("events")
    .select("capacity")
    .eq("id", id)
    .single();

  if (event?.capacity) {
    const { count: currentCount } = await supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("event_id", id);

    if (currentCount !== null && currentCount >= event.capacity) {
      return NextResponse.json(
        { error: "Event is at full capacity" },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert([
      {
        event_id: id,
        member_id: member_id || user.id,
        checked_in_at: new Date().toISOString(),
        method: qr_data ? "qr" : "password",
        qr_data: qr_data || null,
      },
    ])
    .select(
      `
      *,
      member:profiles(name, email)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ attendance: data }, { status: 201 });
}
