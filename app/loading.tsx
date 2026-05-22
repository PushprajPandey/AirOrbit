import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-margin">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
