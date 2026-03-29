import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  await supabase.auth.signOut();

  responseHeaders.set('location', `${origin}/login`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
