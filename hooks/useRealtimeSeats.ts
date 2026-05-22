'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Seat } from '@/lib/supabase/types';

export function useRealtimeSeats(flightId: string, initialSeats: Seat[]) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setSeats(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`seats-${flightId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seats',
          filter: `flight_id=eq.${flightId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as Seat;
            setSeats((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setPaused(true);
        }
        if (status === 'SUBSCRIBED') {
          setPaused(false);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [flightId]);

  return { seats, paused };
}
