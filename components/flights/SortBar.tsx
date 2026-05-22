'use client';

import { cn } from '@/lib/utils';

type SortKey = 'price' | 'duration' | 'departure';

interface SortBarProps {
  active: SortKey;
  onChange: (key: SortKey) => void;
}

const options: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Cheapest' },
  { key: 'duration', label: 'Fastest' },
  { key: 'departure', label: 'Earliest' },
];

export function SortBar({ active, onChange }: SortBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-body-md transition-all duration-200',
            active === o.key
              ? 'border-primary-container bg-primary-container/10 text-primary-container'
              : 'border-outline-variant text-on-surface-variant hover:border-outline'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
