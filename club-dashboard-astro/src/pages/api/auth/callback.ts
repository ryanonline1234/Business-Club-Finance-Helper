import type { APIRoute } from 'astro';
import { createSupabaseServerClient, supabaseAdmin } from '../../../lib/supabase';

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

  const userId = data.user.id;
  const userEmail = data.user.email ?? '';
  const userName = data.user.user_metadata?.full_name
    ?? data.user.user_metadata?.name
    ?? userEmail.split('@')[0];

  // Use admin client to bypass RLS — check if profile exists
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  // If the trigger didn't create it yet, create it now
  if (!profile) {
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({ id: userId, email: userEmail, name: userName, role: 'member' });

    if (insertError) {
      await supabase.auth.signOut();
      return new Response(null, {
        status: 302,
        headers: { location: `${siteUrl}/login?error=auth-error` },
      });
    }
  }

  responseHeaders.set('location', `${siteUrl}/calendar`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
