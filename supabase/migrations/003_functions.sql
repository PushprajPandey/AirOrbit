CREATE OR REPLACE FUNCTION reserve_seat(
  p_seat_id uuid,
  p_flight_id uuid,
  p_user_id uuid,
  p_total_price numeric,
  p_pnr_code text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seat_id uuid;
  v_booking_id uuid;
BEGIN
  SELECT id INTO v_seat_id
  FROM seats
  WHERE id = p_seat_id AND flight_id = p_flight_id AND is_available = true
  FOR UPDATE SKIP LOCKED;

  IF v_seat_id IS NULL THEN
    RAISE EXCEPTION 'seat_unavailable' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO bookings (user_id, flight_id, seat_id, total_price, pnr_code)
  VALUES (p_user_id, p_flight_id, p_seat_id, p_total_price, p_pnr_code)
  RETURNING id INTO v_booking_id;

  UPDATE seats SET is_available = false WHERE id = p_seat_id;

  RETURN v_booking_id;
END;
$$;

CREATE OR REPLACE FUNCTION cancel_booking(p_booking_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seat_id uuid;
  v_departs_at timestamptz;
BEGIN
  SELECT b.seat_id, f.departs_at
  INTO v_seat_id, v_departs_at
  FROM bookings b
  JOIN flights f ON f.id = b.flight_id
  WHERE b.id = p_booking_id AND b.user_id = p_user_id;

  IF v_seat_id IS NULL THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;

  IF NOW() > v_departs_at - interval '2 hours' THEN
    RAISE EXCEPTION 'cancellation_window_violation';
  END IF;

  UPDATE bookings SET status = 'cancelled' WHERE id = p_booking_id;
  UPDATE seats SET is_available = true WHERE id = v_seat_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION get_routes_between(p_origin text, p_destination text)
RETURNS TABLE (
  id uuid,
  flight_no text,
  departs_at timestamptz,
  arrives_at timestamptz,
  base_price numeric,
  aircraft_type text,
  origin_lat numeric,
  origin_lon numeric,
  dest_lat numeric,
  dest_lon numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    f.id,
    f.flight_no,
    f.departs_at,
    f.arrives_at,
    f.base_price,
    f.aircraft_type,
    f.origin_lat,
    f.origin_lon,
    f.dest_lat,
    f.dest_lon
  FROM flights f
  WHERE f.origin = p_origin
    AND f.destination = p_destination
    AND f.departs_at > NOW()
    AND f.status = 'scheduled';
$$;

GRANT EXECUTE ON FUNCTION reserve_seat TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_booking TO authenticated;
GRANT EXECUTE ON FUNCTION get_routes_between TO authenticated;
