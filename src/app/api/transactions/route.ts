import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const supabase = createAdminClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "treasurer"].includes(profile.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category_id = searchParams.get("category_id");
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = supabase
    .from("transactions")
    .select(
      `
      *,
      categories (*),
      profiles (*)
    `
    );

  if (status) {
    query = query.eq("status", status);
  }

  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transactions: data });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    amount,
    description,
    category_id,
    merchant,
    receipt_url,
  } = body;

  if (!amount || !description || !category_id) {
    return NextResponse.json(
      { error: "Missing required fields: amount, description, category_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        amount,
        description,
        category_id,
        user_id: session.user.id,
        merchant,
        receipt_url,
        status: "pending",
      },
    ])
    .select(
      `
      *,
      categories (*),
      profiles (*)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    action: "transaction_created",
    table_name: "transactions",
    record_id: data.id,
    user_id: session.user.id,
    new_data: data,
  });

  return NextResponse.json({ transaction: data }, { status: 201 });
}
