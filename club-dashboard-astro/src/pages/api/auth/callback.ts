import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/calendar';

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: { location: `${origin}/login?error=auth-error` },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return new Response(null, {
      status: 302,
      headers: { location: `${origin}/login?error=auth-error` },
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
      headers: { location: `${origin}/login?error=unauthorized` },
    });
  }

  // Session cookies are already written into responseHeaders by the SSR client.
  // Use an absolute URL so the redirect always lands on the correct domain.
  responseHeaders.set('location', `${origin}${next}`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
