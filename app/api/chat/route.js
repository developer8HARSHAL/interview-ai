 
// app/api/chat/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createMessage, getMessagesByConversationId } from '@/lib/utils/helpers';
import { generateInterviewResponse, generateInitialPrompt } from '@/lib/gemini/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { conversationId, message, questionData } = await req.json();
    
    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Save user message
    await createMessage({
      conversationId,
      content: message,
      role: 'user',
    });
    
    // Generate AI response
    let aiResponse;
    if (questionData) {
      aiResponse = await generateInterviewResponse(message, questionData.question, questionData.difficulty);
    } else {
      // Use a more generic response if not in interview mode
      aiResponse = "I'm your interview assistant. How can I help you prepare for your interviews?";
    }
    
    // Save AI response
    const savedResponse = await createMessage({
      conversationId,
      content: aiResponse,
      role: 'assistant',
    });
    
    return NextResponse.json(
      { message: savedResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversation ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const messages = await getMessagesByConversationId(conversationId);
    
    return NextResponse.json(
      { messages },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}