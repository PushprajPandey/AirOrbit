'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import type { Flight, Seat } from '@/lib/supabase/types';

export interface BoardingPassData {
  pnr: string;
  flight: Flight;
  seats: Seat[];
  passengers: { fullName: string }[];
  totalPrice: number;
}

interface BoardingPassTicketProps {
  data: BoardingPassData;
}

export function BoardingPassTicket({ data }: BoardingPassTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const payload = JSON.stringify({
      pnr: data.pnr,
      flight: data.flight.flight_no,
      route: `${data.flight.origin}-${data.flight.destination}`,
    });
    void QRCode.toDataURL(payload, { width: 160, margin: 1 }).then(setQrUrl);
  }, [data]);

  const downloadPdf = async () => {
    const el = ticketRef.current;
    if (!el) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`AirOrbit-${data.pnr}.pdf`);
  };

  const primaryPassenger = data.passengers[0]?.fullName ?? 'Passenger';
  const seatList = data.seats.map((s) => s.seat_number).join(', ');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10">
          <span className="material-symbols-outlined text-4xl text-primary-container">
            check_circle
          </span>
        </div>
        <h1 className="text-headline-lg">Booking confirmed</h1>
        <p className="text-body-md text-on-surface-variant">
          Your e-ticket is ready to download
        </p>
      </div>

      <div
        ref={ticketRef}
        className="mx-auto max-w-4xl overflow-hidden rounded-xl border-2 border-outline-variant bg-white shadow-card"
      >
        <div className="flex">
          <div className="w-3 bg-tertiary-container" />
          <div className="flex flex-1 flex-col md:flex-row">
            <div className="flex-1 border-b border-dashed border-outline-variant p-6 md:border-b-0 md:border-r">
              <div className="flex items-center gap-2 bg-tertiary-container px-4 py-2 text-on-surface">
                <span className="material-symbols-outlined text-lg">flight</span>
                <span className="text-label-md font-bold uppercase tracking-wider">
                  Airlines ticket
                </span>
                <span className="ml-auto text-label-md font-bold uppercase">
                  Boarding pass
                </span>
              </div>

              <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-label-md uppercase text-on-surface-variant">
                      Flight
                    </p>
                    <p className="text-headline-sm font-bold">{data.flight.flight_no}</p>
                  </div>
                  <div className="rounded-lg border border-primary-container bg-primary-container/5 px-4 py-2 text-center">
                    <p className="text-label-md uppercase text-primary">PNR</p>
                    <p className="font-mono text-headline-md tracking-widest text-primary">
                      {data.pnr}
                    </p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between rounded-lg border border-outline-variant/40 bg-surface-container-low p-4">
                  <div>
                    <p className="text-display-lg font-bold leading-none">
                      {data.flight.origin}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {formatTime(data.flight.departs_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <span className="material-symbols-outlined rotate-90 text-primary-container">
                      flight
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-display-lg font-bold leading-none">
                      {data.flight.destination}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {formatTime(data.flight.arrives_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-body-md md:grid-cols-4">
                  <div>
                    <p className="text-label-md uppercase text-on-surface-variant">
                      Passenger
                    </p>
                    <p className="font-semibold uppercase">{primaryPassenger}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase text-on-surface-variant">
                      Seats
                    </p>
                    <p className="font-semibold">{seatList}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase text-on-surface-variant">
                      Date
                    </p>
                    <p className="font-semibold">{formatDate(data.flight.departs_at)}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase text-on-surface-variant">
                      Total paid
                    </p>
                    <p className="font-semibold text-primary-container">
                      {formatCurrency(data.totalPrice)}
                    </p>
                  </div>
                </div>

                {data.passengers.length > 1 ? (
                  <p className="mt-4 text-body-md text-on-surface-variant">
                    All passengers:{' '}
                    {data.passengers.map((p) => p.fullName).join(' · ')}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 bg-surface-container-low p-6 md:w-48">
              {qrUrl ? (
                <img src={qrUrl} alt="Booking QR code" className="h-36 w-36 rounded-lg" />
              ) : (
                <div className="h-36 w-36 animate-pulse rounded-lg bg-surface-container" />
              )}
              <p className="text-center text-label-md uppercase tracking-wider text-on-surface-variant">
                Scan at gate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={downloadPdf}>Download PDF</Button>
        {qrUrl ? (
          <a href={qrUrl} download={`AirOrbit-${data.pnr}-qr.png`}>
            <Button variant="secondary" type="button">
              Download QR
            </Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}
