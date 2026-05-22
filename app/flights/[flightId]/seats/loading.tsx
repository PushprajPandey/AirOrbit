import { Skeleton } from '@/components/ui/Skeleton';

export default function SeatsLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 md:px-margin">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-[360px] w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  );
}
