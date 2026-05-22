'use client';

import { useRouter } from 'next/navigation';
import { FlightClassTabs } from '@/components/flights/FlightClassTabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import type { ClassPricing, Flight } from '@/lib/supabase/types';
import { formatCurrency, formatDuration, formatTime } from '@/lib/utils';
import type { SeatClass } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  pricing: ClassPricing;
  highlightClass?: 'economy' | 'business' | 'first' | 'all';
}

export function FlightCard({
  flight,
  pricing,
  highlightClass = 'all',
}: FlightCardProps) {
  const router = useRouter();
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const selectedClass = useFlightStore((s) => s.selectedClass);
  const setClass = useFlightStore((s) => s.setClass);
  const setFlight = useFlightStore((s) => s.setFlight);
  const setStep = useFlightStore((s) => s.setStep);

  const activeClass =
    selectedFlight?.id === flight.id ? selectedClass : null;

  const handleClassSelect = (seatClass: SeatClass) => {
    setFlight(flight);
    setClass(seatClass);
  };

  const handleSelect = () => {
    if (!activeClass) return;
    setFlight(flight);
    setClass(activeClass);
    setStep('seat');
    router.push(`/flights/${flight.id}/seats`);
  };

  const timeBadge = new Date(flight.departs_at).getHours();
  const timeLabel =
    timeBadge < 12 ? 'Morning' : timeBadge < 17 ? 'Afternoon' : 'Evening';

  const displayPrice = activeClass ? pricing[activeClass] : null;

  return (
    <article className="rounded-xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:border-outline">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-headline-sm font-semibold">{flight.flight_no}</span>
            <Badge variant="info">{timeLabel}</Badge>
            <Badge variant="success">On time</Badge>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {flight.aircraft_type ?? 'Aircraft TBA'}
          </p>
        </div>
        <div className="text-right">
          {displayPrice ? (
            <p className="text-headline-md font-bold text-primary-container">
              {formatCurrency(displayPrice)}
            </p>
          ) : (
            <p className="text-body-md text-on-surface-variant">Select a class</p>
          )}
        </div>
      </div>

      <div className="relative my-6 flex items-center justify-between px-4">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-outline-variant/80" />
        <div className="relative z-10 text-center">
          <p className="text-headline-sm font-semibold">{flight.origin}</p>
          <p className="text-body-md text-on-surface-variant">
            {formatTime(flight.departs_at)}
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-3">
          <span className="material-symbols-outlined text-primary-container">flight</span>
          <span className="text-label-md text-on-surface-variant">
            {formatDuration(flight.departs_at, flight.arrives_at)}
          </span>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-headline-sm font-semibold">{flight.destination}</p>
          <p className="text-body-md text-on-surface-variant">
            {formatTime(flight.arrives_at)}
          </p>
        </div>
      </div>

      <FlightClassTabs
        pricing={pricing}
        activeClass={
          highlightClass !== 'all' && !activeClass ? highlightClass : activeClass
        }
        flightId={flight.id}
        onClassSelect={handleClassSelect}
      />

      <div className="mt-4 flex justify-end">
        <Button disabled={!activeClass} onClick={handleSelect}>
          Select
        </Button>
      </div>
    </article>
  );
}
