import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatDuration(departs: string, arrives: string): string {
  const ms = new Date(arrives).getTime() - new Date(departs).getTime();
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

export function generatePnr(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
}

export type SeatClass = 'economy' | 'business' | 'first';

const CLASS_MULTIPLIERS: Record<SeatClass, number> = {
  economy: 1,
  business: 1.6,
  first: 2.8,
};

export function classBasePrice(basePrice: number, seatClass: SeatClass): number {
  return Math.round(basePrice * CLASS_MULTIPLIERS[seatClass]);
}

export function classTicketPrice(basePrice: number, seatClass: SeatClass): number {
  return classBasePrice(basePrice, seatClass);
}

export function totalBookingPrice(
  basePrice: number,
  seatClass: SeatClass,
  passengerCount: number
): number {
  return classTicketPrice(basePrice, seatClass) * passengerCount;
}

export type TimeOfDay = 'all' | 'morning' | 'afternoon' | 'evening';

export function getTimeOfDay(iso: string): Exclude<TimeOfDay, 'all'> {
  const hour = new Date(iso).getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

export function matchesTimeOfDay(iso: string, filter: TimeOfDay): boolean {
  if (filter === 'all') return true;
  return getTimeOfDay(iso) === filter;
}

/** Calendar-day bounds in IST for matching flight departures */
export function getSearchDayBoundsIso(date: string): { start: string; end: string } {
  return {
    start: `${date}T00:00:00+05:30`,
    end: `${date}T23:59:59.999+05:30`,
  };
}
