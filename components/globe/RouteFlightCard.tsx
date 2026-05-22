'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import type { RouteFlight } from '@/lib/supabase/types';
import { formatCurrency, formatDuration, formatTime } from '@/lib/utils';

interface RouteFlightCardProps {
  flight: RouteFlight;
}

export function RouteFlightCard({ flight }: RouteFlightCardProps) {
  const router = useRouter();
  const setFlight = useFlightStore((s) => s.setFlight);
  const setStep = useFlightStore((s) => s.setStep);

  const handleBook = () => {
    setFlight({
      id: flight.id,
      flight_no: flight.flight_no,
      origin: '',
      destination: '',
      departs_at: flight.departs_at,
      arrives_at: flight.arrives_at,
      aircraft_type: flight.aircraft_type,
      status: 'scheduled',
      base_price: Number(flight.base_price),
      origin_lat: flight.origin_lat,
      origin_lon: flight.origin_lon,
      dest_lat: flight.dest_lat,
      dest_lon: flight.dest_lon,
    });
    setStep('seat');
    router.push(`/flights/${flight.id}/seats`);
  };

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-4 transition-all hover:border-outline">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{flight.flight_no}</p>
          <p className="text-body-md text-on-surface-variant">
            {formatTime(flight.departs_at)} ·{' '}
            {formatDuration(flight.departs_at, flight.arrives_at)} · Direct
          </p>
          <p className="text-body-md text-on-surface-variant">
            {flight.aircraft_type ?? 'Aircraft TBA'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-headline-sm font-bold text-primary-container">
            {formatCurrency(Number(flight.base_price))}
          </p>
          <Button className="mt-2" onClick={handleBook}>
            Select & Book
          </Button>
        </div>
      </div>
    </div>
  );
}
