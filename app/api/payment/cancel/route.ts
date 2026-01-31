import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.redirect(
      new URL('/payment/cancelled', request.url)
    );
  } catch (error) {
    console.error('Cancel callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/error', request.url)
    );
  }
}

export async function GET(request: NextRequest) {
  
  return NextResponse.redirect(
    new URL('/payment/cancelled', request.url)
  );
}