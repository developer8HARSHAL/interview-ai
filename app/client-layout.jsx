// app/client-layout.jsx
"use client";

import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}