'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RouteFlightCard } from '@/components/globe/RouteFlightCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { AIRPORTS } from '@/lib/globe/airportCoordinates';
import { fetchDestinationsFromOrigin } from '@/lib/globe/fetchDestinations';
import { haversineKm } from '@/lib/globe/haversine';
import { createBrowserClient } from '@/lib/supabase/client';
import { useGlobeStore } from '@/lib/stores/useGlobeStore';

export function RoutePanel() {
  const {
    selectedOrigin,
    selectedDestination,
    routeFlights,
    isLoadingRoutes,
    setDestination,
    clearSelection,
  } = useGlobeStore();

  const [destCodes, setDestCodes] = useState<string[]>([]);
  const [loadingDests, setLoadingDests] = useState(false);

  useEffect(() => {
    if (!selectedOrigin) {
      setDestCodes([]);
      return;
    }
    setLoadingDests(true);
    const supabase = createBrowserClient();
    void fetchDestinationsFromOrigin(supabase, selectedOrigin.code).then((codes) => {
      setDestCodes(codes);
      setLoadingDests(false);
    });
  }, [selectedOrigin]);

  if (!selectedOrigin) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-outline-variant bg-white p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-primary-container/40">
          public
        </span>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Click any airport to start exploring routes
        </p>
      </div>
    );
  }

  if (selectedOrigin && !selectedDestination) {
    return (
      <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-6">
        <div>
          <p className="text-headline-sm font-semibold">{selectedOrigin.code}</p>
          <p className="text-body-md text-on-surface-variant">
            {selectedOrigin.name} · {selectedOrigin.city}
          </p>
        </div>
        <p className="text-body-md text-on-surface-variant">Now select a destination</p>
        {loadingDests ? (
          <Skeleton className="h-10 w-full" />
        ) : destCodes.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            No scheduled routes from this airport yet.
          </p>
        ) : (
        <div className="flex flex-wrap gap-2">
          {destCodes.map((code) => {
            const airport = AIRPORTS.find((a) => a.code === code);
            if (!airport) return null;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setDestination(airport)}
                className="rounded-full border border-outline-variant px-4 py-2 text-body-md transition-all hover:border-primary-container hover:text-primary-container"
              >
                {code}
              </button>
            );
          })}
        </div>
        )}
        <ClearButton onClear={clearSelection} />
      </div>
    );
  }

  if (!selectedOrigin || !selectedDestination) return null;

  const distance = haversineKm(
    selectedOrigin.lat,
    selectedOrigin.lon,
    selectedDestination.lat,
    selectedDestination.lon
  );

  if (isLoadingRoutes) {
    return (
      <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <ClearButton onClear={clearSelection} />
      </div>
    );
  }

  if (routeFlights.length === 0) {
    return (
      <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-6 text-center">
        <p className="text-headline-sm">No direct flights on this route</p>
        <Link href="/" className="text-primary-container hover:underline">
          Search all flights →
        </Link>
        <ClearButton onClear={clearSelection} />
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto rounded-xl border border-outline-variant bg-white p-6">
      <div>
        <p className="text-headline-sm font-semibold">
          {selectedOrigin.code} → {selectedDestination.code}
        </p>
        <p className="text-body-md text-on-surface-variant">~{distance} km</p>
      </div>
      {routeFlights.map((f) => (
        <RouteFlightCard key={f.id} flight={f} />
      ))}
      <ClearButton onClear={clearSelection} />
    </div>
  );
}

function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="text-body-md text-primary-container transition-colors hover:underline"
    >
      Clear selection
    </button>
  );
}
