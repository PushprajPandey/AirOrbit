import type { Seat } from '@/lib/supabase/types';
import type { SeatClass } from '@/lib/utils';

export const GRID_COLUMNS = ['A', 'B', 'C', 'D', 'E'] as const;

export function parseSeatLabel(seatNumber: string): { row: number; col: string } {
  const match = seatNumber.match(/^(\d+)([A-E])$/i);
  if (match?.[1] && match[2]) {
    return { row: Number(match[1]), col: match[2].toUpperCase() };
  }
  const legacy = seatNumber.match(/^([EBF])(\d+)$/i);
  if (legacy?.[1] && legacy[2]) {
    const map: Record<string, string> = { E: 'A', B: 'C', F: 'E' };
    return { row: Number(legacy[2]), col: map[legacy[1].toUpperCase()] ?? 'C' };
  }
  return { row: 0, col: 'C' };
}

export function groupSeatsByClass(seats: Seat[]): Record<SeatClass, Seat[]> {
  const groups: Record<SeatClass, Seat[]> = {
    economy: [],
    business: [],
    first: [],
  };
  for (const seat of seats) {
    groups[seat.class].push(seat);
  }
  for (const key of Object.keys(groups) as SeatClass[]) {
    groups[key].sort((a, b) => {
      const pa = parseSeatLabel(a.seat_number);
      const pb = parseSeatLabel(b.seat_number);
      return pa.row - pb.row || pa.col.localeCompare(pb.col);
    });
  }
  return groups;
}

export function buildSeatRows(seats: Seat[]): Map<number, Map<string, Seat>> {
  const rows = new Map<number, Map<string, Seat>>();
  for (const seat of seats) {
    const { row, col } = parseSeatLabel(seat.seat_number);
    if (!row) continue;
    if (!rows.has(row)) rows.set(row, new Map());
    rows.get(row)!.set(col, seat);
  }
  return rows;
}
