import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const user = await getSession(request, responseHeaders);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('attendance')
    .select(`
      id,
      checked_in_at,
      method,
      profiles:member_id ( name, email, role ),
      events:event_id ( title, start_time )
    `)
    .order('checked_in_at', { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
