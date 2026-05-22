-- Allow browsing flights & seats without signing in (search + seat map)
DROP POLICY IF EXISTS flights_select_anon ON flights;
CREATE POLICY flights_select_anon ON flights
  FOR SELECT TO anon
  USING (status = 'scheduled');

DROP POLICY IF EXISTS seats_select_anon ON seats;
CREATE POLICY seats_select_anon ON seats
  FOR SELECT TO anon
  USING (true);

-- Seed morning + evening flights for the next 30 calendar days (Asia/Kolkata)
INSERT INTO flights (
  flight_no,
  origin,
  destination,
  departs_at,
  arrives_at,
  aircraft_type,
  base_price,
  origin_lat,
  origin_lon,
  dest_lat,
  dest_lon
)
SELECT
  'CAL-' || r.origin || '-' || r.destination || '-' || to_char(d, 'YYYYMMDD') || '-' || r.slot,
  r.origin,
  r.destination,
  ((d::timestamp + r.depart_time) AT TIME ZONE 'Asia/Kolkata'),
  ((d::timestamp + r.arrive_time) AT TIME ZONE 'Asia/Kolkata'),
  r.aircraft,
  r.base_price,
  r.origin_lat,
  r.origin_lon,
  r.dest_lat,
  r.dest_lon
FROM generate_series(
  (timezone('Asia/Kolkata', now())::date),
  (timezone('Asia/Kolkata', now())::date + 30),
  interval '1 day'
) AS d
CROSS JOIN (
  VALUES
    ('DEL', 'BOM', 'M', time '06:30', time '08:45', 'A320', 4200::numeric, 28.6, 77.1, 19.1, 72.9),
    ('DEL', 'BOM', 'E', time '18:15', time '20:30', 'B737', 4800::numeric, 28.6, 77.1, 19.1, 72.9),
    ('BOM', 'BLR', 'M', time '07:00', time '08:25', 'A320', 3600::numeric, 19.1, 72.9, 13.2, 77.7),
    ('BOM', 'BLR', 'E', time '19:45', time '21:10', 'A321', 3950::numeric, 19.1, 72.9, 13.2, 77.7),
    ('DEL', 'BLR', 'M', time '08:00', time '10:15', 'A320', 5200::numeric, 28.6, 77.1, 13.2, 77.7),
    ('DEL', 'BLR', 'E', time '17:30', time '19:45', 'B787', 5800::numeric, 28.6, 77.1, 13.2, 77.7),
    ('BLR', 'HYD', 'M', time '06:15', time '07:20', 'ATR72', 2600::numeric, 13.2, 77.7, 17.4, 78.5),
    ('BLR', 'HYD', 'E', time '20:00', time '21:05', 'A320', 2900::numeric, 13.2, 77.7, 17.4, 78.5)
) AS r(origin, destination, slot, depart_time, arrive_time, aircraft, base_price, origin_lat, origin_lon, dest_lat, dest_lon)
WHERE NOT EXISTS (
  SELECT 1
  FROM flights existing
  WHERE existing.flight_no =
    'CAL-' || r.origin || '-' || r.destination || '-' || to_char(d, 'YYYYMMDD') || '-' || r.slot
);

-- Seats for newly inserted calendar flights
DO $$
DECLARE
  f RECORD;
  r int;
  c text;
  cols text[] := ARRAY['A','B','C','D','E'];
  seat_class text;
  row_start int;
  row_end int;
BEGIN
  FOR f IN
    SELECT id FROM flights WHERE flight_no LIKE 'CAL-%'
  LOOP
    FOR seat_class, row_start, row_end IN
      SELECT * FROM (VALUES
        ('first', 1, 2),
        ('business', 3, 5),
        ('economy', 6, 14)
      ) AS t(c, rs, re)
    LOOP
      FOR r IN row_start..row_end LOOP
        FOREACH c IN ARRAY cols LOOP
          INSERT INTO seats (flight_id, seat_number, class, extra_fee)
          VALUES (f.id, r || c, seat_class, 0)
          ON CONFLICT (flight_id, seat_number) DO NOTHING;
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
