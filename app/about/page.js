// app/about/page.js
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Interview AI</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg text-gray-700 mb-6">
          Interview AI was created to help job seekers practice and improve their interview skills using artificial intelligence. Our platform uses advanced AI technology to simulate realistic interview scenarios and provide helpful feedback.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Whether you're preparing for a technical interview, behavioral questions, or just want to build confidence, our AI assistant can help you refine your responses and approach interviews with more confidence.
        </p>
      </div>
      
      <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">1. Choose Your Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Select the type of interview and difficulty level that matches your needs.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">2. Practice with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Engage in a realistic interview conversation with our AI assistant.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">3. Get Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Receive personalized feedback and suggestions for improvement.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Technology</h2>
        <p className="text-lg text-gray-700 mb-6">
          Interview AI leverages Google's Gemini AI technology to create natural, responsive interview experiences. Our system analyzes your responses in real-time to provide tailored feedback that helps you improve.
        </p>
        <p className="text-lg text-gray-700">
          We continuously update our question bank and AI capabilities to ensure you're practicing with the most current and relevant interview scenarios.
        </p>
      </div>
    </div>
  );
}