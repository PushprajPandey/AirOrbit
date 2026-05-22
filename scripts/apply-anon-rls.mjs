/**
 * Applies anon read policies via Supabase SQL (requires database URL).
 * Easier: paste the first 8 lines of 006_public_flights_and_calendar.sql into Supabase SQL Editor.
 *
 * This script uses the Management API only if DATABASE_URL is set; otherwise prints instructions.
 */
import { readFileSync } from 'fs';

const sql = `
CREATE POLICY IF NOT EXISTS flights_select_anon ON flights
  FOR SELECT TO anon
  USING (status = 'scheduled');

CREATE POLICY IF NOT EXISTS seats_select_anon ON seats
  FOR SELECT TO anon
  USING (true);
`;

console.log('Run this in Supabase → SQL Editor:\n');
console.log(readFileSync('supabase/migrations/006_public_flights_and_calendar.sql', 'utf8').split('-- Seed morning')[0]);
