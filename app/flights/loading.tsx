import { Skeleton } from '@/components/ui/Skeleton';

export default function FlightsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 md:px-margin">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
