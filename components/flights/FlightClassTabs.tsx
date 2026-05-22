'use client';

import { cn, formatCurrency, type SeatClass } from '@/lib/utils';
import type { ClassPricing } from '@/lib/supabase/types';

interface FlightClassTabsProps {
  pricing: ClassPricing;
  activeClass: SeatClass | null;
  flightId: string;
  onClassSelect: (seatClass: SeatClass) => void;
}

const TABS: { key: SeatClass; label: string }[] = [
  { key: 'economy', label: 'Economy' },
  { key: 'business', label: 'Business' },
  { key: 'first', label: 'First Class' },
];

export function FlightClassTabs({
  pricing,
  activeClass,
  flightId,
  onClassSelect,
}: FlightClassTabsProps) {
  return (
    <div className="flex gap-4 border-t border-outline-variant/60 pt-3">
      {TABS.map((tab) => {
        const active = activeClass === tab.key;
        return (
          <button
            key={`${flightId}-${tab.key}`}
            type="button"
            onClick={() => onClassSelect(tab.key)}
            className={cn(
              'flex flex-col items-start pb-1 transition-all duration-200',
              active
                ? 'border-b-2 border-primary-container font-semibold text-primary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <span className="text-label-md uppercase tracking-wider">{tab.label}</span>
            <span className={cn('text-body-md', active && 'font-bold')}>
              {formatCurrency(pricing[tab.key])}
            </span>
          </button>
        );
      })}
    </div>
  );
}
