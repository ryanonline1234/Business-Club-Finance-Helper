import { createSupabaseServerClient } from './supabase';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Get the current session user from the request cookies.
 * Returns null if no valid session.
 */
export async function getSession(
  request: Request,
  responseHeaders: Headers
): Promise<SessionUser | null> {
  const supabase = createSupabaseServerClient(request, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Fetch role + name from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? '',
    name: profile?.name ?? null,
    role: profile?.role ?? 'member',
  };
}

/**
 * Require auth — returns user or redirects to /login.
 * Use at the top of every protected .astro page.
 */
export async function requireAuth(
  request: Request,
  responseHeaders: Headers,
  redirect: (path: string) => Response
): Promise<SessionUser> {
  const user = await getSession(request, responseHeaders);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}
