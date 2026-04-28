import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
  details?: unknown;
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export function errorResponse(
  message: string,
  code: number = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  const statusCode = code === 401 ? 401 : 500;

  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
      details,
    },
    { status: statusCode }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return errorResponse(error.message);
  }

  return errorResponse('Unknown error occurred');
}
