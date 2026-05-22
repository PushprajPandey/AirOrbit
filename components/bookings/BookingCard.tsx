'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CancelDialog } from '@/components/bookings/CancelDialog';
import { RescheduleModal } from '@/components/bookings/RescheduleModal';
import type { Booking, Flight } from '@/lib/supabase/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  alternatives: Flight[];
  onRefresh: () => void;
}

export function BookingCard({ booking, alternatives, onRefresh }: BookingCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const flight = booking.flight;
  const seat = booking.seat;

  if (!flight) return null;

  const statusVariant =
    booking.status === 'confirmed'
      ? 'success'
      : booking.status === 'cancelled'
        ? 'error'
        : 'warning';

  return (
    <>
      <article className="rounded-xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:border-outline">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-headline-sm text-primary">{booking.pnr_code}</p>
            <p className="text-body-md text-on-surface-variant">
              {flight.flight_no} · {flight.origin} → {flight.destination}
            </p>
          </div>
          <Badge variant={statusVariant}>{booking.status}</Badge>
        </div>
        <div className="mt-4 grid gap-2 text-body-md md:grid-cols-3">
          <p>
            <span className="text-on-surface-variant">Departs </span>
            {formatDate(flight.departs_at)} {formatTime(flight.departs_at)}
          </p>
          <p>
            <span className="text-on-surface-variant">Seat </span>
            {seat?.seat_number ?? '—'} ({seat?.class ?? '—'})
          </p>
          <p>
            <span className="text-on-surface-variant">Total </span>
            {formatCurrency(Number(booking.total_price))}
          </p>
        </div>
        {booking.status === 'confirmed' ? (
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={() => setRescheduleOpen(true)}>
              Reschedule
            </Button>
            <Button variant="outline" onClick={() => setCancelOpen(true)}>
              Cancel
            </Button>
          </div>
        ) : null}
      </article>
      <CancelDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        bookingId={booking.id}
        onSuccess={onRefresh}
      />
      <RescheduleModal
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        bookingId={booking.id}
        currentFlight={flight}
        alternatives={alternatives.filter((f) => f.id !== flight.id)}
        onSuccess={onRefresh}
      />
    </>
  );
}
