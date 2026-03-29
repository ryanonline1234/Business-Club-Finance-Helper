import { createSupabaseServerClient } from './supabase';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Get the current session user.
 * Pass Astro.response.headers as responseHeaders so any session-refresh
 * cookies Supabase issues get forwarded to the browser automatically.
 */
export async function getSession(
  request: Request,
  responseHeaders: Headers
): Promise<SessionUser | null> {
  const supabase = createSupabaseServerClient(request, responseHeaders);

  // getUser() validates the JWT with Supabase — more reliable than getSession()
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

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
 * Require auth — returns user or throws a redirect response to /login.
 * Uses Astro.response.headers so refreshed session cookies are forwarded.
 */
export async function requireAuth(
  request: Request,
  responseHeaders: Headers,
  redirect: (path: string) => Response
): Promise<SessionUser> {
  const user = await getSession(request, responseHeaders);
  if (!user) {
    const siteUrl = import.meta.env.SITE_URL ?? new URL(request.url).origin;
    throw redirect(`${siteUrl}/login`);
  }
  return user;
}
