// lib/auth-context.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Check if first visit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const visitedBefore = localStorage.getItem('visitedBefore');
      if (!visitedBefore) {
        setIsFirstVisit(true);
        localStorage.setItem('visitedBefore', 'true');
        
        // Redirect first-time visitors to login after a delay if not authenticated
        if (!user) {
          const timer = setTimeout(() => {
            router.push('/login');
          }, 5000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [router, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
        variant: 'success',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto login after registration
      const loginRes = await login(email, password);
      if (!loginRes.success) {
        throw new Error(loginRes.error || 'Auto-login failed');
      }

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created.',
        variant: 'success',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (code) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      setUser(data.user);
      toast({
        title: 'Login Successful',
        description: 'Welcome!',
        variant: 'success',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Google auth error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const value = {
    user,
    loading,
    isFirstVisit,
    login,
    register,
    googleAuth,
    logout,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);