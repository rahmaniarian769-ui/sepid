import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  phone: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || 
  mongoose.model('Appointment', AppointmentSchema);