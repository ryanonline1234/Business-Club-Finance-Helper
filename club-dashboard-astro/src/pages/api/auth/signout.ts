import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = import.meta.env.SITE_URL;
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request, responseHeaders);

  await supabase.auth.signOut();

  responseHeaders.set('location', `${siteUrl}/login`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
