import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    
    // In production, this would be an array of pins or DB table.
    // For this test build, we use the ENV var default (4242)
    if (pin === process.env.SCANNER_PIN) {
      const cookieStore = await cookies();
      cookieStore.set('nyx_scanner_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/scanner',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      // Also set a generic auth cookie for API routes since they might be at /api/scan not /scanner
      cookieStore.set('nyx_api_scanner_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/scan',
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
