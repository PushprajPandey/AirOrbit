'use client';

import { AIRPORTS } from '@/lib/globe/airportCoordinates';
import { useGlobeStore } from '@/lib/stores/useGlobeStore';

export function GlobeFallback() {
  const { selectedOrigin, setOrigin, setDestination, clearSelection } =
    useGlobeStore();

  const handleClick = (code: string) => {
    const airport = AIRPORTS.find((a) => a.code === code);
    if (!airport?.isBookable) return;
    if (!selectedOrigin) {
      setOrigin(airport);
    } else {
      setDestination(airport);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-outline-variant bg-surface-container-low p-8">
      <svg viewBox="0 0 400 200" className="w-full max-w-md text-primary-container/30">
        <ellipse cx="200" cy="100" rx="180" ry="90" fill="currentColor" />
        <path
          d="M 40 100 Q 200 40 360 100"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2"
        />
      </svg>
      <p className="text-body-md text-on-surface-variant">
        WebGL unavailable — select airports below
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {AIRPORTS.filter((a) => a.isBookable).map((a) => (
          <button
            key={a.code}
            type="button"
            onClick={() => handleClick(a.code)}
            className="rounded-full border border-outline-variant bg-white px-4 py-2 text-body-md transition-colors hover:border-primary-container hover:text-primary-container"
          >
            {a.code}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={clearSelection}
        className="text-body-md text-primary-container hover:underline"
      >
        Clear selection
      </button>
    </div>
  );
}
