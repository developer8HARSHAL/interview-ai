import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
export const prisma = new PrismaClient();

// MongoDB Connection (fixing incorrect variable usage)
const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/interview-prep";

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
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export a wrapper function to handle both Mongoose and Prisma
export default async function db() {
  await connectDB();
  return { mongoose, prisma };
}
