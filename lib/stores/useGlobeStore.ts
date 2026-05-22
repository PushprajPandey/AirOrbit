import { create } from 'zustand';
import type { Flight, RouteFlight } from '@/lib/supabase/types';

export interface Airport {
  code: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  isBookable: boolean;
}

interface GlobeState {
  selectedOrigin: Airport | null;
  selectedDestination: Airport | null;
  hoveredAirport: Airport | null;
  routeFlights: RouteFlight[];
  isLoadingRoutes: boolean;
  setOrigin: (airport: Airport | null) => void;
  setDestination: (airport: Airport | null) => void;
  setHovered: (airport: Airport | null) => void;
  setRouteFlights: (flights: RouteFlight[]) => void;
  setLoadingRoutes: (loading: boolean) => void;
  clearSelection: () => void;
}

export const useGlobeStore = create<GlobeState>((set) => ({
  selectedOrigin: null,
  selectedDestination: null,
  hoveredAirport: null,
  routeFlights: [],
  isLoadingRoutes: false,
  setOrigin: (airport) => set({ selectedOrigin: airport }),
  setDestination: (airport) => set({ selectedDestination: airport }),
  setHovered: (airport) => set({ hoveredAirport: airport }),
  setRouteFlights: (flights) => set({ routeFlights: flights }),
  setLoadingRoutes: (loading) => set({ isLoadingRoutes: loading }),
  clearSelection: () =>
    set({
      selectedOrigin: null,
      selectedDestination: null,
      hoveredAirport: null,
      routeFlights: [],
      isLoadingRoutes: false,
    }),
}));
