'use client';

import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary-container',
  secondary:
    'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-outline',
  outline:
    'bg-white border border-outline-variant text-on-surface hover:border-outline',
  ghost: 'bg-transparent text-primary-container hover:bg-surface-container-low',
  inverted:
    'bg-inverse-surface text-inverse-on-surface hover:opacity-90',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-body-md font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
