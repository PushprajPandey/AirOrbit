import Link from 'next/link';
import { AIRPORTS } from '@/lib/globe/airportCoordinates';

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <span className="material-symbols-outlined text-5xl text-outline">
        wifi_off
      </span>
      <h1 className="mt-4 text-headline-lg">You are offline</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        AirOrbit needs a connection for live flights and the globe explorer.
      </p>
      <div className="mt-8 rounded-xl border border-outline-variant bg-white p-6 text-left">
        <p className="text-label-md uppercase tracking-wider text-on-surface-variant">
          Bookable airports
        </p>
        <ul className="mt-3 space-y-2">
          {AIRPORTS.filter((a) => a.isBookable).map((a) => (
            <li key={a.code}>
              <Link
                href="/"
                className="text-body-md text-primary-container hover:underline"
              >
                {a.code} — {a.city}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/" className="mt-6 inline-block text-primary-container hover:underline">
        Retry when online
      </Link>
    </div>
  );
}
