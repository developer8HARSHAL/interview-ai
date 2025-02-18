// app/api/chat/history/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { createConversation, getConversationsByUserId } from '@/lib/utils/helpers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const conversations = await getConversationsByUserId(session.user.id);
    
    return NextResponse.json(
      { conversations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation history' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { title } = await req.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const conversation = await createConversation({
      userId: session.user.id,
      title,
    });
    
    return NextResponse.json(
      { conversation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}