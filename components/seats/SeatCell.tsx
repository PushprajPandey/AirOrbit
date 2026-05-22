'use client';

import { cn } from '@/lib/utils';
import type { Seat } from '@/lib/supabase/types';

interface SeatCellProps {
  seat: Seat;
  selected: boolean;
  onToggle: (seat: Seat) => void;
}

export function SeatCell({ seat, selected, onToggle }: SeatCellProps) {
  const unavailable = !seat.is_available;
  const label = seat.seat_number.replace(/^[EBF]/i, '').padStart(2, '0');

  const tooltip = unavailable
    ? `${seat.class} · ${seat.seat_number} · extra fee ₹${Number(seat.extra_fee).toFixed(0)} (unavailable)`
    : `${seat.class} · ${seat.seat_number}`;

  return (
    <button
      type="button"
      disabled={unavailable}
      title={tooltip}
      aria-label={tooltip}
      onClick={() => onToggle(seat)}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded text-[11px] font-semibold transition-all duration-200',
        unavailable &&
          'cursor-not-allowed border border-outline-variant/50 bg-surface-container-highest text-outline',
        !unavailable &&
          !selected &&
          'border border-outline-variant bg-white text-on-surface-variant hover:border-primary-container hover:bg-primary-container/10',
        selected &&
          'border border-primary bg-primary-container text-white shadow-sm'
      )}
    >
      {unavailable ? (
        <span className="material-symbols-outlined text-[14px]">close</span>
      ) : (
        label
      )}
    </button>
  );
}
