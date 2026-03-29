import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'content-type': 'application/json' });
  const session = await getSession(request, responseHeaders);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }

  const isOfficer = ['admin', 'treasurer'].includes(session.role);

  // Fetch categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug, icon')
    .eq('is_active', true)
    .order('name');

  // Fetch budgets
  const { data: budgets } = await supabaseAdmin
    .from('budgets')
    .select('id, name, amount, spent, category_id, starts_at, ends_at, created_at')
    .order('created_at', { ascending: false });

  // Fetch transactions — officers see all, members see own
  let txQuery = supabaseAdmin
    .from('transactions')
    .select('id, amount, description, merchant, status, created_at, category_id, user_id, categories(name), profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (!isOfficer) {
    txQuery = txQuery.eq('user_id', session.id);
  }

  const { data: transactions } = await txQuery;

  return new Response(JSON.stringify({ categories, budgets, transactions }), {
    status: 200,
    headers: responseHeaders,
  });
};
