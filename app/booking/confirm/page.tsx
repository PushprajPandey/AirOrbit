'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { BoardingPassTicket } from '@/components/bookings/BoardingPassTicket';
import { BookingStepper } from '@/components/bookings/BookingStepper';
import { useFlightStore } from '@/lib/stores/useFlightStore';

export default function ConfirmPage() {
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const selectedSeats = useFlightStore((s) => s.selectedSeats);
  const passengers = useFlightStore((s) => s.passengers);
  const pnrCode = useFlightStore((s) => s.pnrCode);
  const lastBookingTotal = useFlightStore((s) => s.lastBookingTotal);
  const resetBooking = useFlightStore((s) => s.resetBooking);

  useEffect(() => {
    const storedPnr = sessionStorage.getItem('last-pnr');
    const storedTotal = sessionStorage.getItem('last-total');
    if (storedPnr && !pnrCode) {
      useFlightStore.getState().setBookingResult(storedPnr, Number(storedTotal ?? 0));
    }
  }, [pnrCode]);

  useEffect(() => {
    if (pnrCode) {
      sessionStorage.setItem('last-pnr', pnrCode);
      sessionStorage.setItem('last-total', String(lastBookingTotal));
    }
  }, [pnrCode, lastBookingTotal]);

  if (!selectedFlight || !pnrCode) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Link href="/" className="text-primary-container hover:underline">
          Go to search
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-margin">
      <BookingStepper />
      <div className="mt-8">
        <BoardingPassTicket
          data={{
            pnr: pnrCode,
            flight: selectedFlight,
            seats: selectedSeats,
            passengers,
            totalPrice: lastBookingTotal,
          }}
        />
      </div>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/account/payments"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-on-primary"
        >
          Payment history
        </Link>
        <Link
          href="/my-bookings"
          className="text-body-md text-primary-container hover:underline"
        >
          View my bookings
        </Link>
        <button
          type="button"
          onClick={() => {
            resetBooking();
            window.location.href = '/';
          }}
          className="text-body-md text-on-surface-variant hover:underline"
        >
          Book another flight
        </button>
      </div>
    </div>
  );
}
