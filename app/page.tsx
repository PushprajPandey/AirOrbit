import { FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAirportCodes } from '@/lib/flights';

export default async function HomePage() {
  const supabase = createAdminClient();
  const { origins, destinations } = await getAirportCodes(supabase);

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-32 pt-12">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary-container blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-secondary-container blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-margin">
          <div className="mb-8 max-w-3xl">
            <h1 className="text-display-lg text-on-background">
              Effortless travel starts here.
            </h1>
            <p className="mt-2 max-w-xl text-body-lg text-on-surface-variant">
              Experience transparent flight management with AirOrbit&apos;s efficient
              booking engine.
            </p>
          </div>
          <FlightSearchForm origins={origins} destinations={destinations} />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-margin">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: 'schedule', title: 'Real-time seats', desc: 'Live availability on every flight' },
            { icon: 'public', title: 'Route explorer', desc: 'Discover routes on an interactive globe' },
            { icon: 'verified', title: 'Secure booking', desc: 'Protected with Supabase auth & RLS' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:border-outline"
            >
              <span className="material-symbols-outlined text-primary-container">
                {f.icon}
              </span>
              <h2 className="mt-3 text-headline-sm">{f.title}</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
