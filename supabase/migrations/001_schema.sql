CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_no text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departs_at timestamptz NOT NULL,
  arrives_at timestamptz NOT NULL,
  aircraft_type text,
  status text NOT NULL DEFAULT 'scheduled',
  base_price numeric NOT NULL CHECK (base_price > 0),
  origin_lat numeric,
  origin_lon numeric,
  dest_lat numeric,
  dest_lon numeric
);

CREATE TABLE seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id uuid NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  seat_number text NOT NULL,
  class text NOT NULL CHECK (class IN ('economy', 'business', 'first')),
  is_available boolean NOT NULL DEFAULT true,
  extra_fee numeric NOT NULL DEFAULT 0,
  UNIQUE(flight_id, seat_number)
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id uuid NOT NULL REFERENCES flights(id),
  seat_id uuid NOT NULL REFERENCES seats(id),
  status text NOT NULL CHECK (status IN ('confirmed', 'rescheduled', 'cancelled')) DEFAULT 'confirmed',
  booked_at timestamptz NOT NULL DEFAULT now(),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  pnr_code text NOT NULL UNIQUE
);

CREATE TABLE passengers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  passport_no text NOT NULL,
  nationality text NOT NULL,
  dob date NOT NULL
);

CREATE TABLE reschedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  old_flight_id uuid NOT NULL REFERENCES flights(id),
  new_flight_id uuid NOT NULL REFERENCES flights(id),
  requested_at timestamptz NOT NULL DEFAULT now(),
  fee_charged numeric NOT NULL DEFAULT 0
);

CREATE INDEX idx_flights_route ON flights(origin, destination, departs_at);
CREATE INDEX idx_seats_flight ON seats(flight_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
