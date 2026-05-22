import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking } from '@/lib/supabase/types';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import { useGlobeStore } from '@/lib/stores/useGlobeStore';

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  session: SessionTokens | null;
  cachedBookings: Booking[];
  setSession: (session: SessionTokens | null) => void;
  setCachedBookings: (bookings: Booking[]) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      session: null,
      cachedBookings: [],
      setSession: (session) => set({ session }),
      setCachedBookings: (bookings) => set({ cachedBookings: bookings }),
      clearUser: () => set({ session: null, cachedBookings: [] }),
    }),
    {
      name: 'user-store',
      skipHydration: true,
      partialize: (state) => ({
        session: state.session,
        cachedBookings: state.cachedBookings,
      }),
    }
  )
);

export function resetAll(): void {
  useFlightStore.getState().resetBooking();
  useFlightStore.persist.clearStorage();
  useUserStore.getState().clearUser();
  useUserStore.persist.clearStorage();
  useGlobeStore.getState().clearSelection();
}
