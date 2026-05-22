import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieToSet } from '@/lib/supabase/cookies';
import type { Database } from '@/lib/supabase/types';

export function createServerClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /* Server Component — cookie writes only in Route Handlers / Actions */
          }
        },
      },
    }
  );
}
