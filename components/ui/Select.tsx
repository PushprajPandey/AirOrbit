'use client';

import { cn } from '@/lib/utils';
import { type SelectHTMLAttributes, forwardRef, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, icon, options, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-label-md uppercase tracking-wider text-on-surface-variant"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-outline">
              {icon}
            </span>
          ) : null}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-10 w-full appearance-none rounded-lg border border-outline-variant bg-white px-3 text-body-md outline-none transition-all duration-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/30',
              icon && 'pl-10',
              className
            )}
            {...props}
          >
          <option value="">Select...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    );
  }
);

Select.displayName = 'Select';
