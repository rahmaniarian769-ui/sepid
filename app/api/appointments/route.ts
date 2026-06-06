import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

// In-memory fallback storage (temporary)
let memoryAppointments: any[] = [];

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

    try {
      // Try to save to database
      const appointment = await Appointment.create(body);
      return NextResponse.json({ success: true, data: appointment });
    } catch (dbError) {
      console.warn('Database error, falling back to memory:', dbError);
      // Fallback to in-memory
      const newAppointment = {
        _id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      memoryAppointments.unshift(newAppointment);
      return NextResponse.json({ success: true, data: newAppointment, fallback: true });
    }
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
    // Combine DB and memory appointments (avoid duplicates by _id)
    const allIds = new Set(appointments.map(a => a._id.toString()));
    const uniqueMemory = memoryAppointments.filter(m => !allIds.has(m._id));
    return NextResponse.json([...appointments, ...uniqueMemory]);
  } catch (error) {
    // If DB fails, return memory appointments
    return NextResponse.json(memoryAppointments);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    // Try to update in DB
    try {
      await dbConnect();
      await Appointment.findByIdAndUpdate(id, { status });
    } catch (dbError) {
      // Update in memory instead
      memoryAppointments = memoryAppointments.map(apt =>
        apt._id === id ? { ...apt, status } : apt
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}