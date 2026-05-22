import { NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred'
): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.userMessage },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status: 500 }
  );
}
