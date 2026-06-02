import { NextResponse } from 'next/server';

let appointments: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAppointment = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending' // possible: pending, confirmed, cancelled, completed, contacted
    };
    appointments.unshift(newAppointment);
    return NextResponse.json({ success: true, data: newAppointment });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  // مرتب‌سازی نزولی بر اساس تاریخ (جدیدترین اول)
  const sorted = [...appointments].sort((a,b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    appointments = appointments.map(apt =>
      apt._id === id ? { ...apt, status } : apt
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}