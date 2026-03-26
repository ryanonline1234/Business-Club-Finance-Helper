import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth, requireRole } from "@/lib/auth";

const supabase = createAdminClient();

export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await requireRole(["admin", "treasurer"]);
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, icon } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Missing required field: name" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        icon: icon || "box",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
