import type { ClassPricing, Flight, Seat } from '@/lib/supabase/types';
import { classTicketPrice, type SeatClass } from '@/lib/utils';

export function computeClassPricing(flight: Flight): ClassPricing {
  const classes: SeatClass[] = ['economy', 'business', 'first'];
  const result = {} as ClassPricing;
  const base = Number(flight.base_price);

  for (const seatClass of classes) {
    result[seatClass] = classTicketPrice(base, seatClass);
  }

  return result;
}

export async function getAirportCodes(
  supabase: ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>
): Promise<{ origins: string[]; destinations: string[] }> {
  const { data } = await supabase.from('flights').select('origin, destination');
  const rows = (data ?? []) as { origin: string; destination: string }[];
  const origins = Array.from(new Set(rows.map((f) => f.origin))).sort();
  const destinations = Array.from(new Set(rows.map((f) => f.destination))).sort();
  return { origins, destinations };
}

export function filterFlightsByPrice(
  flights: Flight[],
  maxPrice: number
): Flight[] {
  return flights.filter((f) => Number(f.base_price) <= maxPrice);
}
