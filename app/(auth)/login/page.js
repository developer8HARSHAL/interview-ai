// app/(auth)/login/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Check if user just registered
  useEffect(() => {
    if (searchParams) {
      const registeredParam = searchParams.get('registered');
      if (registeredParam === 'true') {
        toast({
          title: 'Registration Successful',
          description: 'You can now log in with your new account.',
          variant: 'success',
        });
      }
      
      const errorParam = searchParams.get('error');
      if (errorParam) {
        setError('Authentication failed. Please check your credentials.');
      }
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
        setLoading(false);
      } else {
        // Immediate redirect to home page
        router.push('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // You'll need to implement this using a Google Auth library
    // This is a placeholder for the OAuth flow
    window.location.href = '/api/auth/google/authorize';
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-center p-4 mb-2 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100"
              onClick={handleGoogleLogin}
            >
              Google
            </Button>
          </form>
          
          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-800">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}