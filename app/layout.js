// app/layout.js
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { NextAuthProvider } from './providers';
import { AuthProvider } from '@/lib/auth-context';

export const metadata = {
  title: 'Interview AI',
  description: 'Practice your interview skills with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <NextAuthProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}