'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/components/layout/UserMenu';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Search' },
  { href: '/my-bookings', label: 'My Bookings' },
  { href: '/explore', label: 'Explore' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-margin">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-contain"
              priority
            />
            <span className="text-headline-sm font-bold text-primary">AirOrbit</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-label-md uppercase tracking-wider transition-colors duration-200 hover:text-primary-container',
                  pathname === link.href
                    ? 'border-b-2 border-primary-container pb-0.5 text-primary-container'
                    : 'text-on-surface-variant'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <UserMenu />
      </nav>
    </header>
  );
}
