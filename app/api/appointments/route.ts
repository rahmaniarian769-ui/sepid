import { NextResponse } from 'next/server';

// ذخیره موقت در حافظه (بدون دیتابیس)
let appointments: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 دریافت نوبت جدید:", body);
    const newAppointment = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    appointments.unshift(newAppointment);
    return NextResponse.json({ success: true, message: 'نوبت ثبت شد', data: newAppointment });
  } catch (error) {
    console.error("❌ خطا:", error);
    return NextResponse.json({ success: false, message: 'خطا در سرور' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(appointments);
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