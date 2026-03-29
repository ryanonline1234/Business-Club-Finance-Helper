import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { getSession } from '../../../../lib/auth';

export const DELETE: APIRoute = async ({ request, params }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }
  if (!['admin', 'treasurer'].includes(session.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: responseHeaders });
  }

  const { id } = params;
  const { error } = await supabaseAdmin
    .from('events')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: responseHeaders });
};
