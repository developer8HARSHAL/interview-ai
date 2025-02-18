 
// lib/gemini/client.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const INTERVIEW_PROMPT = `
You are an expert technical interviewer for software engineering positions. Your goal is to evaluate the candidate's response to the following question:

QUESTION: {question}

When evaluating their response, please consider:
1. Technical accuracy and depth of knowledge
2. Problem-solving approach
3. Communication clarity
4. Areas for improvement

Provide constructive feedback and follow-up questions if needed. Remember to be professional and supportive while still maintaining high standards. If their response is incorrect or incomplete, guide them towards the right answer without being too direct.

The difficulty level is: {difficulty}
`;

export async function generateInterviewResponse(userMessage, question, difficulty) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = INTERVIEW_PROMPT
      .replace('{question}', question.question)
      .replace('{difficulty}', difficulty);
    
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will evaluate the candidate\'s responses based on the criteria you provided.' }],
        },
        {
          role: 'user',
          parts: [{ text: 'The candidate says: ' + userMessage }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Error generating interview response:', error);
    return 'I apologize, but I encountered an issue while processing your response. Let\'s try again.';
  }
}

export async function generateInitialPrompt(question, difficulty) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    You're an expert technical interviewer conducting a ${difficulty} level interview.
    
    Your first question for the candidate is: "${question.question}"
    
    Please provide a brief introduction and ask this question in a professional manner.
    Keep your response under 150 words. Don't provide any hints or solutions.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Error generating initial prompt:', error);
    return `Let's get started with your interview. ${question.question}`;
  }
}