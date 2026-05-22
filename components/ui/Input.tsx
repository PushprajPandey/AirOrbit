'use client';

import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-label-md uppercase tracking-wider text-on-surface-variant"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              {icon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-lg border border-outline-variant bg-white px-3 text-body-md outline-none transition-all duration-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/30',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
