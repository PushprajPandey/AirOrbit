'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { useFlightStore } from '@/lib/stores/useFlightStore';

interface FlightSearchFormProps {
  origins: string[];
  destinations: string[];
}

export function FlightSearchForm({ origins, destinations }: FlightSearchFormProps) {
  const router = useRouter();
  const searchQuery = useFlightStore((s) => s.searchQuery);
  const setSearch = useFlightStore((s) => s.setSearch);

  const [origin, setOrigin] = useState(searchQuery.origin);
  const [destination, setDestination] = useState(searchQuery.destination);
  const [date, setDate] = useState(searchQuery.date);
  const [passengerCount, setPassengerCount] = useState(
    String(searchQuery.passengerCount || 1)
  );

  const originOptions = origins.map((o) => ({ value: o, label: o }));
  const destOptions = destinations.map((d) => ({ value: d, label: d }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    const count = Number(passengerCount) || 1;
    setSearch({
      origin,
      destination,
      date,
      passengerCount: count,
    });
    useFlightStore.getState().initPassengers(count);
    const params = new URLSearchParams({
      origin,
      destination,
      date,
      passengers: passengerCount,
    });
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 items-end gap-4 rounded-xl border border-outline-variant bg-white p-6 shadow-card md:grid-cols-5"
    >
      <Select
        label="Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        options={originOptions}
        icon={
          <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
        }
      />
      <Select
        label="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        options={destOptions}
        icon={
          <span className="material-symbols-outlined text-[20px]">flight_land</span>
        }
      />
      <Input
        label="Date"
        type="date"
        value={date}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        label="Passengers"
        type="number"
        min={1}
        max={9}
        value={passengerCount}
        onChange={(e) => setPassengerCount(e.target.value)}
      />
      <Button type="submit" className="w-full md:w-auto">
        Search Flights
      </Button>
    </form>
  );
}
