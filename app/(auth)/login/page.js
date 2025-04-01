"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginWithEmailAndPassword, signInWithGoogle, auth } from '../../api/auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/profile');
      }
    });

    // Check if user just registered
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      toast({
        title: 'Registration Successful',
        description: 'You can now log in with your new account.',
        variant: 'success',
      });
    }

    return () => unsubscribe();
  }, [router, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await loginWithEmailAndPassword(email, password);
      
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
        setLoading(false);
      } else {
        // Show success message
        setSuccess(true);
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in.',
          variant: 'success',
        });
        
        // Redirect to profile page after successful login
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        setError(result.error || 'Google sign-in failed');
        setLoading(false);
      } else {
        // Show success message
        setSuccess(true);
        toast({
          title: 'Login Successful',
          description: 'You have successfully signed in with Google.',
          variant: 'success',
        });
        
        // Redirect to profile page after successful Google sign-in
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center p-4 mb-4 bg-green-50 text-green-700 rounded-md border border-green-200">
              Successfully logged in! Redirecting to profile page...
            </div>
          ) : (
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
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                Sign in with Google
              </Button>
            </form>
          )}
          
          {!success && (
            <p className="text-center mt-4 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-800">
                Register
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}