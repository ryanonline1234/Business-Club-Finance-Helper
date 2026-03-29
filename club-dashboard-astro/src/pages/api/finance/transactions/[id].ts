import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { getSession } from '../../../../lib/auth';

// PATCH /api/finance/transactions/:id  — approve or reject a transaction
export const PATCH: APIRoute = async ({ request, params }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }
  if (!['admin', 'treasurer'].includes(session.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: responseHeaders });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { status } = body;
  if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
    return new Response(JSON.stringify({ error: 'status must be approved, rejected, or pending' }), { status: 400, headers: responseHeaders });
  }

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ data }), { status: 200, headers: responseHeaders });
};

// DELETE /api/finance/transactions/:id
export const DELETE: APIRoute = async ({ request, params }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }
  if (!['admin', 'treasurer'].includes(session.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: responseHeaders });
  }

  const { error } = await supabaseAdmin
    .from('transactions')
    .delete()
    .eq('id', params.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: responseHeaders });
};
