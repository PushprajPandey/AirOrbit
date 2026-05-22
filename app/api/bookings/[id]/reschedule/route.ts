import { apiError, apiSuccess } from '@/lib/api/response';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/lib/errors';
import { handleSupabaseError } from '@/lib/supabase/handleSupabaseError';
import { createRouteClient } from '@/lib/supabase/route';
import type { BookingRow, Flight } from '@/lib/supabase/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const { newFlightId } = (await request.json()) as { newFlightId: string };

    const { data: bookingRow, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (bookingError) throw handleSupabaseError(bookingError);
    const booking = bookingRow as BookingRow | null;
    if (!booking) throw new NotFoundError('Booking not found');

    const { data: oldFlight, error: oldFlightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', booking.flight_id)
      .single();

    if (oldFlightError) throw handleSupabaseError(oldFlightError);
    const oldFlightData = oldFlight as Flight | null;

    const { data: newFlightData, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', newFlightId)
      .single();

    if (flightError) throw handleSupabaseError(flightError);
    const newFlight = newFlightData as Flight | null;
    if (!newFlight) throw new NotFoundError('Flight not found');

    const oldBase = Number(oldFlightData?.base_price ?? 0);
    const newBase = Number(newFlight.base_price);
    const feeCharged = Math.max(0, newBase - oldBase);

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        flight_id: newFlightId,
        status: 'rescheduled',
      } as never)
      .eq('id', params.id);

    if (updateError) throw handleSupabaseError(updateError);

    const { error: rescheduleError } = await supabase.from('reschedules').insert({
      booking_id: params.id,
      old_flight_id: booking.flight_id,
      new_flight_id: newFlightId,
      fee_charged: feeCharged,
    } as never);

    if (rescheduleError) {
      if (rescheduleError.code === '23505') throw new ConflictError();
      throw handleSupabaseError(rescheduleError);
    }

    return apiSuccess({ rescheduled: true, feeCharged });
  } catch (error) {
    return apiError(error);
  }
}
