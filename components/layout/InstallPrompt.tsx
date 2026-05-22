'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pwa-prompt-shown')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    sessionStorage.setItem('pwa-prompt-shown', '1');
    setVisible(false);
  };

  const dismiss = () => {
    sessionStorage.setItem('pwa-prompt-shown', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-xl border border-outline-variant bg-white p-4 shadow-card md:left-auto">
      <p className="text-body-md text-on-surface">Install AirOrbit for quick access</p>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={dismiss}>
          Later
        </Button>
        <Button onClick={install}>Install</Button>
      </div>
    </div>
  );
}
