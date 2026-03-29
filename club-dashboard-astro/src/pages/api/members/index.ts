import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const user = await getSession(request, responseHeaders);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, role, created_at')
    .order('role', { ascending: true });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
