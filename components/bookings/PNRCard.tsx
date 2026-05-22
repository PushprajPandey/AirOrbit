import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface PNRCardProps {
  pnr: string;
  totalPrice: number;
  flightNo: string;
  route: string;
}

export function PNRCard({ pnr, totalPrice, flightNo, route }: PNRCardProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-white p-8 text-center shadow-card">
      <Badge variant="success">Confirmed</Badge>
      <p className="mt-4 text-label-md uppercase tracking-wider text-on-surface-variant">
        Your PNR
      </p>
      <p className="mt-2 font-mono text-display-lg tracking-widest text-primary">
        {pnr}
      </p>
      <p className="mt-4 text-body-lg text-on-surface">
        {flightNo} · {route}
      </p>
      <p className="mt-2 text-headline-md font-bold text-primary-container">
        {formatCurrency(totalPrice)}
      </p>
    </div>
  );
}
