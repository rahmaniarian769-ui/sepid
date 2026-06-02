import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    console.log('رمز وارد شده:', password); // برای دیباگ
    
    // رمز پیشفرض: 123456
    if (password === '123456') {
      const response = NextResponse.json({ success: true, message: 'ورود موفق' });
      response.cookies.set('admin-token', 'authenticated', {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }
    
    return NextResponse.json({ error: 'رمز عبور اشتباه است' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در سرور' }, { status: 500 });
  }
}