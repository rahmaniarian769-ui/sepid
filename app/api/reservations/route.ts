import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const appointment = await Appointment.create(body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'نوبت با موفقیت ثبت شد',
      data: appointment 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نوبت' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json([]);
  }
}