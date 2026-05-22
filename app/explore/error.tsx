'use client';

import { GlobeFallback } from '@/components/globe/GlobeFallback';
import { Button } from '@/components/ui/Button';

export default function ExploreError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-margin">
      <GlobeFallback />
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
