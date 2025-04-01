// import NextAuth from 'next-auth';
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDB } from '@/lib/db';
// import { User } from '@/lib/db/schema';
// import bcrypt from 'bcryptjs';

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }
//         console.log("CredentialsProvider:", typeof CredentialsProvider); 
//         await connectDB();
        
//         const user = await User.findOne({ email: credentials.email });
        
//         if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
//           return null;
//         }
        
//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       }
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//   },
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// app/api/auth/[...nextauth]/route.js

// app/api/auth/[...nextauth]/route.js
// app/api/auth/firebase.js
// app/api/auth/firebase.js
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from '../../../../firebase.config';

const googleProvider = new GoogleAuthProvider();

// Sign in with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    
    // Provide more user-friendly error messages
    let errorMessage = "Failed to login. Please try again.";
    if (error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid email or password.";
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email.";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Incorrect password.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later.";
    }
    
    return { success: false, error: errorMessage, errorCode: error.code };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Google sign-in error:", error.code, error.message);
    return { 
      success: false, 
      error: error.message || "Google sign-in failed",
      errorCode: error.code 
    };
  }
};

// Register a new user
export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
    
    let errorMessage = "Failed to register. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Email already in use. Please try a different email or log in.";
    }
    
    return { success: false, error: errorMessage, errorCode: error.code };
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Export auth for state management
export { auth };