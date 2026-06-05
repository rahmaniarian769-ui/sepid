import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request: Request) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database not connected. Please set MONGODB_URI.' }, { status: 500 });
    }
    const body = await request.json();
    const newAppointment = await Appointment.create(body);
    return NextResponse.json({ success: true, data: newAppointment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) return NextResponse.json([]);
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const conn = await dbConnect();
    if (!conn) return NextResponse.json({ success: false }, { status: 500 });
    const { id, status } = await request.json();
    await Appointment.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}