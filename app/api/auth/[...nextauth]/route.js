import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/schema";

// Define the auth options
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user) {
            return null;
          }
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordValid) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the homepage after authentication
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV === "development",
};

// Create the handler
const handler = NextAuth(authOptions);

// Export the handler for App Router
export { handler as GET, handler as POST };