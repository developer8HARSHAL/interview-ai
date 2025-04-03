// app/api/auth/google/authorize/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;
    const scope = "email profile";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.redirect(`/login?error=google_auth_failed`);
  }
}