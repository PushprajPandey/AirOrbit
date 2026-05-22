'use client';

import { useEffect } from 'react';
import { useFlightStore } from '@/lib/stores/useFlightStore';
import { useUserStore } from '@/lib/stores/useUserStore';

export function StoreHydration() {
  useEffect(() => {
    void useFlightStore.persist.rehydrate();
    void useUserStore.persist.rehydrate();
  }, []);
  return null;
}
