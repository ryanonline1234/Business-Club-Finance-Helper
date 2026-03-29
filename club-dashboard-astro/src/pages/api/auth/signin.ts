import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  const siteUrl = import.meta.env.SITE_URL;
  const redirectTo = `${siteUrl}/api/auth/callback`;

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
    return new Response(null, {
      status: 302,
      headers: { location: `${siteUrl}/login?error=auth-error` },
    });
  }

  responseHeaders.set('location', data.url);
  return new Response(null, { status: 302, headers: responseHeaders });
};
