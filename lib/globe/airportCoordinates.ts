import type { Airport } from '@/lib/stores/useGlobeStore';

export const AIRPORTS: Airport[] = [
  { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', lat: 28.6, lon: 77.1, isBookable: true },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', lat: 19.1, lon: 72.9, isBookable: true },
  { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', lat: 13.2, lon: 77.7, isBookable: true },
  { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', lat: 17.4, lon: 78.5, isBookable: true },
  { code: 'LHR', name: 'Heathrow', city: 'London', lat: 51.5, lon: -0.5, isBookable: false },
  { code: 'JFK', name: 'John F Kennedy', city: 'New York', lat: 40.6, lon: -73.8, isBookable: false },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', lat: 25.3, lon: 55.4, isBookable: false },
  { code: 'SIN', name: 'Changi', city: 'Singapore', lat: 1.4, lon: 103.8, isBookable: false },
];

export const ROUTES_MAP: Record<string, string[]> = {
  DEL: ['BOM', 'BLR'],
  BOM: ['DEL', 'BLR'],
  BLR: ['BOM', 'DEL', 'HYD'],
  HYD: ['BLR'],
};
