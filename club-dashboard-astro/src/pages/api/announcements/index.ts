import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('id, title, body, created_at, author_name')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data ?? []), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
