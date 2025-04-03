// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/schema";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Return success without password
    return NextResponse.json(
      { 
        success: true,
        message: "User registered successfully", 
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}