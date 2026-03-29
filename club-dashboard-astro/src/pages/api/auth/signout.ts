import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, redirect }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);
  await supabase.auth.signOut();

  responseHeaders.set('location', '/login');
  return new Response(null, { status: 302, headers: responseHeaders });
};
