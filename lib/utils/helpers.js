 
// lib/utils/helpers.js
import { User, Conversation, Message, InterviewQuestion } from '../db/schema';

// User Functions
export async function createUser(userData) {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// Conversation Functions
export async function createConversation(conversationData) {
  try {
    const conversation = new Conversation(conversationData);
    return await conversation.save();
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

export async function getConversationsByUserId(userId) {
  try {
    return await Conversation.find({ userId }).sort({ updatedAt: -1 });
  } catch (error) {
    console.error('Error finding conversations:', error);
    throw error;
  }
}

// Message Functions
export async function createMessage(messageData) {
  try {
    const message = new Message(messageData);
    return await message.save();
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function getMessagesByConversationId(conversationId) {
  try {
    return await Message.find({ conversationId }).sort({ createdAt: 1 });
  } catch (error) {
    console.error('Error finding messages:', error);
    throw error;
  }
}

// Interview Questions Functions
export async function getRandomQuestions(category, difficulty, count = 5) {
  try {
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    return await InterviewQuestion.aggregate([
      { $match: query },
      { $sample: { size: count } }
    ]);
  } catch (error) {
    console.error('Error getting random questions:', error);
    throw error;
  }
}

export async function getQuestionsByCategory(category) {
  try {
    return await InterviewQuestion.find({ category });
  } catch (error) {
    console.error('Error finding questions by category:', error);
    throw error;
  }
}

// Time and Date Helpers
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getTimeDifference(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}