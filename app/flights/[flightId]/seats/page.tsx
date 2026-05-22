import Link from 'next/link';
import { SeatMap } from '@/components/seats/SeatMap';
import { BookingStepper } from '@/components/bookings/BookingStepper';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import type { Flight, Seat } from '@/lib/supabase/types';

export default async function SeatsPage({
  params,
}: {
  params: { flightId: string };
}) {
  const supabase = createAdminClient();
  const { data: flight } = await supabase
    .from('flights')
    .select('*')
    .eq('id', params.flightId)
    .single();

  if (!flight) notFound();

  const { data: seats } = await supabase
    .from('seats')
    .select('*')
    .eq('flight_id', params.flightId)
    .order('seat_number');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-margin">
      <BookingStepper />
      <div className="mt-4 flex justify-end">
        <Link
          href="/flights"
          className="text-body-md text-primary-container hover:underline"
        >
          Back to results
        </Link>
      </div>
      <div className="mt-4">
        <SeatMap
          flight={flight as Flight}
          initialSeats={(seats ?? []) as Seat[]}
        />
      </div>
    </div>
  );
}
