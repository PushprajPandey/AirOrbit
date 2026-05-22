import { apiError, apiSuccess } from '@/lib/api/response';
import { UnauthorizedError } from '@/lib/errors';
import { handleSupabaseError } from '@/lib/supabase/handleSupabaseError';
import { createRouteClient } from '@/lib/supabase/route';
import { callRpc } from '@/lib/supabase/rpc';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const { error } = await callRpc(supabase, 'cancel_booking', {
      p_booking_id: params.id,
      p_user_id: user.id,
    });

    if (error) throw handleSupabaseError(error);
    return apiSuccess({ cancelled: true });
  } catch (error) {
    return apiError(error);
  }
}
