import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newAppointment = await Appointment.create(body);
    return NextResponse.json({ success: true, data: newAppointment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت نوبت' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    await dbConnect();
    await Appointment.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}