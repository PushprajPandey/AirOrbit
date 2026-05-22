'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const signUpHref = redirectParam
    ? `/auth/signup?redirect=${encodeURIComponent(redirectParam)}`
    : '/auth/signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    const redirect = redirectParam ?? '/';
    router.push(redirect);
    router.refresh();
  };

  const handleMagicLink = async () => {
    setLoading(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    setMessage(error ? error.message : 'Check your email for the login link');
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-xl border border-outline-variant bg-white p-8 shadow-card">
        <h1 className="text-headline-lg text-primary">Sign in to AirOrbit</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Access bookings, seat selection, and route explorer
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {message ? (
            <p className="text-body-md text-error">{message}</p>
          ) : null}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleMagicLink}
            disabled={!email || loading}
          >
            Send magic link
          </Button>
        </form>
        <div className="mt-6 space-y-3 border-t border-outline-variant pt-6">
          <p className="text-center text-body-md text-on-surface-variant">
            New to AirOrbit?
          </p>
          <Link href={signUpHref} className="block">
            <Button type="button" variant="outline" className="w-full">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
