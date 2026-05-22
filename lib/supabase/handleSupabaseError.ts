import type { PostgrestError } from '@supabase/supabase-js';
import {
  AppError,
  CancellationBlockedError,
  ConflictError,
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/errors';

export function handleSupabaseError(error: PostgrestError | Error): AppError {
  if ('code' in error) {
    const pgError = error as PostgrestError;

    if (pgError.code === 'PGRST116') {
      return new NotFoundError();
    }
    if (pgError.code === '23505') {
      return new ConflictError();
    }
    if (pgError.code === '42501') {
      return new UnauthorizedError();
    }
    if (
      pgError.message?.includes('cancellation_window_violation') ||
      pgError.details?.includes('cancellation_window_violation')
    ) {
      return new CancellationBlockedError();
    }
    if (
      pgError.message?.includes('seat_unavailable') ||
      pgError.code === 'P0001'
    ) {
      return new ConflictError(
        'That seat was just taken — please choose another'
      );
    }
  }

  if (error.message?.includes('cancellation_window_violation')) {
    return new CancellationBlockedError();
  }

  if (error.message?.includes('seat_unavailable')) {
    return new ConflictError(
      'That seat was just taken — please choose another'
    );
  }

  return new DatabaseError();
}
