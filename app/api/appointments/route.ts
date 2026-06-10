import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newAppointment = await Appointment.create({
      name: body.name,
      lastName: body.lastName,
      phone: body.phone,
      visitType: body.visitType,
      clinic: body.clinic || '',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'نوبت شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.',
    });
  } catch (error) {
    console.error('Error saving appointment:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نوبت، لطفاً دوباره تلاش کنید.' },
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
    console.error('Error fetching appointments:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await dbConnect();
    await Appointment.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}