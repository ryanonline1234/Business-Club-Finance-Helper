import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

// Trim whitespace/newlines — a common copy-paste mistake when setting Vercel env vars
const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL as string).trim();
const supabaseAnonKey = (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string).trim();
const supabaseServiceKey = (import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string).trim();

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
              // path: '/' ensures the PKCE code-verifier cookie is sent to
              // ALL paths including /api/auth/callback, not just the signin path.
              path: '/',
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
