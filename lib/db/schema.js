import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// User Schema
const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Conversation Schema
const conversationSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Message Schema
const messageSchema = new Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Interview Questions Schema
const interviewQuestionSchema = new Schema({
  category: { 
    type: String, 
    required: true 
  },
  question: { 
    type: String, 
    required: true 
  },
  expectedAnswer: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  tags: [{ 
    type: String 
  }]
});

// Export models (ensure they are not redefined)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const InterviewQuestion = mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', interviewQuestionSchema);

export { User, Conversation, Message, InterviewQuestion };
