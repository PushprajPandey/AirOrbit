'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlightCard } from '@/components/flights/FlightCard';
import { SearchFilters } from '@/components/flights/SearchFilters';
import { SortBar } from '@/components/flights/SortBar';
import { useToast } from '@/components/ui/Toast';
import { computeClassPricing } from '@/lib/flights';
import type { ClassPricing, Flight } from '@/lib/supabase/types';
import { matchesTimeOfDay, type SeatClass, type TimeOfDay } from '@/lib/utils';

type SortKey = 'price' | 'duration' | 'departure';

interface FlightsResultsClientProps {
  malformed: boolean;
  flights: Flight[];
  searchLabel: string;
}

export function FlightsResultsClient({
  malformed,
  flights,
  searchLabel,
}: FlightsResultsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [sort, setSort] = useState<SortKey>('price');
  const [timeFilter, setTimeFilter] = useState<TimeOfDay>('all');
  const [classFilter, setClassFilter] = useState<SeatClass | 'all'>('all');
  const priceCeiling = useMemo(
    () => Math.max(...flights.map((f) => Number(f.base_price) * 3), 10000),
    [flights]
  );
  const [maxPrice, setMaxPrice] = useState(priceCeiling);

  useEffect(() => {
    setMaxPrice(priceCeiling);
  }, [priceCeiling]);

  useEffect(() => {
    if (malformed) {
      toast('Invalid search — please try again', 'error');
      router.replace('/');
    }
  }, [malformed, router, toast]);

  const pricingMap = useMemo(() => {
    const map: Record<string, ClassPricing> = {};
    for (const flight of flights) {
      map[flight.id] = computeClassPricing(flight);
    }
    return map;
  }, [flights]);

  const filtered = useMemo(() => {
    let list = [...flights];
    list = list.filter((f) => Number(f.base_price) <= maxPrice);
    list = list.filter((f) => matchesTimeOfDay(f.departs_at, timeFilter));
    return list;
  }, [flights, maxPrice, timeFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === 'departure') {
      copy.sort(
        (a, b) =>
          new Date(a.departs_at).getTime() - new Date(b.departs_at).getTime()
      );
    } else if (sort === 'duration') {
      copy.sort((a, b) => {
        const da =
          new Date(a.arrives_at).getTime() - new Date(a.departs_at).getTime();
        const db =
          new Date(b.arrives_at).getTime() - new Date(b.departs_at).getTime();
        return da - db;
      });
    } else {
      copy.sort((a, b) => Number(a.base_price) - Number(b.base_price));
    }
    return copy;
  }, [filtered, sort]);

  if (malformed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-margin">
      <div className="mb-6">
        <h1 className="text-headline-lg">Search results</h1>
        <p className="text-body-md text-on-surface-variant">{searchLabel}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <SearchFilters
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            classFilter={classFilter}
            onClassFilterChange={setClassFilter}
            maxPrice={maxPrice}
            priceCeiling={priceCeiling}
            onMaxPriceChange={setMaxPrice}
            resultCount={sorted.length}
          />
        </div>

        <div className="md:col-span-9">
          <div className="mb-4 flex justify-end">
            <SortBar active={sort} onChange={setSort} />
          </div>
          <div className="space-y-4">
            {sorted.length === 0 ? (
              <p className="rounded-xl border border-outline-variant bg-white p-8 text-center text-body-md text-on-surface-variant">
                No flights match your filters. Try a different time or price range.
              </p>
            ) : (
              sorted.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  pricing={pricingMap[flight.id] ?? computeClassPricing(flight)}
                  highlightClass={classFilter}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
