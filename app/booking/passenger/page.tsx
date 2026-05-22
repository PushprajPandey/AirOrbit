'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingStepper } from '@/components/bookings/BookingStepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import { useToast } from '@/components/ui/Toast';
import {
  classTicketPrice,
  formatCurrency,
  generatePnr,
  totalBookingPrice,
} from '@/lib/utils';

export default function PassengerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const selectedSeats = useFlightStore((s) => s.selectedSeats);
  const selectedClass = useFlightStore((s) => s.selectedClass);
  const passengerCount = useFlightStore((s) => s.searchQuery.passengerCount);
  const passengers = useFlightStore((s) => s.passengers);
  const setPassenger = useFlightStore((s) => s.setPassenger);
  const initPassengers = useFlightStore((s) => s.initPassengers);
  const setStep = useFlightStore((s) => s.setStep);
  const setBookingResult = useFlightStore((s) => s.setBookingResult);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initPassengers(passengerCount);
  }, [passengerCount, initPassengers]);

  useEffect(() => {
    if (!selectedFlight || !selectedClass || selectedSeats.length !== passengerCount) {
      router.replace('/');
    }
  }, [selectedFlight, selectedClass, selectedSeats, passengerCount, router]);

  if (!selectedFlight || !selectedClass || selectedSeats.length !== passengerCount) {
    return null;
  }

  const perPerson = classTicketPrice(
    Number(selectedFlight.base_price),
    selectedClass
  );
  const total = totalBookingPrice(
    Number(selectedFlight.base_price),
    selectedClass,
    passengerCount
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const items = selectedSeats.map((seat, index) => ({
      seatId: seat.id,
      totalPrice: perPerson,
      passenger: passengers[index]!,
    }));

    const pnr = generatePnr();

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          pnrCode: pnr,
          items,
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: { pnrCode: string; totalPrice: number };
        error?: string;
      };
      if (!res.ok) {
        toast(json.error ?? 'Booking failed', 'error');
        return;
      }
      setBookingResult(json.data?.pnrCode ?? pnr, json.data?.totalPrice ?? total);
      setStep('confirm');
      router.push('/booking/confirm');
    } catch {
      toast('Booking failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-margin">
      <BookingStepper />
      <h1 className="mt-6 text-headline-lg">Passenger details</h1>
      <p className="text-body-md text-on-surface-variant">
        {passengerCount} passenger{passengerCount > 1 ? 's' : ''} · Seats:{' '}
        {selectedSeats.map((s) => s.seat_number).join(', ')} ·{' '}
        {formatCurrency(total)} total
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {passengers.slice(0, passengerCount).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-outline-variant bg-white p-6"
          >
            <h2 className="mb-4 text-headline-sm">
              Passenger {index + 1}
              {selectedSeats[index] ? (
                <span className="ml-2 text-body-md font-normal text-on-surface-variant">
                  Seat {selectedSeats[index]!.seat_number}
                </span>
              ) : null}
            </h2>
            <div className="space-y-4">
              <Input
                label="Full name"
                required
                value={passengers[index]?.fullName ?? ''}
                onChange={(e) =>
                  setPassenger(index, { fullName: e.target.value })
                }
              />
              <Input
                label="Passport number"
                required
                value={passengers[index]?.passportNo ?? ''}
                onChange={(e) =>
                  setPassenger(index, { passportNo: e.target.value })
                }
              />
              <Input
                label="Nationality"
                required
                value={passengers[index]?.nationality ?? ''}
                onChange={(e) =>
                  setPassenger(index, { nationality: e.target.value })
                }
              />
              <Input
                label="Date of birth"
                type="date"
                required
                value={passengers[index]?.dob ?? ''}
                onChange={(e) => setPassenger(index, { dob: e.target.value })}
              />
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
          <div className="flex justify-between text-body-md">
            <span>Fare per passenger ({selectedClass})</span>
            <span>{formatCurrency(perPerson)}</span>
          </div>
          <div className="mt-2 flex justify-between text-headline-sm font-bold">
            <span>Total</span>
            <span className="text-primary-container">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Confirm & pay
        </Button>
      </form>
    </div>
  );
}
