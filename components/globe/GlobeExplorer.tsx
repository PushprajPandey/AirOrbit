'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlobeCanvas } from '@/components/globe/GlobeCanvas';
import { GlobeFallback } from '@/components/globe/GlobeFallback';
import { RoutePanel } from '@/components/globe/RoutePanel';

export function GlobeExplorer() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="md:col-span-3">
        <ErrorBoundary fallback={<GlobeFallback />}>
          <GlobeCanvas />
        </ErrorBoundary>
      </div>
      <div className="md:col-span-2">
        <RoutePanel />
      </div>
    </div>
  );
}

export default GlobeExplorer;
