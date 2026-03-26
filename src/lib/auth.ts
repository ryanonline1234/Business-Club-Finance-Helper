import { getAuthClient } from "./supabase";

export async function getServerSession() {
  const supabase = getAuthClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getServerUser() {
  const session = await getServerSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getServerUser();
  if (!user) {
    return null;
  }
  return user;
}

export async function getServerRole() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = getAuthClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role || null;
}

export async function requireRole(allowedRoles: string[]) {
  const role = await getServerRole();
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }
  return role;
}
