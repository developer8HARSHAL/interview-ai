// app/interview/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatWindow from '../../components/chat/chat-window' ;

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const categoryOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'sql', label: 'SQL' },
  { value: 'system-design', label: 'System Design' },
  { value: 'algorithms', label: 'Algorithms' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'random', label: 'Random Mix' },
];

export default function InterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const startInterview = async () => {
    if (!category || !difficulty) {
      setError('Please select both a category and difficulty level');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch questions based on selected category and difficulty
      const response = await fetch(`/api/questions?category=${category}&difficulty=${difficulty}&count=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch interview questions');
      }
      
      const data = await response.json();
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }
      
      setQuestions(data.questions);
      
      // Create a new conversation
      const conversationResponse = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${category} Interview (${difficulty})`,
        }),
      });
      
      if (!conversationResponse.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const conversationData = await conversationResponse.json();
      setConversation(conversationData.conversation);
      
      setIsInterviewStarted(true);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of interview
      alert('Congratulations! You have completed the interview.');
      setIsInterviewStarted(false);
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isInterviewStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Start a Practice Interview</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Interview Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select difficulty</option>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? 'Setting up interview...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  // Interview in progress
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-semibold">
            {category} Interview ({difficulty})
          </h2>
          <p className="mt-1 text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">
              {questions[currentQuestionIndex]?.question}
            </h3>
          </div>
          
          {conversation && (
            <ChatWindow
              conversationId={conversation._id}
              currentQuestion={questions[currentQuestionIndex]}
              onNextQuestion={handleNextQuestion}
            />
          )}
        </div>
      </div>
    </div>
  );
}