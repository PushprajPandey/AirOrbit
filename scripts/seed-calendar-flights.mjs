/**
 * Seeds CAL-* flights for the next 30 days (IST). Run once:
 *   node scripts/seed-calendar-flights.mjs
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  const text = readFileSync('.env.local', 'utf8');
  const env = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const ROUTES = [
  ['DEL', 'BOM', 'M', '06:30', '08:45', 'A320', 4200, 28.6, 77.1, 19.1, 72.9],
  ['DEL', 'BOM', 'E', '18:15', '20:30', 'B737', 4800, 28.6, 77.1, 19.1, 72.9],
  ['BOM', 'BLR', 'M', '07:00', '08:25', 'A320', 3600, 19.1, 72.9, 13.2, 77.7],
  ['BOM', 'BLR', 'E', '19:45', '21:10', 'A321', 3950, 19.1, 72.9, 13.2, 77.7],
  ['DEL', 'BLR', 'M', '08:00', '10:15', 'A320', 5200, 28.6, 77.1, 13.2, 77.7],
  ['DEL', 'BLR', 'E', '17:30', '19:45', 'B787', 5800, 28.6, 77.1, 13.2, 77.7],
  ['BLR', 'HYD', 'M', '06:15', '07:20', 'ATR72', 2600, 13.2, 77.7, 17.4, 78.5],
  ['BLR', 'HYD', 'E', '20:00', '21:05', 'A320', 2900, 13.2, 77.7, 17.4, 78.5],
];

const COLS = ['A', 'B', 'C', 'D', 'E'];
const CABINS = [
  ['first', 1, 2],
  ['business', 3, 5],
  ['economy', 6, 14],
];

function istDateString(offsetDays) {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  ist.setDate(ist.getDate() + offsetDays);
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, '0');
  const d = String(ist.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function istIso(dateYmd, time) {
  const y = dateYmd.slice(0, 4);
  const mo = dateYmd.slice(4, 6);
  const d = dateYmd.slice(6, 8);
  return `${y}-${mo}-${d}T${time}:00+05:30`;
}

const env = loadEnv();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

let inserted = 0;
let skipped = 0;

for (let day = 0; day <= 30; day++) {
  const ymd = istDateString(day);
  for (const [origin, destination, slot, dep, arr, aircraft, price, olat, olon, dlat, dlon] of ROUTES) {
    const flightNo = `CAL-${origin}-${destination}-${ymd}-${slot}`;
    const { data: existing } = await supabase
      .from('flights')
      .select('id')
      .eq('flight_no', flightNo)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const { data: flight, error } = await supabase
      .from('flights')
      .insert({
        flight_no: flightNo,
        origin,
        destination,
        departs_at: istIso(ymd, dep),
        arrives_at: istIso(ymd, arr),
        aircraft_type: aircraft,
        base_price: price,
        origin_lat: olat,
        origin_lon: olon,
        dest_lat: dlat,
        dest_lon: dlon,
        status: 'scheduled',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Flight insert failed', flightNo, error.message);
      continue;
    }

    const seatRows = [];
    for (const [seatClass, rowStart, rowEnd] of CABINS) {
      for (let row = rowStart; row <= rowEnd; row++) {
        for (const col of COLS) {
          seatRows.push({
            flight_id: flight.id,
            seat_number: `${row}${col}`,
            class: seatClass,
            extra_fee: 0,
          });
        }
      }
    }

    const { error: seatErr } = await supabase.from('seats').insert(seatRows);
    if (seatErr) {
      console.error('Seats failed', flightNo, seatErr.message);
    } else {
      inserted++;
    }
  }
}

console.log(`Done. New flights: ${inserted}, skipped (existing): ${skipped}`);
