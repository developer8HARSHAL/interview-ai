// app/providers.jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider as CustomAuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        {children}
        <Toaster />
      </CustomAuthProvider>
    </SessionProvider>
  );
}