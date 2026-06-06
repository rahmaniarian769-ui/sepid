import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.name || !body.lastName || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'لطفاً همه فیلدها را پر کنید' },
        { status: 400 }
      );
    }

    const newAppointment = await Appointment.create({
      name: body.name,
      lastName: body.lastName,
      phone: body.phone,
      visitType: body.visitType,
      clinic: body.clinic,
      status: 'pending',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'نوبت شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.',
      data: newAppointment
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور، لطفاً دوباره تلاش کنید' },
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
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
