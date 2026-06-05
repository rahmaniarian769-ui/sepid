import mongoose from 'mongoose';

// Use default dummy value if not defined (for build time)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/temp';

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function dbConnect() {
  // If using dummy URI in production, log warning but don't crash
  if (MONGODB_URI === 'mongodb://localhost:27017/temp' && process.env.NODE_ENV === 'production') {
    console.warn('Warning: MONGODB_URI not set. Using dummy connection. Real database operations will fail.');
    return null;
  }
  
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}