'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { StoreHydration } from '@/components/providers/StoreHydration';
import { ToastProvider } from '@/components/ui/Toast';

const InstallPrompt = dynamic(
  () =>
    import('@/components/layout/InstallPrompt').then((m) => m.InstallPrompt),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <StoreHydration />
      <Header />
      <main>{children}</main>
      <InstallPrompt />
    </ToastProvider>
  );
}
