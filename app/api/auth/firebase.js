// app/api/auth/firebase.js
import { 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signOut
  } from "firebase/auth";
  import { auth } from '../../../firebase.config';
  
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