'use client';

import type { TimeOfDay } from '@/lib/utils';
import type { SeatClass } from '@/lib/utils';

interface SearchFiltersProps {
  timeFilter: TimeOfDay;
  onTimeFilterChange: (value: TimeOfDay) => void;
  classFilter: SeatClass | 'all';
  onClassFilterChange: (value: SeatClass | 'all') => void;
  maxPrice: number;
  priceCeiling: number;
  onMaxPriceChange: (value: number) => void;
  resultCount: number;
}

const TIME_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: 'all', label: 'All times' },
  { value: 'morning', label: 'Morning (5am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12–5pm)' },
  { value: 'evening', label: 'Evening (5pm+)' },
];

const CLASS_OPTIONS: { value: SeatClass | 'all'; label: string }[] = [
  { value: 'all', label: 'All classes' },
  { value: 'economy', label: 'Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

export function SearchFilters({
  timeFilter,
  onTimeFilterChange,
  classFilter,
  onClassFilterChange,
  maxPrice,
  priceCeiling,
  onMaxPriceChange,
  resultCount,
}: SearchFiltersProps) {
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-outline-variant bg-white p-4">
        <h2 className="text-headline-sm">Filters</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {resultCount} flight{resultCount !== 1 ? 's' : ''} found
        </p>

        <div className="mt-4">
          <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
            Departure time
          </span>
          <div className="mt-2 space-y-1">
            {TIME_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-surface-container-low"
              >
                <input
                  type="radio"
                  name="time"
                  checked={timeFilter === o.value}
                  onChange={() => onTimeFilterChange(o.value)}
                  className="text-primary-container"
                />
                <span className="text-body-md">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
            Travel class
          </span>
          <div className="mt-2 space-y-1">
            {CLASS_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-surface-container-low"
              >
                <input
                  type="radio"
                  name="class"
                  checked={classFilter === o.value}
                  onChange={() => onClassFilterChange(o.value)}
                  className="text-primary-container"
                />
                <span className="text-body-md">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <label
              htmlFor="price-range-input"
              className="text-label-md uppercase tracking-wider text-on-surface-variant cursor-pointer"
            >
              Max price
            </label>
            <span className="text-label-md text-primary-container">
              ₹{maxPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            id="price-range-input"
            min={1000}
            max={priceCeiling}
            step={500}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="mt-2 h-1.5 w-full cursor-pointer accent-primary-container"
          />
        </div>
      </div>
    </aside>
  );
}
