import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client — bypasses RLS, use only in server API endpoints
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// SSR-aware client that reads/writes the session cookie.
// Pass the request and a mutable Headers object — Supabase will append
// Set-Cookie headers to it during the PKCE exchange and session refresh.
export function createSupabaseServerClient(request: Request, responseHeaders: Headers) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append(
            'set-cookie',
            serializeCookieHeader(name, value, {
              ...options,
              // Ensure cookies are accessible on production (https) and
              // on every Vercel preview domain.
              secure: true,
              sameSite: 'lax',
              httpOnly: true,
            })
          );
        });
      },
    },
  });
}
