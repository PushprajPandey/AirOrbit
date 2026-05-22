'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 420,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              padding: 32,
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>AirOrbit</h1>
            <p style={{ margin: '0 0 20px', color: '#64748b' }}>
              Something went wrong. Please try again.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: '#0ea5e9',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
