import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

// In-memory fallback in case DB is not available
let memoryAppointments: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Try to save to MongoDB
    let dbConnected = true;
    try {
      await dbConnect();
      const newAppointment = await Appointment.create(body);
      return NextResponse.json({ success: true, data: newAppointment });
    } catch (dbError) {
      console.warn('DB error, falling back to memory:', dbError);
      dbConnected = false;
    }
    
    // Fallback to in-memory
    const newAppointment = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    memoryAppointments.unshift(newAppointment);
    return NextResponse.json({ success: true, data: newAppointment });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت نوبت' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Try to get from MongoDB
    try {
      await dbConnect();
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      if (appointments && appointments.length > 0) {
        return NextResponse.json(appointments);
      }
    } catch (dbError) {
      console.warn('DB read error, using memory:', dbError);
    }
    // Fallback to memory
    return NextResponse.json(memoryAppointments);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    // Try to update in MongoDB
    try {
      await dbConnect();
      const result = await Appointment.findByIdAndUpdate(id, { status });
      if (result) {
        return NextResponse.json({ success: true });
      }
    } catch (dbError) {
      console.warn('DB update error, using memory:', dbError);
    }
    // Fallback to memory
    memoryAppointments = memoryAppointments.map(apt =>
      apt._id === id ? { ...apt, status } : apt
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}