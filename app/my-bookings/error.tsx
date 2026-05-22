'use client';

import { Button } from '@/components/ui/Button';

export default function MyBookingsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-headline-sm">Could not load bookings</p>
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
