import mongoose from 'mongoose';

// MongoDB Connection - explicitly use 127.0.0.1 instead of localhost
const MONGODB_URI = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/interview-prep";

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4  // Force using IPv4 instead of IPv6
    };

    console.log('Connecting to MongoDB at:', MONGODB_URI);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }
}

// Export a wrapper function that only uses Mongoose for now
export default async function db() {
  await connectDB();
  return { mongoose };
}