import { apiError, apiSuccess } from '@/lib/api/response';
import { UnauthorizedError } from '@/lib/errors';
import { handleSupabaseError } from '@/lib/supabase/handleSupabaseError';
import { createRouteClient } from '@/lib/supabase/route';
import { callRpc } from '@/lib/supabase/rpc';
import { generatePnr } from '@/lib/utils';

interface BookingItem {
  seatId: string;
  totalPrice: number;
  passenger: {
    fullName: string;
    passportNo: string;
    nationality: string;
    dob: string;
  };
}

export async function GET() {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const { data, error } = await supabase
      .from('bookings')
      .select(`*, flight:flights(*), seat:seats(*), passengers(*)`)
      .eq('user_id', user.id)
      .order('booked_at', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return apiSuccess(data ?? []);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const body = (await request.json()) as {
      flightId: string;
      pnrCode?: string;
      items: BookingItem[];
    };

    const pnrCode = body.pnrCode ?? generatePnr();
    const bookingIds: string[] = [];

    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i]!;
      const itemPnr =
        body.items.length === 1 ? pnrCode : `${pnrCode}${String(i + 1)}`;

      const { data: bookingId, error: rpcError } = await callRpc(
        supabase,
        'reserve_seat',
        {
          p_seat_id: item.seatId,
          p_flight_id: body.flightId,
          p_user_id: user.id,
          p_total_price: item.totalPrice,
          p_pnr_code: itemPnr,
        }
      );

      if (rpcError) throw handleSupabaseError(rpcError);

      const id = bookingId as string;
      bookingIds.push(id);

      const { error: passengerError } = await supabase.from('passengers').insert({
        booking_id: id,
        full_name: item.passenger.fullName,
        passport_no: item.passenger.passportNo,
        nationality: item.passenger.nationality,
        dob: item.passenger.dob,
      } as never);

      if (passengerError) throw handleSupabaseError(passengerError);
    }

    const totalPrice = body.items.reduce((sum, i) => sum + i.totalPrice, 0);

    return apiSuccess(
      { bookingIds, pnrCode, totalPrice, passengerCount: body.items.length },
      201
    );
  } catch (error) {
    return apiError(error);
  }
}
