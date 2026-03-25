import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
export const createAdminClient = () => {
  const supabaseUrl = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
};
