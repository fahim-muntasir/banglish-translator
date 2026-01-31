import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.redirect(
      new URL('/payment/failed', request.url)
    );
  } catch (error) {
    console.error('Fail callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/error', request.url)
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.log('Payment fail params:', Object.fromEntries(searchParams));
  
  return NextResponse.redirect(
    new URL('/payment/failed', request.url)
  );
}