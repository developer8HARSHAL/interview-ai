// app/page.js
import { Button } from '../components/ui/button' ;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card' ;
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Ace Your Next Interview with AI</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Practice interviews with our AI assistant, get instant feedback, and improve your skills.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register" passHref>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </Link>
          <Link href="/about" passHref>
            <Button size="lg" variant="outline">Learn More</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Realistic Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Experience interview scenarios that mimic real-life interactions with AI-powered questions and responses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instant Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Receive immediate feedback on your answers to help you improve your interview skills in real-time.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customized Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose from various interview topics and difficulty levels tailored to your specific career goals.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Ready to improve your interview skills?</h2>
        <Link href="/register" passHref>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Start Practicing Now</Button>
        </Link>
      </div>
    </div>
  );
}