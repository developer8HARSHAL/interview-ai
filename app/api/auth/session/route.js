import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/schema";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // ✅ Await `cookies()` before accessing its value
    const cookieStore = await cookies();  
    const token = await cookieStore.get("auth-token")?.value; 

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      // Verify token
      const decoded = verify(
        token, 
        process.env.JWT_SECRET || "default_secret_change_this"
      );

      await connectDB();

      // Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return NextResponse.json({ user: null });
      }

      // Return user data
      return NextResponse.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      });
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
