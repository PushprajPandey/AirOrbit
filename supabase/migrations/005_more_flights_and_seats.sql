INSERT INTO flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_type, base_price, origin_lat, origin_lon, dest_lat, dest_lon) VALUES
('SF103', 'DEL', 'BOM', (CURRENT_DATE + interval '1 day') + time '06:30', (CURRENT_DATE + interval '1 day') + time '08:45', 'A320', 4200, 28.6, 77.1, 19.1, 72.9),
('SF104', 'DEL', 'BOM', (CURRENT_DATE + interval '1 day') + time '18:15', (CURRENT_DATE + interval '1 day') + time '20:30', 'B737', 4800, 28.6, 77.1, 19.1, 72.9),
('SF203', 'BOM', 'BLR', (CURRENT_DATE + interval '1 day') + time '07:00', (CURRENT_DATE + interval '1 day') + time '08:25', 'A320', 3600, 19.1, 72.9, 13.2, 77.7),
('SF204', 'BOM', 'BLR', (CURRENT_DATE + interval '1 day') + time '19:45', (CURRENT_DATE + interval '1 day') + time '21:10', 'A321', 3950, 19.1, 72.9, 13.2, 77.7),
('SF303', 'DEL', 'BLR', (CURRENT_DATE + interval '1 day') + time '08:00', (CURRENT_DATE + interval '1 day') + time '10:15', 'A320', 5200, 28.6, 77.1, 13.2, 77.7),
('SF304', 'DEL', 'BLR', (CURRENT_DATE + interval '1 day') + time '17:30', (CURRENT_DATE + interval '1 day') + time '19:45', 'B787', 5800, 28.6, 77.1, 13.2, 77.7),
('SF403', 'BLR', 'HYD', (CURRENT_DATE + interval '2 days') + time '06:15', (CURRENT_DATE + interval '2 days') + time '07:20', 'ATR72', 2600, 13.2, 77.7, 17.4, 78.5),
('SF404', 'BLR', 'HYD', (CURRENT_DATE + interval '2 days') + time '20:00', (CURRENT_DATE + interval '2 days') + time '21:05', 'A320', 2900, 13.2, 77.7, 17.4, 78.5);

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
  FOR f IN SELECT id FROM flights WHERE flight_no IN ('SF103','SF104','SF203','SF204','SF303','SF304','SF403','SF404') LOOP
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
