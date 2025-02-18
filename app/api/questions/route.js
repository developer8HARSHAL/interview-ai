 
// app/api/questions/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getRandomQuestions, getQuestionsByCategory } from '@/lib/utils/helpers';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const count = searchParams.get('count') ? parseInt(searchParams.get('count')) : 5;

    await connectToDatabase();

    let questions;
    if (category === 'random') {
      questions = await getRandomQuestions(null, difficulty, count);
    } else if (category) {
      questions = await getQuestionsByCategory(category);
      
      // Apply difficulty filter if provided
      if (difficulty) {
        questions = questions.filter(q => q.difficulty === difficulty);
      }
      
      // Limit to requested count
      if (questions.length > count) {
        // Randomly select 'count' questions from all matching questions
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, count);
      }
    } else {
      questions = await getRandomQuestions(null, difficulty, count);
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview questions' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { category, question, expectedAnswer, difficulty, tags } = await req.json();
    
    // Basic validation
    if (!category || !question || !expectedAnswer || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Create new question using your schema
    const newQuestion = new InterviewQuestion({
      category,
      question,
      expectedAnswer,
      difficulty,
      tags: tags || []
    });
    
    await newQuestion.save();
    
    return NextResponse.json(
      { success: true, question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create interview question' },
      { status: 500 }
    );
  }
}