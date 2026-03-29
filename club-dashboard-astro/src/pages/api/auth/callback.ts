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
    // Log to Vercel function logs for server-side visibility
    console.error('[auth/callback] exchangeCodeForSession failed:', {
      message: error?.message,
      status: error?.status,
      name: error?.name,
      hasCode: !!code,
      cookieHeader: request.headers.get('cookie')?.replace(/=([^;]+)/g, '=[redacted]') ?? 'none',
    });
    const msg = encodeURIComponent(error?.message ?? 'No user returned');
    return new Response(null, {
      status: 302,
      headers: { location: `${siteUrl}/login?error=auth-error&detail=${msg}` },
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
