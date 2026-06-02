import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  visitType: { type: String, enum: ['online', 'offline'], required: true },
  clinic: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);