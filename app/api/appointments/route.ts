import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.name || !body.lastName || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات ناقص است' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create(body);
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, status } = await request.json();
    await Appointment.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}