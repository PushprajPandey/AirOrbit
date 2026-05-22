import { apiError, apiSuccess } from '@/lib/api/response';
import { UnauthorizedError } from '@/lib/errors';
import { handleSupabaseError } from '@/lib/supabase/handleSupabaseError';
import { createRouteClient } from '@/lib/supabase/route';
import { callRpc } from '@/lib/supabase/rpc';

export async function GET(request: Request) {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    if (!origin || !destination) {
      return apiError(new Error('Missing origin or destination'));
    }

    const { data, error } = await callRpc(supabase, 'get_routes_between', {
      p_origin: origin,
      p_destination: destination,
    });

    if (error) throw handleSupabaseError(error);
    return apiSuccess(data ?? []);
  } catch (error) {
    return apiError(error);
  }
}
