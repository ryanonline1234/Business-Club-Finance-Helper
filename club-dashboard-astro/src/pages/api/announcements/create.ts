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

  let body: { title?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { title, body: bodyText } = body;
  if (!title?.trim() || !bodyText?.trim()) {
    return new Response(JSON.stringify({ error: 'title and body are required' }), { status: 400, headers: responseHeaders });
  }

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .insert({
      title: title.trim(),
      body: bodyText.trim(),
      author_id: session.id,
      author_name: session.name,
    })
    .select()
    .single();

  if (error) {
    console.error('[api/announcements/create]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ data }), { status: 201, headers: responseHeaders });
};
