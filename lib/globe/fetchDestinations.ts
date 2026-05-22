import type { createBrowserClient } from '@/lib/supabase/client';

/** Unique destinations with scheduled flights from an origin airport */
export async function fetchDestinationsFromOrigin(
  supabase: ReturnType<typeof createBrowserClient>,
  origin: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('flights')
    .select('destination')
    .eq('origin', origin)
    .eq('status', 'scheduled');

  if (error || !data) return [];

  const rows = data as { destination: string }[];
  return Array.from(new Set(rows.map((r) => r.destination))).sort();
}
