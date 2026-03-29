import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { getSession } from '../../../../lib/auth';

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

  const { name, amount, category_id, starts_at, ends_at } = body as Record<string, string>;

  if (!name || !amount || !category_id || !starts_at || !ends_at) {
    return new Response(JSON.stringify({ error: 'name, amount, category_id, starts_at, and ends_at are required' }), { status: 400, headers: responseHeaders });
  }

  const { data, error } = await supabaseAdmin
    .from('budgets')
    .insert({
      name: name.trim(),
      amount: parseFloat(amount as string),
      spent: 0,
      category_id,
      starts_at,
      ends_at,
    })
    .select()
    .single();

  if (error) {
    console.error('[api/finance/budgets POST]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ data }), { status: 201, headers: responseHeaders });
};
