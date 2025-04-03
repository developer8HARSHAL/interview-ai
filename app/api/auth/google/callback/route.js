// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/schema";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.redirect(`/login?error=missing_code`);
    }
    
    // Exchange the code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(`/login?error=token_exchange_failed`);
    }
    
    // Get the user's info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const googleUser = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("User info error:", googleUser);
      return NextResponse.redirect(`/login?error=user_info_failed`);
    }
    
    await connectDB();
    
    // Find or create user
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create a new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        // Generate a random password since we don't need it for Google auth
        password: (await import("crypto")).randomBytes(32).toString("hex"),
        googleId: googleUser.sub,
        // Add other fields as needed
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID
      user.googleId = googleUser.sub;
      await user.save();
    }
    
    // Create JWT token
    const token = sign(
      { 
        id: user._id.toString(),
        email: user.email 
      },
      process.env.JWT_SECRET || "default_secret_change_this",
      { expiresIn: "7d" }
    );
    
    // Set cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    // Redirect to home page
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`);
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(`/login?error=callback_failed`);
  }
}