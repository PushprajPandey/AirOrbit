import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flight, Seat, SeatClass } from '@/lib/supabase/types';

export type BookingStep = 'search' | 'seat' | 'passenger' | 'confirm';

export interface PassengerForm {
  fullName: string;
  nationality: string;
  dob: string;
  passportNo: string;
}

interface SearchQuery {
  origin: string;
  destination: string;
  date: string;
  passengerCount: number;
}

interface FlightState {
  searchQuery: SearchQuery;
  selectedFlight: Flight | null;
  selectedSeats: Seat[];
  selectedClass: SeatClass | null;
  bookingStep: BookingStep;
  passengers: PassengerForm[];
  pnrCode: string | null;
  lastBookingTotal: number;
  setSearch: (query: Partial<SearchQuery>) => void;
  setFlight: (flight: Flight | null) => void;
  toggleSeat: (seat: Seat) => void;
  setClass: (seatClass: SeatClass | null) => void;
  setStep: (step: BookingStep) => void;
  setPassenger: (index: number, form: Partial<PassengerForm>) => void;
  initPassengers: (count: number) => void;
  setBookingResult: (pnr: string, total: number) => void;
  resetBooking: () => void;
}

const initialSearch: SearchQuery = {
  origin: '',
  destination: '',
  date: '',
  passengerCount: 1,
};

const emptyPassenger = (): PassengerForm => ({
  fullName: '',
  nationality: '',
  dob: '',
  passportNo: '',
});

export const useFlightStore = create<FlightState>()(
  persist(
    (set, get) => ({
      searchQuery: initialSearch,
      selectedFlight: null,
      selectedSeats: [],
      selectedClass: null,
      bookingStep: 'search',
      passengers: [emptyPassenger()],
      pnrCode: null,
      lastBookingTotal: 0,
      setSearch: (query) =>
        set((s) => {
          const next = { ...s.searchQuery, ...query };
          const passengers =
            query.passengerCount !== undefined
              ? Array.from({ length: next.passengerCount }, (_, i) =>
                  s.passengers[i] ?? emptyPassenger()
                )
              : s.passengers;
          return { searchQuery: next, passengers };
        }),
      setFlight: (flight) => set({ selectedFlight: flight }),
      toggleSeat: (seat) =>
        set((s) => {
          if (s.selectedClass && seat.class !== s.selectedClass) {
            return s;
          }
          const limit = s.searchQuery.passengerCount;
          const exists = s.selectedSeats.find((x) => x.id === seat.id);
          if (exists) {
            return {
              selectedSeats: s.selectedSeats.filter((x) => x.id !== seat.id),
            };
          }
          if (s.selectedSeats.length >= limit) {
            return s;
          }
          return { selectedSeats: [...s.selectedSeats, seat] };
        }),
      setClass: (seatClass) =>
        set({ selectedClass: seatClass, selectedSeats: [] }),
      setStep: (step) => set({ bookingStep: step }),
      setPassenger: (index, form) =>
        set((s) => {
          const passengers = [...s.passengers];
          passengers[index] = { ...passengers[index]!, ...form };
          return { passengers };
        }),
      initPassengers: (count) =>
        set({
          passengers: Array.from({ length: count }, () => emptyPassenger()),
        }),
      setBookingResult: (pnr, total) =>
        set({ pnrCode: pnr, lastBookingTotal: total }),
      resetBooking: () =>
        set({
          selectedFlight: null,
          selectedSeats: [],
          selectedClass: null,
          bookingStep: 'search',
          passengers: [emptyPassenger()],
          pnrCode: null,
          lastBookingTotal: 0,
        }),
    }),
    {
      name: 'flight-store',
      skipHydration: true,
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeats: state.selectedSeats,
        selectedClass: state.selectedClass,
        bookingStep: state.bookingStep,
        passengers: state.passengers.map((p) => ({
          fullName: p.fullName,
          nationality: p.nationality,
          dob: p.dob,
        })),
        pnrCode: state.pnrCode,
        lastBookingTotal: state.lastBookingTotal,
      }),
    }
  )
);
