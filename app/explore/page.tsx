import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AIRPORTS } from '@/lib/globe/airportCoordinates';

const GlobeExplorer = dynamic(() => import('@/components/globe/GlobeExplorer'), {
  ssr: false,
  loading: () => <ExploreFallback />,
});

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-margin">
      <h1 className="text-headline-lg">Route explorer</h1>
      <p className="mt-1 text-body-md text-on-surface-variant">
        Click airports on the globe to discover direct routes
      </p>
      <div className="mt-6">
        <Suspense fallback={<ExploreFallback />}>
          <GlobeExplorer />
        </Suspense>
      </div>
      <noscript>
        <ExploreStaticList />
      </noscript>
    </div>
  );
}

function ExploreFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="h-[300px] animate-pulse rounded-xl bg-surface-container md:col-span-3 md:min-h-[480px]" />
      <div className="h-64 animate-pulse rounded-xl bg-surface-container md:col-span-2" />
    </div>
  );
}

function ExploreStaticList() {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {AIRPORTS.filter((a) => a.isBookable).map((a) => (
        <li key={a.code}>
          <a href={`/flights?origin=${a.code}`}>{a.code}</a>
        </li>
      ))}
    </ul>
  );
}
