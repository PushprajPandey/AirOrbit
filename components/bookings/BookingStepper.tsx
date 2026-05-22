'use client';

import { cn } from '@/lib/utils';
import { useFlightStore, type BookingStep } from '@/lib/stores/useFlightStore';

const steps: { key: BookingStep; label: string }[] = [
  { key: 'search', label: 'Search' },
  { key: 'seat', label: 'Seat' },
  { key: 'passenger', label: 'Passenger' },
  { key: 'confirm', label: 'Confirm' },
];

const order: BookingStep[] = ['search', 'seat', 'passenger', 'confirm'];

export function BookingStepper() {
  const current = useFlightStore((s) => s.bookingStep);
  const currentIndex = order.indexOf(current);

  return (
    <ol className="flex items-center gap-2 md:gap-4">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = step.key === current;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-body-md font-medium transition-colors',
                done && 'bg-success text-white',
                active && 'bg-primary-container text-white',
                !done && !active && 'border border-outline-variant bg-white text-on-surface-variant'
              )}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={cn(
                'hidden text-body-md md:inline',
                active ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
              )}
            >
              {step.label}
            </span>
            {i < steps.length - 1 ? (
              <span className="mx-1 hidden h-px w-8 bg-outline-variant md:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
