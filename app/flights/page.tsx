import { FlightsResultsClient } from '@/app/flights/FlightsResultsClient';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Flight } from '@/lib/supabase/types';
import { getSearchDayBoundsIso } from '@/lib/utils';

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const origin = typeof searchParams.origin === 'string' ? searchParams.origin : '';
  const destination =
    typeof searchParams.destination === 'string' ? searchParams.destination : '';
  const date = typeof searchParams.date === 'string' ? searchParams.date : '';
  const passengers =
    typeof searchParams.passengers === 'string' ? searchParams.passengers : '1';

  const malformed = !origin || !destination || !date;

  const supabase = createAdminClient();
  let flights: Flight[] = [];

  if (!malformed) {
    const { start, end } = getSearchDayBoundsIso(date);

    const { data } = await supabase
      .from('flights')
      .select('*')
      .eq('origin', origin)
      .eq('destination', destination)
      .eq('status', 'scheduled')
      .gte('departs_at', start)
      .lte('departs_at', end)
      .order('departs_at', { ascending: true });

    flights = (data ?? []) as Flight[];
  }

  return (
    <FlightsResultsClient
      malformed={malformed}
      flights={flights}
      searchLabel={`${origin} → ${destination} · ${date} · ${passengers} passenger(s)`}
    />
  );
}
