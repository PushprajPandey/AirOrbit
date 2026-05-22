# Internship assignment — completion checklist

## Tech stack

| Requirement | Status | Notes |
|-------------|--------|-------|
| Next.js 14+ App Router | ✅ | `app/` routes |
| Supabase PostgreSQL + Auth + Realtime | ✅ | Migrations 001–006 |
| Zustand + persist | ✅ | `useFlightStore`, `useUserStore` |
| Tailwind CSS | ✅ | Skybound / AirOrbit theme |
| next-pwa (bonus) | ✅ | Production only via `@ducanh2912/next-pwa` |

## Database schema

| Requirement | Status | Location |
|-------------|--------|----------|
| flights, seats, bookings, passengers, reschedules | ✅ | `001_schema.sql` |
| RLS on all tables | ✅ | `002_rls.sql` + anon read in `006` |
| `reserve_seat` RPC (race-safe) | ✅ | `FOR UPDATE SKIP LOCKED` in `003_functions.sql` |
| Cancel within 2h blocked at DB | ✅ | `cancel_booking` in `003_functions.sql` |
| Seed ≥8 flights, 4 routes, seat maps | ✅ | `004`, `005`, `006` calendar flights |
| Supabase Auth | ✅ | Login, signup, magic link |

## Tasks

### Task 01 — Search & booking

| Item | Status |
|------|--------|
| Search (origin, destination, date, passengers) | ✅ |
| Results with price, duration, class | ✅ |
| Passenger form (name, passport, nationality, DOB) | ✅ |
| Confirmation + PNR + seat | ✅ |
| Server-side Supabase client | ✅ |
| RPC before booking insert | ✅ |

### Task 02 — Seat map

| Item | Status |
|------|--------|
| Cabin grid rows × columns | ✅ |
| Color states available/selected/occupied | ✅ |
| Economy / business / first zones | ✅ |
| Supabase Realtime on seats | ✅ |
| Occupied tooltip (class + fee) | ✅ |
| Mobile scroll + touch | ✅ |

### Task 03 — Reschedule & cancel

| Item | Status |
|------|--------|
| My Bookings + status badges | ✅ |
| Reschedule same route + fee | ✅ |
| Cancel RPC + free seat | ✅ |
| 2-hour rule at DB | ✅ |
| Confirmation dialog | ✅ |

### Task 04 — Zustand

| Item | Status |
|------|--------|
| useFlightStore (search, flight, seats, step, passengers) | ✅ |
| persist + partialize (no passport in localStorage) | ✅ |
| useUserStore (session tokens only) | ✅ |
| Optimistic seat selection in store | ✅ |
| reset on logout / cancel | ✅ |

### Task 05 — PWA (bonus)

| Item | Status |
|------|--------|
| manifest.json + icons 192/512 | ✅ |
| Offline fallback page | ✅ |
| Install prompt | ✅ |
| My Bookings offline cache | ✅ |
| Lighthouse screenshot in README | ⚠️ | Add `docs/lighthouse-pwa.png` after deploy |

## Submission

| Item | Status |
|------|--------|
| Public GitHub repo | ⬜ | You push |
| `.env.example` | ✅ |
| `/supabase/migrations` | ✅ |
| Seed + test user in README | ✅ |
| README setup + Zustand explanation | ✅ |
| Vercel deploy URL | ⬜ | Deploy and paste in README |
| Descriptive commits | ⬜ | Use meaningful messages when pushing |

## Known trade-offs (documented in README)

- Class pricing via multipliers, not separate DB prices
- Reschedule does not auto-pick a new seat on the new flight
- Service role used server-side for public flight search (RLS anon policies in 006)
