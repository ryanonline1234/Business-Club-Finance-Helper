import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }
  if (!['admin', 'treasurer'].includes(session.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: responseHeaders });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { title, description, start_time, end_time, location, category, password, capacity } = body as Record<string, string>;

  if (!title || !start_time) {
    return new Response(JSON.stringify({ error: 'title and start_time are required' }), { status: 400, headers: responseHeaders });
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      start_time,
      end_time: end_time || null,
      location: location?.trim() || null,
      category: category || 'meeting',
      password: password?.trim() || null,
      capacity: capacity ? parseInt(capacity as string) : null,
      status: 'active',
      created_by: session.id,
    })
    .select()
    .single();

  if (error) {
    console.error('[api/events/create]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ data }), { status: 201, headers: responseHeaders });
};
