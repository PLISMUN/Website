import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
}