import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/login?error=auth-error');
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return redirect('/login?error=auth-error');
  }

  // Verify the user exists in our profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    // Sign them back out and redirect with error
    await supabase.auth.signOut();
    return redirect('/login?error=unauthorized');
  }

  responseHeaders.set('location', '/calendar');
  return new Response(null, { status: 302, headers: responseHeaders });
};
