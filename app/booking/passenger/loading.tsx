import { Skeleton } from '@/components/ui/Skeleton';

export default function PassengerLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 md:px-margin">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
