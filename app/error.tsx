'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
      <div className="w-full rounded-xl border border-outline-variant bg-white p-8 text-center shadow-card">
        <h1 className="text-headline-md text-on-surface">Something went wrong</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/" className="text-body-md text-primary-container hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
