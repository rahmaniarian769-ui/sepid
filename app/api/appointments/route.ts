import { NextResponse } from 'next/server';

// In-memory storage (temporary, but works immediately)
let appointments: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received appointment:', body);

    // Basic validation
    if (!body.name || !body.lastName || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAppointment = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    appointments.unshift(newAppointment);
    
    return NextResponse.json({ success: true, data: newAppointment });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
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
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}