import { Skeleton } from '@/components/ui/Skeleton';

export default function MyBookingsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 md:px-margin">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-36 w-full rounded-xl" />
    </div>
  );
}
