'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SeatCell } from '@/components/seats/SeatCell';
import { SeatLegend } from '@/components/seats/SeatLegend';
import { RealtimeBanner } from '@/components/seats/RealtimeBanner';
import { Button } from '@/components/ui/Button';
import { useRealtimeSeats } from '@/hooks/useRealtimeSeats';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import {
  buildSeatRows,
  groupSeatsByClass,
} from '@/lib/seats/layout';
import type { Flight, Seat } from '@/lib/supabase/types';
import {
  cn,
  formatCurrency,
  classTicketPrice,
  totalBookingPrice,
} from '@/lib/utils';
import type { SeatClass } from '@/lib/utils';

interface SeatMapProps {
  flight: Flight;
  initialSeats: Seat[];
}

const CLASS_ORDER: SeatClass[] = ['first', 'business', 'economy'];
const CLASS_LABELS: Record<SeatClass, string> = {
  first: 'First Class',
  business: 'Business Class',
  economy: 'Economy',
};

const CABIN_LAYOUT: ({ col: string } | { aisle: true })[] = [
  { col: 'A' },
  { col: 'B' },
  { aisle: true },
  { col: 'C' },
  { col: 'D' },
  { aisle: true },
  { col: 'E' },
];

function CabinSection({
  seatClass,
  seats,
  highlighted,
  selectedIds,
  onToggle,
  sectionRef,
}: {
  seatClass: SeatClass;
  seats: Seat[];
  highlighted: boolean;
  selectedIds: Set<string>;
  onToggle: (seat: Seat) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}) {
  const rows = buildSeatRows(seats);
  const rowNumbers = Array.from(rows.keys()).sort((a, b) => a - b);

  return (
    <div ref={sectionRef} className="space-y-3">
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-outline-variant" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface-container-low px-2 text-label-md uppercase tracking-widest text-outline">
            {CLASS_LABELS[seatClass]}
          </span>
        </div>
      </div>
      <div
        className={cn(
          'rounded-lg p-2 transition-all',
          highlighted && 'ring-2 ring-primary-container/40'
        )}
      >
        <div className="mb-2 grid grid-cols-[1fr_1fr_0.5rem_1fr_1fr_0.5rem_1fr] items-center justify-items-center gap-1">
          {CABIN_LAYOUT.map((cell, i) =>
            'aisle' in cell ? (
              <div key={`h-aisle-${i}`} className="w-2" />
            ) : (
              <span key={cell.col} className="text-label-md text-outline">
                {cell.col}
              </span>
            )
          )}
        </div>
        <div className="flex flex-col gap-2">
          {rowNumbers.map((rowNum) => {
            const row = rows.get(rowNum)!;
            return (
              <div
                key={rowNum}
                className="grid grid-cols-[1fr_1fr_0.5rem_1fr_1fr_0.5rem_1fr] items-center justify-items-center gap-1"
              >
                {CABIN_LAYOUT.map((cell, colIdx) => {
                  if ('aisle' in cell) {
                    return <div key={`aisle-${rowNum}-${colIdx}`} className="w-2" />;
                  }
                  const seat = row.get(cell.col);
                  if (!seat) {
                    return <div key={`${rowNum}-${cell.col}`} className="h-9 w-9" />;
                  }
                  return (
                    <SeatCell
                      key={seat.id}
                      seat={seat}
                      selected={selectedIds.has(seat.id)}
                      onToggle={onToggle}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SeatMap({ flight, initialSeats }: SeatMapProps) {
  const router = useRouter();
  const { seats, paused } = useRealtimeSeats(flight.id, initialSeats);
  const passengerCount = useFlightStore((s) => s.searchQuery.passengerCount);
  const selectedClass = useFlightStore((s) => s.selectedClass);
  const selectedSeats = useFlightStore((s) => s.selectedSeats);
  const toggleSeat = useFlightStore((s) => s.toggleSeat);
  const setStep = useFlightStore((s) => s.setStep);
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const grouped = groupSeatsByClass(seats);
  const selectedIds = new Set(selectedSeats.map((s) => s.id));
  const ticketPrice =
    selectedClass && flight
      ? classTicketPrice(Number(flight.base_price), selectedClass)
      : 0;
  const total =
    selectedClass && selectedSeats.length > 0
      ? totalBookingPrice(
          Number(flight.base_price),
          selectedClass,
          selectedSeats.length
        )
      : null;

  useEffect(() => {
    if (!selectedClass) return;
    zoneRefs.current[selectedClass]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [selectedClass]);

  const handleContinue = () => {
    if (!selectedClass || selectedSeats.length !== passengerCount) return;
    setStep('passenger');
    router.push('/booking/passenger');
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <section className="md:col-span-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-headline-md">Choose your seat</h1>
            <p className="text-body-md text-on-surface-variant">
              {flight.flight_no} · {flight.origin} → {flight.destination}
            </p>
          </div>
          {!paused ? (
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-badge-sm uppercase tracking-wider text-green-700">
                Live availability
              </span>
            </div>
          ) : (
            <RealtimeBanner />
          )}
        </div>

        {selectedClass ? (
          <p className="mb-3 text-body-md text-on-surface-variant">
            {CLASS_LABELS[selectedClass]} — {formatCurrency(ticketPrice)} per passenger
            · Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} (
            {selectedSeats.length}/{passengerCount})
          </p>
        ) : null}

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mx-auto w-full max-w-md rounded-t-[120px] border border-b-0 border-outline-variant bg-surface-container-low p-4">
            <div className="mx-auto mb-6 flex justify-center gap-4 opacity-20">
              <div className="h-1 w-12 rounded-full bg-outline" />
              <div className="h-1 w-12 rounded-full bg-outline" />
            </div>
            <div className="seat-grid-container max-h-[500px] space-y-6 overflow-y-auto px-1 pb-4">
              {CLASS_ORDER.map((seatClass) => (
                <CabinSection
                  key={seatClass}
                  seatClass={seatClass}
                  seats={grouped[seatClass]}
                  highlighted={selectedClass === seatClass}
                  selectedIds={selectedIds}
                  onToggle={toggleSeat}
                  sectionRef={(el) => {
                    zoneRefs.current[seatClass] = el;
                  }}
                />
              ))}
            </div>
          </div>
          <SeatLegend />
        </div>
      </section>

      <aside className="md:col-span-4">
        <div className="sticky top-24 rounded-xl border border-outline-variant bg-white p-6 shadow-card">
          <h2 className="text-headline-sm">Selected seats</h2>
          {selectedSeats.length === 0 ? (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline">
                event_seat
              </span>
              <p className="mt-3 text-body-md text-on-surface-variant">
                Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} from the
                cabin map
              </p>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-2">
                {selectedSeats.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2"
                  >
                    <span className="font-semibold">{s.seat_number}</span>
                    <span className="text-body-md text-on-surface-variant">
                      {formatCurrency(ticketPrice)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-outline-variant pt-4">
                <span className="text-headline-sm">
                  Total ({selectedSeats.length} passenger
                  {selectedSeats.length > 1 ? 's' : ''})
                </span>
                <span className="text-headline-sm font-bold text-primary-container">
                  {total ? formatCurrency(total) : '—'}
                </span>
              </div>
            </>
          )}
          <Button
            className="mt-6 w-full"
            disabled={selectedSeats.length !== passengerCount || !selectedClass}
            onClick={handleContinue}
          >
            Continue to passenger details
          </Button>
        </div>
      </aside>
    </div>
  );
}
