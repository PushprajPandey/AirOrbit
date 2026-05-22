import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="material-symbols-outlined text-6xl text-primary-container">
        flight
      </span>
      <h1 className="mt-4 text-headline-lg">Page not found</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-on-primary transition-colors hover:bg-primary/90"
      >
        Go back to search
      </Link>
    </div>
  );
}
