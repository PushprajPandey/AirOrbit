import { MyBookingsClient } from '@/app/my-bookings/MyBookingsClient';
import { createServerClient } from '@/lib/supabase/server';
import type { Booking, Flight } from '@/lib/supabase/types';

export default async function MyBookingsPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let bookings: Booking[] = [];
  if (user) {
    const { data } = await supabase
      .from('bookings')
      .select(`*, flight:flights(*), seat:seats(*), passengers(*)`)
      .eq('user_id', user.id)
      .order('booked_at', { ascending: false });
    bookings = (data ?? []) as Booking[];
  }

  const { data: flights } = await supabase
    .from('flights')
    .select('*')
    .eq('status', 'scheduled');

  return (
    <MyBookingsClient
      initialBookings={bookings}
      alternatives={(flights ?? []) as Flight[]}
    />
  );
}
