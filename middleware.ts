import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CookieToSet } from '@/lib/supabase/cookies';
import type { Database } from '@/lib/supabase/types';

const AUTH_PATHS = ['/auth/login', '/auth/signup'];

function isProtected(pathname: string): boolean {
  if (pathname.startsWith('/booking')) return true;
  if (pathname.startsWith('/account')) return true;
  if (pathname === '/my-bookings') return true;
  if (pathname === '/explore') return true;
  return false;
}

function applyCors(response: NextResponse, request: NextRequest): NextResponse {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const preflight = applyCors(NextResponse.next(), request);
    if (request.method === 'OPTIONS') {
      return preflight;
    }
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && isProtected(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/api/')) {
    return applyCors(response, request);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|offline.html|sw.js|workbox-.*).*)',
  ],
};
