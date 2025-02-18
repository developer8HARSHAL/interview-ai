 
// components/chat/chat-window.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Message from './message';
import InputBox from './input-box';
import { generateInitialPrompt } from '@/lib/gemini/client';

export default function ChatWindow({ conversationId, currentQuestion, onNextQuestion }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      
      try {
        const response = await fetch(`/api/chat?conversationId=${conversationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Add initial AI message when a new question is presented
  useEffect(() => {
    const addInitialPrompt = async () => {
      if (!currentQuestion || !conversationId || messages.length > 0) return;
      
      try {
        setLoading(true);
        
        // Generate initial prompt based on the question
        const initialPrompt = await generateInitialPrompt(
          currentQuestion,
          currentQuestion.difficulty
        );
        
        // Save the initial prompt as a message
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            message: `SYSTEM: Initialize interview with question: ${currentQuestion.question}`,
            role: 'system',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save initial prompt');
        }
        
        // Fetch updated messages
        const messagesResponse = await fetch(`/api/chat?conversationId=${conversationId}`);
        const data = await messagesResponse.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error adding initial prompt:', err);
        setError('Failed to start interview');
      } finally {
        setLoading(false);
      }
    };

    addInitialPrompt();
  }, [conversationId, currentQuestion, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || !conversationId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: content,
          questionData: currentQuestion,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Fetch updated messages
      const messagesResponse = await fetch(`/api/chat?conversationId=${conversationId}`);
      const data = await messagesResponse.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {messages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading interview...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Message
                key={message._id}
                content={message.content}
                role={message.role}
                timestamp={message.createdAt}
              />
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <InputBox onSendMessage={handleSendMessage} disabled={loading} />
          {currentQuestion && (
            <button
              onClick={onNextQuestion}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}