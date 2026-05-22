'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { resetAll } from '@/lib/stores/useUserStore';

interface CancelDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
}

export function CancelDialog({
  open,
  onClose,
  bookingId,
  onSuccess,
}: CancelDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const handleCancel = async () => {
    setLoading(true);
    setBlockMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
      };
      if (!res.ok) {
        if (res.status === 422) {
          setBlockMessage(
            json.error ??
              'Cancellations are not allowed within 2 hours of departure'
          );
          return;
        }
        toast(json.error ?? 'Cancellation failed', 'error');
        return;
      }
      resetAll();
      onSuccess();
      onClose();
      toast('Booking cancelled', 'success');
    } catch {
      toast('Cancellation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Cancel booking?">
      <p className="text-body-md text-on-surface-variant">
        This will release your seat. This action cannot be undone.
      </p>
      {blockMessage ? (
        <p className="mt-3 rounded-lg bg-error-container px-3 py-2 text-body-md text-error">
          {blockMessage}
        </p>
      ) : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Keep booking
        </Button>
        <Button variant="primary" loading={loading} onClick={handleCancel}>
          Confirm cancel
        </Button>
      </div>
    </Dialog>
  );
}
