import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = import.meta.env.SITE_URL;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: { location: `${siteUrl}/login?error=auth-error` },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return new Response(null, {
      status: 302,
      headers: { location: `${siteUrl}/login?error=auth-error` },
    });
  }

  // Verify the user has a profile in our database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return new Response(null, {
      status: 302,
      headers: { location: `${siteUrl}/login?error=unauthorized` },
    });
  }

  responseHeaders.set('location', `${siteUrl}/calendar`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
