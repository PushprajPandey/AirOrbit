const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/flights.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'supabase-flights',
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
    ],
  },
});

function validateEnv() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = required.filter((k) => !process.env[k]?.trim());
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

validateEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xqkefyodckoxszqmlpnp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;",
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports =
  process.env.NODE_ENV === 'production' ? withPWA(nextConfig) : nextConfig;
