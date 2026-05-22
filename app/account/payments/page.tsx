import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/lib/supabase/types';

export default async function PaymentsPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-body-md text-on-surface-variant">Please sign in to view payments.</p>
        <Link href="/auth/login" className="mt-4 inline-block text-primary-container hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  const { data } = await supabase
    .from('bookings')
    .select(`*, flight:flights(flight_no, origin, destination, departs_at)`)
    .eq('user_id', user.id)
    .order('booked_at', { ascending: false });

  const bookings = (data ?? []) as Booking[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-margin">
      <h1 className="text-headline-lg">Payment history</h1>
      <p className="mt-1 text-body-md text-on-surface-variant">
        All completed bookings and fares
      </p>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-outline-variant bg-white p-8 text-center text-body-md text-on-surface-variant">
            No payments yet.
          </p>
        ) : (
          bookings.map((b) => {
            const flight = b.flight as { flight_no?: string; origin?: string; destination?: string; departs_at?: string } | undefined;
            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-outline-variant bg-white p-4"
              >
                <div>
                  <p className="font-mono font-semibold text-primary">{b.pnr_code}</p>
                  <p className="text-body-md text-on-surface-variant">
                    {flight?.flight_no ?? '—'} · {flight?.origin} → {flight?.destination}
                  </p>
                  <p className="text-body-md text-on-surface-variant">
                    {formatDate(b.booked_at)}
                    {flight?.departs_at ? ` · Departs ${formatDate(flight.departs_at)}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-headline-sm font-bold text-primary-container">
                    {formatCurrency(Number(b.total_price))}
                  </p>
                  <p className="text-badge-sm uppercase text-on-surface-variant">{b.status}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
