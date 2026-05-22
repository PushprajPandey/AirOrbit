INSERT INTO flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_type, base_price, origin_lat, origin_lon, dest_lat, dest_lon) VALUES
('SF101', 'DEL', 'BOM', NOW() + interval '1 day', NOW() + interval '1 day 2 hours', 'A320', 4500, 28.6, 77.1, 19.1, 72.9),
('SF102', 'DEL', 'BOM', NOW() + interval '2 days', NOW() + interval '2 days 2 hours', 'B737', 5200, 28.6, 77.1, 19.1, 72.9),
('SF201', 'BOM', 'BLR', NOW() + interval '1 day 4 hours', NOW() + interval '1 day 5 hours 30 minutes', 'A320', 3800, 19.1, 72.9, 13.2, 77.7),
('SF202', 'BOM', 'BLR', NOW() + interval '3 days', NOW() + interval '3 days 1 hour 30 minutes', 'A321', 4100, 19.1, 72.9, 13.2, 77.7),
('SF301', 'DEL', 'BLR', NOW() + interval '1 day 6 hours', NOW() + interval '1 day 8 hours', 'A320', 5500, 28.6, 77.1, 13.2, 77.7),
('SF302', 'DEL', 'BLR', NOW() + interval '4 days', NOW() + interval '4 days 2 hours', 'B787', 6200, 28.6, 77.1, 13.2, 77.7),
('SF401', 'BLR', 'HYD', NOW() + interval '2 days', NOW() + interval '2 days 1 hour', 'ATR72', 2800, 13.2, 77.7, 17.4, 78.5),
('SF402', 'BLR', 'HYD', NOW() + interval '5 days', NOW() + interval '5 days 1 hour', 'A320', 3100, 13.2, 77.7, 17.4, 78.5);

DO $$
DECLARE
  f RECORD;
  i int;
  seat_class text;
  rows_per_class int;
  class_fees numeric[];
BEGIN
  class_fees := ARRAY[0, 800, 2000];
  FOR f IN SELECT id FROM flights LOOP
    FOR seat_class, rows_per_class IN
      SELECT * FROM (VALUES ('economy', 30), ('business', 12), ('first', 6)) AS t(c, n)
    LOOP
      FOR i IN 1..rows_per_class LOOP
        INSERT INTO seats (flight_id, seat_number, class, extra_fee)
        VALUES (
          f.id,
          UPPER(LEFT(seat_class, 1)) || LPAD(i::text, 2, '0'),
          seat_class,
          CASE seat_class
            WHEN 'economy' THEN (random() * 300)::numeric
            WHEN 'business' THEN 500 + (random() * 500)::numeric
            ELSE 1500 + (random() * 1000)::numeric
          END
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
