import { Skeleton } from '@/components/ui/Skeleton';

export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-margin">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <Skeleton className="h-[300px] md:col-span-3 md:min-h-[480px]" />
        <Skeleton className="h-64 md:col-span-2" />
      </div>
    </div>
  );
}
