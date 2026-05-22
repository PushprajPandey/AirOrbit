ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY flights_select ON flights
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY seats_select ON seats
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY bookings_select ON bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY bookings_insert ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookings_update ON bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY passengers_select ON passengers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = passengers.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY passengers_insert ON passengers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = passengers.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY passengers_update ON passengers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = passengers.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY reschedules_select ON reschedules
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reschedules.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY reschedules_insert ON reschedules
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reschedules.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY reschedules_update ON reschedules
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reschedules.booking_id AND b.user_id = auth.uid()
    )
  );
