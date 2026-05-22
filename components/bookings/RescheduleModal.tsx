'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import type { Flight } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  currentFlight: Flight;
  alternatives: Flight[];
  onSuccess: () => void;
}

export function RescheduleModal({
  open,
  onClose,
  bookingId,
  currentFlight,
  alternatives,
  onSuccess,
}: RescheduleModalProps) {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = alternatives.find((f) => f.id === selectedId);
  const fareDiff =
    selected && Number(selected.base_price) > Number(currentFlight.base_price)
      ? Number(selected.base_price) - Number(currentFlight.base_price)
      : 0;

  useEffect(() => {
    if (!open) setSelectedId('');
  }, [open]);

  const handleReschedule = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newFlightId: selectedId }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok) {
        toast(json.error ?? 'Reschedule failed', 'error');
        return;
      }
      onSuccess();
      onClose();
      toast('Flight rescheduled', 'success');
    } catch {
      toast('Reschedule failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Reschedule flight">
      <Select
        label="New flight"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        options={alternatives.map((f) => ({
          value: f.id,
          label: `${f.flight_no} · ${f.origin}→${f.destination}`,
        }))}
      />
      {fareDiff > 0 ? (
        <p className="mt-3 text-body-md text-tertiary">
          +{formatCurrency(fareDiff)} fare difference
        </p>
      ) : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          loading={loading}
          disabled={!selectedId}
          onClick={handleReschedule}
        >
          Confirm reschedule
        </Button>
      </div>
    </Dialog>
  );
}
