'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { resetAll } from '@/lib/stores/useUserStore';
import { cn } from '@/lib/utils';

interface UserProfile {
  email: string;
  initial: string;
  firstName: string;
}

export function UserMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u?.email) {
        setUser(null);
        return;
      }
      const meta = u.user_metadata as { full_name?: string; first_name?: string };
      const fullName = meta.full_name ?? meta.first_name ?? u.email.split('@')[0] ?? 'U';
      const firstName = fullName.split(' ')[0] ?? 'U';
      setUser({
        email: u.email,
        initial: firstName.charAt(0).toUpperCase(),
        firstName,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      if (!u?.email) {
        setUser(null);
        return;
      }
      const meta = u.user_metadata as { full_name?: string; first_name?: string };
      const fullName = meta.full_name ?? meta.first_name ?? u.email.split('@')[0] ?? 'U';
      const firstName = fullName.split(' ')[0] ?? 'U';
      setUser({
        email: u.email,
        initial: firstName.charAt(0).toUpperCase(),
        firstName,
      });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const signOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    resetAll();
    setUser(null);
    setOpen(false);
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="text-body-md text-on-surface-variant transition-colors hover:text-primary-container"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg bg-primary px-3 py-1.5 text-body-md text-on-primary"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-container bg-secondary-container text-sm font-bold text-primary transition-all hover:scale-105',
          open && 'ring-2 ring-primary-container/40'
        )}
        aria-label="Open profile menu"
      >
        {user.initial}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-outline-variant bg-white py-2 shadow-card">
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="font-semibold">{user.firstName}</p>
            <p className="truncate text-body-md text-on-surface-variant">{user.email}</p>
          </div>
          <Link
            href="/my-bookings"
            className="block px-4 py-2 text-body-md hover:bg-surface-container-low"
            onClick={() => setOpen(false)}
          >
            My bookings
          </Link>
          <Link
            href="/account/payments"
            className="block px-4 py-2 text-body-md hover:bg-surface-container-low"
            onClick={() => setOpen(false)}
          >
            Payment history
          </Link>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-body-md text-error hover:bg-error-container/30"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
