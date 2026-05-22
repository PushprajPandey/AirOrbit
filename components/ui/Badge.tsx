import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface-variant',
  success: 'bg-success-container text-success',
  warning: 'bg-tertiary-container/20 text-tertiary',
  error: 'bg-error-container text-error',
  info: 'bg-secondary-container text-secondary',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-badge-sm',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
