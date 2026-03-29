import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { getSession } from '../../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { amount, description, category_id, merchant } = body as Record<string, string>;

  if (!amount || !description || !category_id) {
    return new Response(JSON.stringify({ error: 'amount, description, and category_id are required' }), { status: 400, headers: responseHeaders });
  }

  const numericAmount = parseFloat(amount as string);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return new Response(JSON.stringify({ error: 'amount must be a positive number' }), { status: 400, headers: responseHeaders });
  }

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .insert({
      amount: numericAmount,
      description: description.trim(),
      category_id,
      merchant: merchant?.trim() || null,
      user_id: session.id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[api/finance/transactions POST]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ data }), { status: 201, headers: responseHeaders });
};
