'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BookingCard } from '@/components/bookings/BookingCard';
import { useUserStore } from '@/lib/stores/useUserStore';
import type { Booking, Flight } from '@/lib/supabase/types';

interface MyBookingsClientProps {
  initialBookings: Booking[];
  alternatives: Flight[];
}

export function MyBookingsClient({
  initialBookings,
  alternatives,
}: MyBookingsClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [isOffline, setIsOffline] = useState(false);
  const cachedBookings = useUserStore((s) => s.cachedBookings);
  const setCachedBookings = useUserStore((s) => s.setCachedBookings);

  useEffect(() => {
    if (initialBookings.length > 0) {
      setCachedBookings(initialBookings);
    }
  }, [initialBookings, setCachedBookings]);

  useEffect(() => {
    const sync = () => setIsOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  const displayBookings =
    isOffline && cachedBookings.length > 0 ? cachedBookings : bookings;

  const refresh = useCallback(async () => {
    const res = await fetch('/api/bookings');
    const json = (await res.json()) as { success: boolean; data?: Booking[] };
    if (json.success && json.data) {
      setBookings(json.data);
      setCachedBookings(json.data);
    }
    router.refresh();
  }, [router, setCachedBookings]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-margin">
      <h1 className="text-headline-lg">My bookings</h1>
      {isOffline && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-body-sm text-amber-900">
          Offline — showing your last saved bookings.
        </p>
      )}
      <div className="mt-6 space-y-4">
        {displayBookings.length === 0 ? (
          <p className="rounded-xl border border-outline-variant bg-white p-8 text-center text-body-md text-on-surface-variant">
            No bookings yet. Sign in and book a flight to see them here.
          </p>
        ) : (
          displayBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              alternatives={alternatives}
              onRefresh={refresh}
            />
          ))
        )}
      </div>
    </div>
  );
}
