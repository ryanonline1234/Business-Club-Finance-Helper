import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, redirect }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  const siteUrl = import.meta.env.SITE_URL ?? 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data.url) {
    return redirect('/login?error=auth-error');
  }

  // Forward any cookies Supabase set (e.g. PKCE verifier)
  const location = data.url;
  responseHeaders.set('location', location);
  return new Response(null, { status: 302, headers: responseHeaders });
};
