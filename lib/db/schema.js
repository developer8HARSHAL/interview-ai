import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// User Schema
const userSchema = new Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,  // Ensures consistent email storage
      index: true       // Optimizes queries
    },
    password: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true } // ✅ Automatically handles createdAt & updatedAt
);

// Conversation Schema
const conversationSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt
);

// Message Schema
const messageSchema = new Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true }
  },
  { timestamps: true }
);

// Interview Questions Schema
const interviewQuestionSchema = new Schema(
  {
    category: { type: String, required: true, index: true }, // ✅ Optimized for queries
    question: { type: String, required: true },
    expectedAnswer: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// Export models (prevents redefinition errors)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const InterviewQuestion = mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', interviewQuestionSchema);

export { User, Conversation, Message, InterviewQuestion };
