import bcrypt from 'bcryptjs';
import { connectDB } from '../db';
import { User } from '../db/schema';
import { signIn } from 'next-auth/react';

// Register a new user with email and password
export async function registerWithEmailAndPassword(email, password, name) {
  try {
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { 
        success: false, 
        error: "Email already in use. Please try a different email or log in." 
      };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    
    return { 
      success: true, 
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: "Failed to register. Please try again." 
    };
  }
}

// Login with email and password using NextAuth
export async function loginWithEmailAndPassword(email, password) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    
    if (result.error) {
      return { 
        success: false, 
        error: "Invalid email or password." 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: "Failed to login. Please try again." 
    };
  }
}

// Get current session user
export async function getCurrentUser(session) {
  if (!session?.user?.id) return null;
  
  try {
    await connectDB();
    const user = await User.findById(session.user.id).lean();
    
    if (!user) return null;
    
    // Remove password and convert _id to string
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      _id: user._id.toString()
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}