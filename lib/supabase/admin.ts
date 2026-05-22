import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

/** Server-only client for public flight/seat reads (bypasses RLS). Never import in client components. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return createClient<Database>(url, key);
}
