import type { APIRoute } from 'astro';
import { generateEventQR } from '../../../../lib/qrcode';
import { supabaseAdmin } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, title')
    .eq('id', id)
    .single();

  if (!event) return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });

  const siteUrl = import.meta.env.SITE_URL ?? 'http://localhost:3000';
  const qr = await generateEventQR(id, siteUrl);

  return new Response(JSON.stringify({ qr, event }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
