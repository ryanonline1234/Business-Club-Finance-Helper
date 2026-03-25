import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (admin - uses service role key)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
};

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
