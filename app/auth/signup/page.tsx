'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createBrowserClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const loginHref = redirectParam
    ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
    : '/auth/login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setMessageType('error');
      setMessage('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: email.split('@')[0] ?? 'Traveler',
        },
      },
    });
    setLoading(false);

    if (error) {
      setMessageType('error');
      setMessage(error.message);
      return;
    }

    const redirect = redirectParam ?? '/';

    if (data.session) {
      router.push(redirect);
      router.refresh();
      return;
    }

    setMessageType('success');
    setMessage(
      'Account created. Check your email to confirm your address, then sign in.'
    );
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-xl border border-outline-variant bg-white p-8 shadow-card">
        <h1 className="text-headline-lg text-primary">Create your account</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Join AirOrbit to book flights, pick seats, and manage trips
        </p>
        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message ? (
            <p
              className={
                messageType === 'success'
                  ? 'text-body-md text-success'
                  : 'text-body-md text-error'
              }
            >
              {message}
            </p>
          ) : null}
          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link
            href={loginHref}
            className="font-medium text-primary-container hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
