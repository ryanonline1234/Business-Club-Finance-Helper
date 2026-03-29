import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  // Always derive the callback URL from the current request origin so this
  // works on every Vercel deployment (production + every preview URL).
  const origin = new URL(request.url).origin;
  const redirectTo = `${origin}/api/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data.url) {
    const loginUrl = `${origin}/login?error=auth-error`;
    return new Response(null, {
      status: 302,
      headers: { location: loginUrl },
    });
  }

  // Supabase sets a PKCE verifier cookie — forward it in the same response
  // that redirects the browser to Google so the cookie is on the right domain.
  responseHeaders.set('location', data.url);
  return new Response(null, { status: 302, headers: responseHeaders });
};
