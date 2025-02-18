// app/not-found.js
import Link from 'next/link';
import { Button } from '../components/ui/button' ;

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" passHref>
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}