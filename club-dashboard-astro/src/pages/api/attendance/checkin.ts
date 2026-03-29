import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyQRToken } from '../../../lib/qrcode';
import { getSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();

  let body: { qr_token?: string; member_id?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { qr_token, member_id } = body;
  if (!qr_token) return new Response(JSON.stringify({ error: 'Missing qr_token' }), { status: 400 });

  // Verify QR token
  const payload = await verifyQRToken(qr_token);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Invalid or expired QR code' }), { status: 400 });
  }

  // Resolve member — either from session or explicit member_id
  let resolvedMemberId = member_id;
  if (!resolvedMemberId) {
    const user = await getSession(request, responseHeaders);
    if (user) resolvedMemberId = user.id;
  }
  if (!resolvedMemberId) {
    return new Response(JSON.stringify({ error: 'Could not identify member' }), { status: 400 });
  }

  // Check for duplicate
  const { data: existing } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('event_id', payload.event_id)
    .eq('member_id', resolvedMemberId)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ error: 'Already checked in' }), { status: 409 });
  }

  // Insert attendance record
  const { data: record, error } = await supabaseAdmin
    .from('attendance')
    .insert({
      event_id: payload.event_id,
      member_id: resolvedMemberId,
      method: 'qr',
    })
    .select('id, checked_in_at, profiles:member_id(name)')
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const profile = Array.isArray(record.profiles) ? record.profiles[0] : record.profiles;

  return new Response(JSON.stringify({
    success: true,
    member_name: profile?.name ?? 'Member',
    checked_in_at: record.checked_in_at,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...Object.fromEntries(responseHeaders) },
  });
};
