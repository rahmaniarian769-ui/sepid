import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie');
  const isAuthenticated = cookie?.includes('admin-token=authenticated');
  
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 });
}